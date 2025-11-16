'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { userApi, ProfileResponse, TutorProfile, SocialLink, BankAccount } from '@/lib/api/user';
import {
  User,
  Camera,
  Save,
  Loader2,
  X,
  Plus,
  Trash2,
  GripVertical,
  Building,
  CreditCard,
  Lock,
  Bell,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Upload
} from 'lucide-react';

type TabType = 'profile' | 'avatar' | 'bank' | 'social' | 'security' | 'notifications';

const SUPPORTED_BANKS = [
  'Bank BCA',
  'Bank Mandiri',
  'Bank BNI',
  'Bank BRI',
  'Bank Permata',
  'Bank CIMB Niaga',
  'Bank Danamon',
  'Other banks',
];

const SOCIAL_PLATFORMS = [
  'LinkedIn',
  'GitHub',
  'Twitter/X',
  'Instagram',
  'Facebook',
  'YouTube',
  'TikTok',
  'Medium',
  'Dev.to',
  'Website',
  'Portfolio',
  'Other',
];

export default function TutorSettingsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [expertiseInput, setExpertiseInput] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Avatar
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Bank account
  const [bankName, setBankName] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountName, setBankAccountName] = useState('');
  const [savingBank, setSavingBank] = useState(false);

  // Social links
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialPublic, setNewSocialPublic] = useState(true);
  const [savingSocial, setSavingSocial] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userApi.getMyProfile();
      const data = response.data;
      setProfile(data);

      // Set profile form
      setFullName(data.user.full_name);
      setPhone(data.user.phone || '');
      setBio(data.user.bio || '');

      const tutorProfile = data.profile as TutorProfile;
      setExpertise(tutorProfile.expertise || []);
      setYearsExperience(tutorProfile.years_experience?.toString() || '');
      setLinkedinUrl(tutorProfile.linkedin_url || '');
      setGithubUrl(tutorProfile.github_url || '');
      setPortfolioUrl(tutorProfile.portfolio_url || '');

      // Set social links
      setSocialLinks(data.social_links || []);

      // Set bank account if exists
      if (data.bank_account) {
        setBankName(data.bank_account.bank_name);
        setBankAccountNumber(data.bank_account.bank_account_number);
        setBankAccountName(data.bank_account.bank_account_name);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await userApi.updateProfile({
        full_name: fullName,
        phone: phone,
        bio: bio,
        expertise: expertise,
        years_experience: yearsExperience ? parseInt(yearsExperience) : undefined,
        linkedin_url: linkedinUrl || undefined,
        github_url: githubUrl || undefined,
        portfolio_url: portfolioUrl || undefined,
      });

      alert('Profile updated successfully!');
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAddExpertise = () => {
    if (expertiseInput.trim() && !expertise.includes(expertiseInput.trim())) {
      setExpertise([...expertise, expertiseInput.trim()]);
      setExpertiseInput('');
    }
  };

  const handleRemoveExpertise = (skill: string) => {
    setExpertise(expertise.filter(s => s !== skill));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setAvatarFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;

    setUploadingAvatar(true);
    try {
      const response = await userApi.uploadAvatar(avatarFile);
      alert('Avatar uploaded successfully!');
      setAvatarFile(null);
      setAvatarPreview(null);
      await fetchProfile();
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      alert(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm('Are you sure you want to delete your avatar?')) return;

    try {
      await userApi.deleteAvatar();
      alert('Avatar deleted successfully!');
      await fetchProfile();
    } catch (error: any) {
      console.error('Error deleting avatar:', error);
      alert(error.response?.data?.message || 'Failed to delete avatar');
    }
  };

  const handleSaveBank = async () => {
    if (!bankName || !bankAccountNumber || !bankAccountName) {
      alert('Please fill in all bank account fields');
      return;
    }

    setSavingBank(true);
    try {
      await userApi.updateBankAccount({
        bank_name: bankName,
        bank_account_number: bankAccountNumber,
        bank_account_name: bankAccountName,
      });

      alert('Bank account updated successfully! Pending verification.');
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating bank account:', error);
      alert(error.response?.data?.message || 'Failed to update bank account');
    } finally {
      setSavingBank(false);
    }
  };

  const handleDeleteBank = async () => {
    if (!confirm('Are you sure you want to delete your bank account?')) return;

    try {
      await userApi.deleteBankAccount();
      alert('Bank account deleted successfully!');
      setBankName('');
      setBankAccountNumber('');
      setBankAccountName('');
      await fetchProfile();
    } catch (error: any) {
      console.error('Error deleting bank account:', error);
      alert(error.response?.data?.message || 'Failed to delete bank account');
    }
  };

  const handleAddSocialLink = async () => {
    if (!newSocialPlatform || !newSocialUrl) {
      alert('Please fill in platform and URL');
      return;
    }

    setSavingSocial(true);
    try {
      await userApi.addSocialLink({
        platform: newSocialPlatform,
        url: newSocialUrl,
        is_public: newSocialPublic,
        display_order: socialLinks.length + 1,
      });

      alert('Social link added successfully!');
      setShowAddSocial(false);
      setNewSocialPlatform('');
      setNewSocialUrl('');
      setNewSocialPublic(true);
      await fetchProfile();
    } catch (error: any) {
      console.error('Error adding social link:', error);
      alert(error.response?.data?.message || 'Failed to add social link');
    } finally {
      setSavingSocial(false);
    }
  };

  const handleDeleteSocialLink = async (linkId: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return;

    try {
      await userApi.deleteSocialLink(linkId);
      alert('Social link deleted successfully!');
      await fetchProfile();
    } catch (error: any) {
      console.error('Error deleting social link:', error);
      alert(error.response?.data?.message || 'Failed to delete social link');
    }
  };

  const handleToggleSocialVisibility = async (link: SocialLink) => {
    try {
      await userApi.updateSocialLink(link.id, {
        platform: link.platform,
        url: link.url,
        is_public: !link.is_public,
        display_order: link.display_order,
      });
      await fetchProfile();
    } catch (error: any) {
      console.error('Error updating social link:', error);
      alert(error.response?.data?.message || 'Failed to update social link');
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile Information', icon: User },
    { id: 'avatar' as TabType, label: 'Avatar', icon: Camera },
    { id: 'bank' as TabType, label: 'Bank Account', icon: Building },
    { id: 'social' as TabType, label: 'Social Media', icon: Plus },
  ];

  if (loading) {
    return (
      <DashboardLayout userRole="tutor">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="tutor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Kelola pengaturan akun dan profil Anda</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/tutor/profile')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View Profile
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="08123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell students about yourself..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {bio.length}/500 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    value={yearsExperience}
                    onChange={e => setYearsExperience(e.target.value)}
                    min="0"
                    max="50"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={expertiseInput}
                      onChange={e => setExpertiseInput(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddExpertise();
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., React, Node.js, Python"
                    />
                    <button
                      onClick={handleAddExpertise}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveExpertise(skill)}
                          className="hover:text-blue-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Portfolio Links</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="url"
                        value={linkedinUrl}
                        onChange={e => setLinkedinUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GitHub URL
                      </label>
                      <input
                        type="url"
                        value={githubUrl}
                        onChange={e => setGithubUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://github.com/yourprofile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Portfolio URL
                      </label>
                      <input
                        type="url"
                        value={portfolioUrl}
                        onChange={e => setPortfolioUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Avatar Tab */}
            {activeTab === 'avatar' && (
              <div className="space-y-6 max-w-2xl">
                <div className="text-center">
                  <div className="inline-block relative">
                    {avatarPreview || profile?.user.avatar_url ? (
                      <img
                        src={avatarPreview || profile?.user.avatar_url}
                        alt="Avatar"
                        className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-gray-200">
                        {profile?.user.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />

                    {!avatarFile && (
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 mx-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Choose Image
                      </button>
                    )}

                    {avatarFile && (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">
                          Selected: {avatarFile.name} ({(avatarFile.size / 1024).toFixed(0)} KB)
                        </p>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={handleUploadAvatar}
                            disabled={uploadingAvatar}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            {uploadingAvatar ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Upload Avatar
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setAvatarFile(null);
                              setAvatarPreview(null);
                            }}
                            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {!avatarFile && profile?.user.avatar_url && (
                      <button
                        onClick={handleDeleteAvatar}
                        className="flex items-center gap-2 mx-auto px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Avatar
                      </button>
                    )}
                  </div>

                  <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      Avatar Guidelines
                    </p>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Supported formats: JPG, PNG, WEBP</li>
                      <li>• Maximum file size: 2MB</li>
                      <li>• Recommended size: 400x400 pixels</li>
                      <li>• Use a professional, clear photo</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Account Tab */}
            {activeTab === 'bank' && (
              <div className="space-y-6 max-w-2xl">
                {profile?.bank_account?.is_verified && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-900 font-medium">
                        Your bank account is verified and ready for withdrawals!
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name *
                  </label>
                  <select
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Bank</option>
                    {SUPPORTED_BANKS.map(bank => (
                      <option key={bank} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    onChange={e => setBankAccountNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    value={bankAccountName}
                    onChange={e => setBankAccountName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="As shown on your bank account"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-900">
                      <p className="font-medium mb-1">Important Information</p>
                      <ul className="space-y-1">
                        <li>
                          • Bank account must be in your name (matching profile name)
                        </li>
                        <li>
                          • Account will be verified by admin within 1-3 business days
                        </li>
                        <li>• You can only withdraw funds after verification</li>
                        <li>• Ensure all details are accurate to avoid delays</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveBank}
                    disabled={savingBank}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {savingBank ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Bank Account
                      </>
                    )}
                  </button>

                  {profile?.bank_account && (
                    <button
                      onClick={handleDeleteBank}
                      className="flex items-center gap-2 px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === 'social' && (
              <div className="space-y-6 max-w-2xl">
                {/* Existing Links */}
                {socialLinks.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-700">Your Social Links</h3>
                    {socialLinks.map(link => (
                      <div
                        key={link.id}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{link.platform}</p>
                          <p className="text-sm text-gray-600 truncate">{link.url}</p>
                        </div>
                        <button
                          onClick={() => handleToggleSocialVisibility(link)}
                          className={`p-2 rounded-lg transition-colors ${
                            link.is_public
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                          title={link.is_public ? 'Public' : 'Private'}
                        >
                          {link.is_public ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteSocialLink(link.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Link */}
                {!showAddSocial ? (
                  <button
                    onClick={() => setShowAddSocial(true)}
                    className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors w-full justify-center"
                  >
                    <Plus className="w-5 h-5" />
                    Add Social Link
                  </button>
                ) : (
                  <div className="border border-gray-300 rounded-lg p-4 space-y-4">
                    <h3 className="font-medium text-gray-900">Add New Social Link</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform *
                      </label>
                      <select
                        value={newSocialPlatform}
                        onChange={e => setNewSocialPlatform(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Platform</option>
                        {SOCIAL_PLATFORMS.map(platform => (
                          <option key={platform} value={platform}>
                            {platform}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL *
                      </label>
                      <input
                        type="url"
                        value={newSocialUrl}
                        onChange={e => setNewSocialUrl(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="socialPublic"
                        checked={newSocialPublic}
                        onChange={e => setNewSocialPublic(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor="socialPublic" className="text-sm text-gray-700">
                        Make this link public on my profile
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleAddSocialLink}
                        disabled={savingSocial}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {savingSocial ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add Link
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddSocial(false);
                          setNewSocialPlatform('');
                          setNewSocialUrl('');
                          setNewSocialPublic(true);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
