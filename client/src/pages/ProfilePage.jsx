import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import userService from '../services/userService';
import {
  User,
  Shield,
  Building,
  Mail,
  Camera,
  CheckCircle,
  KeyRound
} from 'lucide-react';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    avatar: '',
    bio: '',
    company: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
          avatar: data.user.avatar || '',
          bio: data.user.bio || '',
          company: data.user.company || ''
        });
      } catch (err) {
        setProfileError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess('');
    setProfileError('');

    try {
      setIsUpdatingProfile(true);
      const res = await userService.updateProfile({
        name: profileData.name,
        avatar: profileData.avatar,
        bio: profileData.bio,
        company: profileData.company
      });
      updateUser(res.user);
      setProfileSuccess('Profile details saved successfully');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    try {
      setIsChangingPassword(true);
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmNewPassword
      });
      setPasswordSuccess('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading profile settings..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your personal promoter details, identity, and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center">
            <div className="relative inline-block mx-auto mb-4">
              <img
                src={
                  profileData.avatar ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                }
                alt={profileData.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-brand-100 shadow-md mx-auto"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900">{profileData.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{profileData.email}</p>

            {profileData.company && (
              <div className="mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{profileData.company}</span>
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-slate-100 text-left text-xs text-slate-500 space-y-2">
              <div className="flex items-center justify-between">
                <span>Account Role:</span>
                <span className="font-semibold uppercase tracking-wider text-slate-700">
                  {user?.role || 'User'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Member Since:</span>
                <span className="font-semibold text-slate-700">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Edit Forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Form */}
          <Card>
            <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              Personal & Company Information
            </h4>

            {profileSuccess && (
              <Alert
                type="success"
                message={profileSuccess}
                onClose={() => setProfileSuccess('')}
                className="mb-5"
              />
            )}
            {profileError && (
              <Alert
                type="error"
                message={profileError}
                onClose={() => setProfileError('')}
                className="mb-5"
              />
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  required
                />
                <Input
                  label="Email (Verified)"
                  name="email"
                  value={profileData.email}
                  disabled
                  helperText="Primary email cannot be changed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Company / Brand"
                  name="company"
                  value={profileData.company}
                  onChange={handleProfileChange}
                  placeholder="e.g. Acme Marketing Corp"
                  icon={Building}
                />
                <Input
                  label="Avatar Image URL"
                  name="avatar"
                  value={profileData.avatar}
                  onChange={handleProfileChange}
                  placeholder="https://images.unsplash.com/..."
                  icon={Camera}
                />
              </div>

              <Textarea
                label="Short Bio / Brand Slogan"
                name="bio"
                value={profileData.bio}
                onChange={handleProfileChange}
                rows={2}
                placeholder="Share a brief introduction shown on your campaign pages..."
              />

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isUpdatingProfile}
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Change Password Form */}
          <Card>
            <h4 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-600" />
              Change Password
            </h4>

            {passwordSuccess && (
              <Alert
                type="success"
                message={passwordSuccess}
                onClose={() => setPasswordSuccess('')}
                className="mb-5"
              />
            )}
            {passwordError && (
              <Alert
                type="error"
                message={passwordError}
                onClose={() => setPasswordError('')}
                className="mb-5"
              />
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Minimum 6 characters"
                  required
                />
                <Input
                  label="Confirm New Password"
                  name="confirmNewPassword"
                  type="password"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  isLoading={isChangingPassword}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
