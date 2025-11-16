'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { userApi } from '@/lib/api/user';
import {
  Settings,
  Bell,
  Mail,
  CreditCard,
  Shield,
  Globe,
  User,
  Upload,
  Trash2,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Lock,
  Key,
  Smartphone,
  Database,
  Zap,
  Users,
  BookOpen,
  DollarSign,
  Eye,
  EyeOff,
} from 'lucide-react';

interface SettingsData {
  general: {
    site_name: string;
    site_description: string;
    site_url: string;
    support_email: string;
    contact_phone: string;
    timezone: string;
    language: string;
    maintenance_mode: boolean;
  };
  notifications: {
    email_notifications: boolean;
    push_notifications: boolean;
    enrollment_notifications: boolean;
    payment_notifications: boolean;
    course_updates: boolean;
    new_reviews: boolean;
    withdrawal_requests: boolean;
  };
  email: {
    smtp_host: string;
    smtp_port: string;
    smtp_username: string;
    smtp_password: string;
    smtp_encryption: 'tls' | 'ssl' | 'none';
    from_email: string;
    from_name: string;
  };
  payment: {
    xendit_api_key: string;
    xendit_webhook_token: string;
    payment_fee_percentage: number;
    withdrawal_fee_percentage: number;
    minimum_withdrawal: number;
    auto_approve_courses: boolean;
  };
  security: {
    two_factor_auth: boolean;
    session_timeout: number;
    password_expiry_days: number;
    max_login_attempts: number;
    ip_whitelist_enabled: boolean;
    require_email_verification: boolean;
  };
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'email' | 'payment' | 'security' | 'profile'>('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

  const [settings, setSettings] = useState<SettingsData>({
    general: {
      site_name: 'FullstackTalent',
      site_description: 'Platform pembelajaran online untuk fullstack developer',
      site_url: 'https://fullstacktalent.id',
      support_email: 'support@fullstacktalent.id',
      contact_phone: '+62 812-3456-7890',
      timezone: 'Asia/Jakarta',
      language: 'id',
      maintenance_mode: false,
    },
    notifications: {
      email_notifications: true,
      push_notifications: true,
      enrollment_notifications: true,
      payment_notifications: true,
      course_updates: true,
      new_reviews: true,
      withdrawal_requests: true,
    },
    email: {
      smtp_host: 'smtp.gmail.com',
      smtp_port: '587',
      smtp_username: 'noreply@fullstacktalent.id',
      smtp_password: '',
      smtp_encryption: 'tls',
      from_email: 'noreply@fullstacktalent.id',
      from_name: 'FullstackTalent',
    },
    payment: {
      xendit_api_key: '',
      xendit_webhook_token: '',
      payment_fee_percentage: 1.5,
      withdrawal_fee_percentage: 1.0,
      minimum_withdrawal: 100000,
      auto_approve_courses: false,
    },
    security: {
      two_factor_auth: false,
      session_timeout: 30,
      password_expiry_days: 90,
      max_login_attempts: 5,
      ip_whitelist_enabled: false,
      require_email_verification: true,
    },
  });

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    fetchSettings();
    fetchProfile();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // In production, fetch from actual API
      // const response = await adminApi.getSettings();
      // setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await userApi.getMyProfile();
      setProfileData({
        full_name: response.data.user.full_name,
        email: response.data.user.email,
        phone: response.data.user.phone || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // In production, save to actual API
      // await adminApi.updateSettings(settings);

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      showMessage('success', 'Settings berhasil disimpan');
    } catch (error) {
      console.error('Error saving settings:', error);
      showMessage('error', 'Gagal menyimpan settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (profileData.new_password && profileData.new_password !== profileData.confirm_password) {
      showMessage('error', 'Password baru tidak cocok');
      return;
    }

    setSaving(true);
    try {
      await userApi.updateProfile({
        full_name: profileData.full_name,
        phone: profileData.phone,
      });

      showMessage('success', 'Profil berhasil diupdate');
    } catch (error) {
      console.error('Error updating profile:', error);
      showMessage('error', 'Gagal update profil');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSettingChange = (category: keyof SettingsData, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Kelola konfigurasi platform</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <p
              className={`text-sm font-medium ${
                message.type === 'success' ? 'text-green-900' : 'text-red-900'
              }`}
            >
              {message.text}
            </p>
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X className={`w-4 h-4 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">General Settings</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Konfigurasi umum platform
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.general.site_name}
                        onChange={(e) => handleSettingChange('general', 'site_name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Description
                      </label>
                      <textarea
                        value={settings.general.site_description}
                        onChange={(e) => handleSettingChange('general', 'site_description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site URL
                        </label>
                        <input
                          type="url"
                          value={settings.general.site_url}
                          onChange={(e) => handleSettingChange('general', 'site_url', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Support Email
                        </label>
                        <input
                          type="email"
                          value={settings.general.support_email}
                          onChange={(e) => handleSettingChange('general', 'support_email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          value={settings.general.contact_phone}
                          onChange={(e) => handleSettingChange('general', 'contact_phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Timezone
                        </label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                          <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                          <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="maintenance"
                        checked={settings.general.maintenance_mode}
                        onChange={(e) => handleSettingChange('general', 'maintenance_mode', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="maintenance" className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Maintenance Mode</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Aktifkan mode maintenance untuk menonaktifkan akses platform
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Kelola preferensi notifikasi admin
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="email_notifications"
                        checked={settings.notifications.email_notifications}
                        onChange={(e) => handleSettingChange('notifications', 'email_notifications', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="email_notifications" className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Email Notifications</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Terima notifikasi via email
                        </p>
                      </label>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="push_notifications"
                        checked={settings.notifications.push_notifications}
                        onChange={(e) => handleSettingChange('notifications', 'push_notifications', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="push_notifications" className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Push Notifications</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Terima push notifications di browser
                        </p>
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Event Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { id: 'enrollment_notifications', label: 'New Enrollments', desc: 'Notifikasi saat ada enrollment baru' },
                          { id: 'payment_notifications', label: 'Payment Transactions', desc: 'Notifikasi transaksi pembayaran' },
                          { id: 'course_updates', label: 'Course Updates', desc: 'Notifikasi update kursus oleh tutor' },
                          { id: 'new_reviews', label: 'New Reviews', desc: 'Notifikasi review baru dari siswa' },
                          { id: 'withdrawal_requests', label: 'Withdrawal Requests', desc: 'Notifikasi withdrawal request tutor' },
                        ].map((item) => (
                          <div key={item.id} className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              id={item.id}
                              checked={settings.notifications[item.id as keyof typeof settings.notifications] as boolean}
                              onChange={(e) => handleSettingChange('notifications', item.id, e.target.checked)}
                              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={item.id} className="flex-1">
                              <span className="text-sm font-medium text-gray-900">{item.label}</span>
                              <p className="text-xs text-gray-600">{item.desc}</p>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Email Settings</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Konfigurasi SMTP untuk pengiriman email
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Host
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtp_host}
                          onChange={(e) => handleSettingChange('email', 'smtp_host', e.target.value)}
                          placeholder="smtp.gmail.com"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Port
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtp_port}
                          onChange={(e) => handleSettingChange('email', 'smtp_port', e.target.value)}
                          placeholder="587"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Username
                        </label>
                        <input
                          type="text"
                          value={settings.email.smtp_username}
                          onChange={(e) => handleSettingChange('email', 'smtp_username', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SMTP Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword.smtp ? 'text' : 'password'}
                            value={settings.email.smtp_password}
                            onChange={(e) => handleSettingChange('email', 'smtp_password', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('smtp')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword.smtp ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Encryption
                        </label>
                        <select
                          value={settings.email.smtp_encryption}
                          onChange={(e) => handleSettingChange('email', 'smtp_encryption', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="tls">TLS</option>
                          <option value="ssl">SSL</option>
                          <option value="none">None</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Sender Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Email
                          </label>
                          <input
                            type="email"
                            value={settings.email.from_email}
                            onChange={(e) => handleSettingChange('email', 'from_email', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            From Name
                          </label>
                          <input
                            type="text"
                            value={settings.email.from_name}
                            onChange={(e) => handleSettingChange('email', 'from_name', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">Test Email Configuration</p>
                        <p className="text-xs text-blue-700">Kirim test email untuk memverifikasi konfigurasi</p>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                        Send Test
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Settings</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Konfigurasi payment gateway dan fee
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xendit API Key
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.xendit ? 'text' : 'password'}
                          value={settings.payment.xendit_api_key}
                          onChange={(e) => handleSettingChange('payment', 'xendit_api_key', e.target.value)}
                          placeholder="xnd_production_..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('xendit')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.xendit ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Webhook Token
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword.webhook ? 'text' : 'password'}
                          value={settings.payment.xendit_webhook_token}
                          onChange={(e) => handleSettingChange('payment', 'xendit_webhook_token', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('webhook')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.webhook ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Payment Fee (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.payment.payment_fee_percentage}
                          onChange={(e) => handleSettingChange('payment', 'payment_fee_percentage', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Withdrawal Fee (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={settings.payment.withdrawal_fee_percentage}
                          onChange={(e) => handleSettingChange('payment', 'withdrawal_fee_percentage', parseFloat(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Withdrawal (Rp)
                        </label>
                        <input
                          type="number"
                          value={settings.payment.minimum_withdrawal}
                          onChange={(e) => handleSettingChange('payment', 'minimum_withdrawal', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="auto_approve"
                        checked={settings.payment.auto_approve_courses}
                        onChange={(e) => handleSettingChange('payment', 'auto_approve_courses', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="auto_approve" className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Auto Approve Courses</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Automatically approve new courses without manual review
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Security Settings</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Konfigurasi keamanan platform
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="two_factor"
                        checked={settings.security.two_factor_auth}
                        onChange={(e) => handleSettingChange('security', 'two_factor_auth', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="two_factor" className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Two-Factor Authentication</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Require 2FA for admin accounts
                        </p>
                      </label>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="email_verification"
                        checked={settings.security.require_email_verification}
                        onChange={(e) => handleSettingChange('security', 'require_email_verification', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="email_verification" className="flex-1">
                        <span className="text-sm font-medium text-gray-900">Email Verification Required</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Require email verification for new accounts
                        </p>
                      </label>
                    </div>

                    <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="ip_whitelist"
                        checked={settings.security.ip_whitelist_enabled}
                        onChange={(e) => handleSettingChange('security', 'ip_whitelist_enabled', e.target.checked)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="ip_whitelist" className="flex-1">
                        <span className="text-sm font-medium text-gray-900">IP Whitelist</span>
                        <p className="text-xs text-gray-600 mt-1">
                          Enable IP whitelisting for admin panel
                        </p>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (minutes)
                        </label>
                        <input
                          type="number"
                          value={settings.security.session_timeout}
                          onChange={(e) => handleSettingChange('security', 'session_timeout', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Expiry (days)
                        </label>
                        <input
                          type="number"
                          value={settings.security.password_expiry_days}
                          onChange={(e) => handleSettingChange('security', 'password_expiry_days', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Login Attempts
                        </label>
                        <input
                          type="number"
                          value={settings.security.max_login_attempts}
                          onChange={(e) => handleSettingChange('security', 'max_login_attempts', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Admin Profile</h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Update informasi admin account
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={profileData.current_password}
                            onChange={(e) => setProfileData({ ...profileData, current_password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={profileData.new_password}
                            onChange={(e) => setProfileData({ ...profileData, new_password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={profileData.confirm_password}
                            onChange={(e) => setProfileData({ ...profileData, confirm_password: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={activeTab === 'profile' ? handleUpdateProfile : handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
