import React, { useState, useEffect } from 'react';
import { supabase, subscribeToUsers } from '../supabaseClient';
import { User, Shield, ShieldOff, Mail, Calendar } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
    
    // Subscribe to real-time changes
    const subscription = subscribeToUsers((payload) => {
      if (payload.eventType === 'INSERT') {
        setUsers(prev => [...prev, payload.new]);
      } else if (payload.eventType === 'UPDATE') {
        setUsers(prev => prev.map(u => u.id === payload.new.id ? payload.new : u));
      } else if (payload.eventType === 'DELETE') {
        setUsers(prev => prev.filter(u => u.id !== payload.old.id));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const toggleAdminStatus = async (userId, currentStatus) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  const filteredUsers = filter === 'all' 
    ? users 
    : filter === 'active' 
    ? users.filter(user => user.is_active)
    : users.filter(user => !user.is_active);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      <div className="mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Active ({users.filter(u => u.is_active).length})
          </button>
          <button
            onClick={() => setFilter('blocked')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              filter === 'blocked'
                ? 'bg-red-100 text-red-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Blocked ({users.filter(u => !u.is_active).length})
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.full_name || 'No Name'}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Joined {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.is_admin && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Admin
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Blocked'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                      className={`p-2 rounded-md ${
                        user.is_admin 
                          ? 'text-purple-600 hover:text-purple-800' 
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    >
                      {user.is_admin ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => toggleUserStatus(user.id, user.is_active)}
                      className={`p-2 rounded-md ${
                        user.is_active 
                          ? 'text-red-600 hover:text-red-800' 
                          : 'text-green-600 hover:text-green-800'
                      }`}
                      title={user.is_active ? 'Block User' : 'Unblock User'}
                    >
                      {user.is_active ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;






