import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { isStripeConfigured } from '@/lib/payments/stripe'
import { isEmailConfigured } from '@/lib/notifications/email'
import { isSmsConfigured } from '@/lib/notifications/sms'
import { isPushConfigured } from '@/lib/notifications/push'

interface HealthCheck {
  name: string
  status: 'ok' | 'error' | 'disabled'
  message?: string
  latencyMs?: number
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.from('profiles').select('id').limit(1)
    const latencyMs = Date.now() - start
    if (error) return { name: 'Database', status: 'error', message: error.message, latencyMs }
    return { name: 'Database', status: 'ok', message: 'Connected', latencyMs }
  } catch (e: any) {
    return { name: 'Database', status: 'error', message: e.message, latencyMs: Date.now() - start }
  }
}

async function checkAuth(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.getSession()
    const latencyMs = Date.now() - start
    if (error) return { name: 'Auth (GoTrue)', status: 'error', message: error.message, latencyMs }
    return { name: 'Auth (GoTrue)', status: 'ok', message: 'Operational', latencyMs }
  } catch (e: any) {
    return { name: 'Auth (GoTrue)', status: 'error', message: e.message, latencyMs: Date.now() - start }
  }
}

async function checkStorage(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    const admin = getAdminClient()
    const { error } = await admin.storage.listBuckets()
    const latencyMs = Date.now() - start
    if (error) return { name: 'Storage', status: 'error', message: error.message, latencyMs }
    return { name: 'Storage', status: 'ok', message: 'Operational', latencyMs }
  } catch (e: any) {
    return { name: 'Storage', status: 'error', message: e.message, latencyMs: Date.now() - start }
  }
}

async function checkRealtime(): Promise<HealthCheck> {
  const start = Date.now()
  try {
    const supabase = await createServerSupabaseClient()
    const channel = supabase.channel('health-check')
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout')), 3000)
      channel.subscribe((status) => {
        clearTimeout(timeout)
        if (status === 'SUBSCRIBED') {
          resolve()
        } else {
          reject(new Error(`Status: ${status}`))
        }
      })
    })
    await supabase.removeChannel(channel)
    const latencyMs = Date.now() - start
    return { name: 'Realtime', status: 'ok', message: 'Connected', latencyMs }
  } catch (e: any) {
    return { name: 'Realtime', status: 'error', message: e.message, latencyMs: Date.now() - start }
  }
}

function checkEmail(): HealthCheck {
  return {
    name: 'Email (Resend)',
    status: isEmailConfigured() ? 'ok' : 'disabled',
    message: isEmailConfigured() ? 'Configured' : 'Not configured (DEV mode)',
  }
}

function checkSms(): HealthCheck {
  return {
    name: 'SMS (Twilio)',
    status: isSmsConfigured() ? 'ok' : 'disabled',
    message: isSmsConfigured() ? 'Configured' : 'Not configured (DEV mode)',
  }
}

function checkStripe(): HealthCheck {
  return {
    name: 'Payments (Stripe)',
    status: isStripeConfigured() ? 'ok' : 'disabled',
    message: isStripeConfigured() ? 'Configured' : 'Not configured (DEV mode)',
  }
}

function checkPush(): HealthCheck {
  return {
    name: 'Push Notifications',
    status: isPushConfigured() ? 'ok' : 'disabled',
    message: isPushConfigured() ? 'Configured' : 'Not configured (DEV mode)',
  }
}

export const metadata = {
  title: 'Health Check - Ryon Dev',
}

export default async function HealthPage() {
  const checks = await Promise.all([
    checkDatabase(),
    checkAuth(),
    checkStorage(),
    checkRealtime(),
  ])

  const syncChecks = [
    checkEmail(),
    checkSms(),
    checkStripe(),
    checkPush(),
  ]

  const allChecks = [...checks, ...syncChecks]
  const okCount = allChecks.filter((c) => c.status === 'ok').length
  const errorCount = allChecks.filter((c) => c.status === 'error').length
  const disabledCount = allChecks.filter((c) => c.status === 'disabled').length

  return (
    <div style={{ fontFamily: 'monospace', padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏥 Ryon - Health Check</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Local Development Environment Status
      </p>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <strong>Summary:</strong>{' '}
        <span style={{ color: '#16a34a' }}>{okCount} OK</span> |{' '}
        <span style={{ color: '#dc2626' }}>{errorCount} Error</span> |{' '}
        <span style={{ color: '#9ca3af' }}>{disabledCount} Disabled</span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Service</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Message</th>
            <th style={{ textAlign: 'right', padding: '0.5rem' }}>Latency</th>
          </tr>
        </thead>
        <tbody>
          {allChecks.map((check) => (
            <tr key={check.name} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '0.75rem 0.5rem' }}>
                {check.status === 'ok' && '✅'}
                {check.status === 'error' && '❌'}
                {check.status === 'disabled' && '⬜'}
              </td>
              <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{check.name}</td>
              <td style={{ padding: '0.75rem 0.5rem', color: '#666' }}>{check.message || '-'}</td>
              <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: '#999' }}>
                {check.latencyMs != null ? `${check.latencyMs}ms` : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px', fontSize: '0.85rem' }}>
        <strong>Environment:</strong>
        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
          <li>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}</li>
          <li>App URL: {process.env.NEXT_PUBLIC_APP_URL || 'NOT SET'}</li>
          <li>Node Env: {process.env.NODE_ENV || 'NOT SET'}</li>
        </ul>
      </div>

      <p style={{ marginTop: '2rem', color: '#999', fontSize: '0.8rem' }}>
        This page is only available in development mode.
      </p>
    </div>
  )
}
