'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AvatarInitials, Tabs, TextInput, PasswordInput } from '@joel_ak/student-companion-lib';
import { fetchAPI } from '../../../utils/api';

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
}

function ProfileTab({ profile, onUpdated }: { profile: Profile | null; onUpdated: (p: Profile) => void }) {
  const { update } = useSession();
  const [name, setName] = useState(profile?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => { setName(profile?.name ?? ''); }, [profile]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await fetchAPI<Profile>('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim() }),
      });
      onUpdated(updated);
      await update({ name: updated.name });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400 }}>
      <TextInput label="Full name" value={name} onChange={setName} placeholder="Enter your name" />
      <TextInput label="Email" value={profile?.email ?? ''} onChange={_v => {}} disabled placeholder="Email address" />
      {message && (
        <p style={{ fontSize: 13, color: message.type === 'success' ? '#15803d' : '#dc2626', margin: 0 }}>
          {message.text}
        </p>
      )}
      <button
        onClick={handleSave}
        disabled={saving || !name.trim()}
        style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: (saving || !name.trim()) ? 0.5 : 1 }}
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}

function ChangePasswordTab() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = async () => {
    if (!current || !next || !confirm) return;
    if (next !== confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await fetchAPI('/api/users/me/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword: current, newPassword: next, confirmPassword: confirm }),
      });
      setCurrent(''); setNext(''); setConfirm('');
      setMessage({ type: 'success', text: 'Password changed successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to change password.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400 }}>
      <PasswordInput label="Current password" value={current} onChange={setCurrent} placeholder="Enter current password" />
      <PasswordInput label="New password" value={next} onChange={setNext} placeholder="At least 8 chars, 1 uppercase, 1 number" />
      <PasswordInput label="Confirm new password" value={confirm} onChange={setConfirm} placeholder="Repeat new password" />
      {message && (
        <p style={{ fontSize: 13, color: message.type === 'success' ? '#15803d' : '#dc2626', margin: 0 }}>
          {message.text}
        </p>
      )}
      <button
        onClick={handleChange}
        disabled={saving || !current || !next || !confirm}
        style={{ background: '#2563EB', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: (saving || !current || !next || !confirm) ? 0.5 : 1 }}
      >
        {saving ? 'Saving…' : 'Change password'}
      </button>
    </div>
  );
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchAPI<Profile>('/api/users/me')
      .then(setProfile)
      .catch(() => {});
  }, []);

  const displayName = profile?.name ?? session?.user?.name ?? '';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
        <AvatarInitials name={displayName || 'U'} size="lg" />
        <div>
          <h1
            className="auth-layout-display"
            style={{ fontSize: 24, fontWeight: 600, color: '#0f172a', margin: 0 }}
          >
            {displayName || 'Your Profile'}
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0' }}>
            {profile?.email ?? ''}
          </p>
        </div>
      </div>

      <Tabs
        tabs={[
          { label: 'Profile Info', content: <ProfileTab profile={profile} onUpdated={setProfile} /> },
          { label: 'Change Password', content: <ChangePasswordTab /> },
        ]}
      />
    </div>
  );
}
