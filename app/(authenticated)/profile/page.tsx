'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AvatarInitials, Tabs, TextInput, PrimaryButton } from '@joel_ak/student-companion-lib';
import { fetchAPI } from '../../../utils/api';

interface Profile {
  id: string;
  name: string | null;
  email: string | null;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchAPI<Profile>('/api/users/me')
      .then(p => {
        setProfile(p);
        setName(p.name ?? '');
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const updated = await fetchAPI<Profile>('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim() }),
      });
      setProfile(updated);
      await update({ name: updated.name });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to save.' });
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.name ?? session?.user?.name ?? '';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
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
          {
            label: 'Profile Info',
            content: (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400 }}>
                <TextInput
                  label="Full name"
                  value={name}
                  onChange={setName}
                  placeholder="Enter your name"
                />
                <TextInput
                  label="Email"
                  value={profile?.email ?? ''}
                  onChange={_v => {}}
                  disabled
                  placeholder="Email address"
                />
                {message && (
                  <p
                    style={{
                      fontSize: 13,
                      color: message.type === 'success' ? '#15803d' : '#dc2626',
                      margin: 0,
                    }}
                  >
                    {message.text}
                  </p>
                )}
                <PrimaryButton
                  label={saving ? 'Saving…' : 'Save changes'}
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                />
              </div>
            ),
          },
          {
            label: 'Change Password',
            content: (
              <p style={{ fontSize: 14, color: '#64748b' }}>
                Password management coming soon.
              </p>
            ),
          },
        ]}
      />
    </div>
  );
}
