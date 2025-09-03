import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, Mail, Phone, Calendar, ShoppingBag, Search, Filter } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { usersAPI } from '../lib/api';

interface User {
  id: string;
  phone_number: string;
  name?: string;
  email?: string;
  created_at: string;
  total_orders?: number;
  total_spent?: number;
  last_order_date?: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedUsers = users
    .filter(user => 
      user.phone_number?.includes(searchTerm) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue = a[sortBy as keyof User];
      let bValue = b[sortBy as keyof User];
      
      if (sortBy === 'created_at') {
        aValue = new Date(a.created_at).getTime();
        bValue = new Date(b.created_at).getTime();
      }
      
      if (aValue && bValue && aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue && bValue && aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600">Manage your customer base and view user analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <p className="text-xs text-gray-600">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
            <UsersIcon className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.last_order_date && new Date(u.last_order_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-gray-600">Active in last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">New This Month</CardTitle>
            <Calendar className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {users.filter(u => new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
            </div>
            <p className="text-xs text-gray-600">New registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Avg Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + (u.total_orders || 0), 0) / users.length) : 0}
            </div>
            <p className="text-xs text-gray-600">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by phone, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="created_at">Registration Date</option>
                <option value="total_orders">Total Orders</option>
                <option value="total_spent">Total Spent</option>
                <option value="phone_number">Phone Number</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>View and manage your customer information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer" onClick={() => handleSort('phone_number')}>
                    Phone Number {getSortIcon('phone_number')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer" onClick={() => handleSort('name')}>
                    Name {getSortIcon('name')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer" onClick={() => handleSort('created_at')}>
                    Registration Date {getSortIcon('created_at')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer" onClick={() => handleSort('total_orders')}>
                    Total Orders {getSortIcon('total_orders')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer" onClick={() => handleSort('total_spent')}>
                    Total Spent {getSortIcon('total_spent')}
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">
                    Last Order
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium">{user.phone_number}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.name || (
                        <span className="text-gray-400 italic">Not provided</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 text-gray-400 mr-2" />
                        {user.total_orders || 0}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">₹{user.total_spent || 0}</span>
                    </td>
                    <td className="py-3 px-4">
                      {user.last_order_date ? (
                        <span className="text-sm text-gray-600">
                          {new Date(user.last_order_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No orders</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
