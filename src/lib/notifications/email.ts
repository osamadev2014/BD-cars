import { Resend } from 'resend'

let resendClient: Resend | null = null

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key || key === 're_placeholder') return null
  if (!resendClient) resendClient = new Resend(key)
  return resendClient
}

export function isEmailConfigured(): boolean {
  return !!getResend()
}

export async function sendEmail(params: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  const resend = getResend()
  if (!resend) return { success: false, error: 'Email not configured' }

  try {
    const { data, error } = await resend.emails.send({
      from: params.from || process.env.NOTIFICATION_FROM_EMAIL || 'noreply@bd.evico.sa',
      to: params.to,
      subject: params.subject,
      html: params.html,
    })
    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
