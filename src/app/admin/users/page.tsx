'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  email: string
  user_metadata: {
    role?: string
    organization?: string
    name?: string
    [key: string]: any
  }
  created_at: string
  confirmed_at: string | null
  last_sign_in_at: string | null
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // New user form state
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserName, setNewUserName] = useState('')
  const [newUserOrg, setNewUserOrg] = useState('')
  const [newUserRole, setNewUserRole] = useState('user')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [createSuccess, setCreateSuccess] = useState(false)

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setIsLoading(true)
    setError(null)
    
    try {
      // Call the API endpoint instead of directly using getAllUsers
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setUsers(data.users)
    } catch (err: any) {
      setError('Failed to load users: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Format date to readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString()
  }

  // Handle user creation
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setCreateError(null)
    setCreateSuccess(false)
    
    if (!newUserEmail || !newUserPassword) {
      setCreateError('Email and password are required')
      setIsCreating(false)
      return
    }
    
    try {
      const response = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          userData: {
            name: newUserName,
            organization: newUserOrg,
            role: newUserRole,
          }
        }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Reset form
      setNewUserEmail('')
      setNewUserPassword('')
      setNewUserName('')
      setNewUserOrg('')
      setNewUserRole('user')
      setCreateSuccess(true)
      
      // Reload users list
      loadUsers()
    } catch (err: any) {
      setCreateError('Failed to create user: ' + err.message)
    } finally {
      setIsCreating(false)
    }
  }

  // Toggle user role between admin and user
  const toggleUserRole = async (user: User) => {
    const currentRole = user.user_metadata?.role || 'user'
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    
    try {
      const metadata = { 
        ...user.user_metadata,
        role: newRole 
      }
      
      const response = await fetch('/api/admin/users/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          metadata
        }),
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      // Update local state with new role
      setUsers(users.map(u => 
        u.id === user.id 
          ? { ...u, user_metadata: { ...u.user_metadata, role: newRole } } 
          : u
      ))
    } catch (err: any) {
      setError('Failed to update user role: ' + err.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Link 
          href="/admin"
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
        >
          Back to Admin
        </Link>
      </div>
      
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}
      
      {/* Create New User Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Create New User</h2>
        
        {createSuccess && (
          <div className="p-4 mb-4 bg-green-50 border-l-4 border-green-500 text-green-700">
            User created successfully!
          </div>
        )}
        
        {createError && (
          <div className="p-4 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            {createError}
          </div>
        )}
        
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                required
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                required
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization</label>
              <input
                type="text"
                value={newUserOrg}
                onChange={(e) => setNewUserOrg(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ncaa-blue focus:ring-ncaa-blue sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ncaa-blue hover:bg-ncaa-darkblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ncaa-blue disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
      
      {/* Users List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-medium leading-6 text-gray-900">Users</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage system users and their permissions
          </p>
        </div>
        
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ncaa-blue"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Sign In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.user_metadata?.name || 'No name'}
                            </div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.user_metadata?.organization || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.user_metadata?.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {user.user_metadata?.role || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.last_sign_in_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => toggleUserRole(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          {user.user_metadata?.role === 'admin' ? 'Make User' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
} 