import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Settings as SettingsIcon, User, Shield, Bell, Database } from 'lucide-react'

const Settings: React.FC = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    weeklyReports: false,
  })
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
  })

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSecurityChange = (key: keyof typeof security, value: boolean | number) => {
    setSecurity(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const settingsSections = [
    {
      title: 'Profile Settings',
      icon: User,
      items: [
        {
          label: 'Email',
          value: user?.email || 'Not set',
          type: 'text' as const,
        },
        {
          label: 'Full Name',
          value: user?.user_metadata?.full_name || 'Not set',
          type: 'text' as const,
        },
        {
          label: 'Role',
          value: 'Admin',
          type: 'text' as const,
        },
      ]
    },
    {
      title: 'Security Settings',
      icon: Shield,
      items: [
        {
          label: 'Two-Factor Authentication',
          value: security.twoFactorAuth,
          type: 'toggle' as const,
          onChange: () => handleSecurityChange('twoFactorAuth', !security.twoFactorAuth),
        },
        {
          label: 'Session Timeout (minutes)',
          value: security.sessionTimeout,
          type: 'number' as const,
          onChange: (value: number) => handleSecurityChange('sessionTimeout', value),
        },
        {
          label: 'Password Expiry (days)',
          value: security.passwordExpiry,
          type: 'number' as const,
          onChange: (value: number) => handleSecurityChange('passwordExpiry', value),
        },
      ]
    },
    {
      title: 'Notification Settings',
      icon: Bell,
      items: [
        {
          label: 'Email Notifications',
          value: notifications.emailNotifications,
          type: 'toggle' as const,
          onChange: () => handleNotificationChange('emailNotifications'),
        },
        {
          label: 'Order Alerts',
          value: notifications.orderAlerts,
          type: 'toggle' as const,
          onChange: () => handleNotificationChange('orderAlerts'),
        },
        {
          label: 'Low Stock Alerts',
          value: notifications.lowStockAlerts,
          type: 'toggle' as const,
          onChange: () => handleNotificationChange('lowStockAlerts'),
        },
        {
          label: 'Weekly Reports',
          value: notifications.weeklyReports,
          type: 'toggle' as const,
          onChange: () => handleNotificationChange('weeklyReports'),
        },
      ]
    },
    {
      title: 'System Information',
      icon: Database,
      items: [
        {
          label: 'Database Version',
          value: 'PostgreSQL 15.0',
          type: 'text' as const,
        },
        {
          label: 'API Version',
          value: 'v1.0.0',
          type: 'text' as const,
        },
        {
          label: 'Last Backup',
          value: '2 hours ago',
          type: 'text' as const,
        },
      ]
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      <div className="space-y-6">
        {settingsSections.map((section) => (
          <div key={section.title} className="bg-white shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center mb-4">
                <section.icon className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {section.title}
                </h3>
              </div>
              
              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        {item.label}
                      </label>
                      {item.type === 'text' && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.value}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      {item.type === 'toggle' && (
                        <button
                          onClick={item.onChange}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            item.value ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}
                      
                      {item.type === 'number' && (
                        <input
                          type="number"
                          value={item.value}
                          onChange={(e) => item.onChange(parseInt(e.target.value))}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      )}
                      
                      {item.type === 'text' && (
                        <span className="text-sm text-gray-500">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-3">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Reset to Defaults
        </button>
        <button className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default Settings
