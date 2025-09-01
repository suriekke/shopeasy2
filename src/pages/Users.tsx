import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '../lib/supabase'
import { Shield, ShieldOff, UserCheck, UserX, Search, Filter } from 'lucide-react'

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
    subscribeToUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const subscribeToUsers = () => {
    const subscription = supabase
      .channel('users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
        },
        () => {
          fetchUsers()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: isActive })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: isAdmin })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Error updating admin status:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'active' && user.is_active) ||
                         (filter === 'blocked' && !user.is_active) ||
                         (filter === 'admins' && user.is_admin)
    
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="admins">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {user.is_active ? (
                        <UserCheck className="h-5 w-5 text-green-500" />
                      ) : (
                        <UserX className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">
                          {user.full_name || 'No Name'}
                        </p>
                        {user.is_admin && (
                          <Shield className="ml-2 h-4 w-4 text-indigo-500" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <p>{user.email}</p>
                        <span className="mx-2">•</span>
                        <p>
                          Joined {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Active' : 'Blocked'}
                        </span>
                        {user.is_admin && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleUserStatus(user.id, !user.is_active)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md transition-colors ${
                        user.is_active
                          ? 'text-red-700 bg-red-100 hover:bg-red-200'
                          : 'text-green-700 bg-green-100 hover:bg-green-200'
                      }`}
                    >
                      {user.is_active ? 'Block' : 'Unblock'}
                    </button>
                    <button
                      onClick={() => toggleAdminStatus(user.id, !user.is_admin)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md transition-colors ${
                        user.is_admin
                          ? 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                          : 'text-indigo-700 bg-indigo-100 hover:bg-indigo-200'
                      }`}
                    >
                      {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'No users have been registered yet.'
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default Users
