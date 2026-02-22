import StudyPreferencesForm from '@/components/StudyPreferencesForm';

export default function PreferencesPage() {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: 'linear-gradient(160deg, #f8fafc 0%, #f1f5f9 60%, #e8edf5 100%)',
      }}>
      <style>{`
        @media (max-width: 720px) {
          .pref-page-inner { flex-direction: column !important; gap: 32px !important; }
          .pref-editorial { width: auto !important; position: static !important; }
        }
      `}</style>
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          padding: '48px 24px',
        }}>
        <div
          className="pref-page-inner"
          style={{
            display: 'flex',
            gap: 64,
            alignItems: 'flex-start',
          }}>

          {/* Editorial left panel */}
          <div
            className="pref-editorial"
            style={{
              width: 232,
              flexShrink: 0,
              position: 'sticky',
              top: 88,
            }}>
            <p
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#2563eb',
                marginBottom: 14,
              }}>
              Configuration
            </p>
            <h1
              className="auth-layout-display"
              style={{
                fontSize: 36,
                lineHeight: 1.15,
                color: '#0f172a',
                fontWeight: 600,
                marginBottom: 16,
              }}>
              Study
              <br />
              <em>Preferences</em>
            </h1>
            <p
              style={{
                fontSize: 13,
                color: '#64748b',
                lineHeight: 1.65,
                marginBottom: 32,
              }}>
              Tell us how you study best. These settings shape your task
              schedule and focus windows.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(
                [
                  ['⏰', 'Smart scheduling'],
                  ['🎯', 'Optimal task timing'],
                  ['⚡', 'Break reminders'],
                ] as [string, string][]
              ).map(([icon, text]) => (
                <div
                  key={text}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    color: '#94a3b8',
                  }}>
                  <span style={{ fontSize: 15 }}>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Decorative element */}
            <div
              style={{
                marginTop: 40,
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1.5px solid #e2e8f0',
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                }}
              />
            </div>
          </div>

          {/* Form */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <StudyPreferencesForm />
          </div>
        </div>
      </div>
    </div>
  );
}
