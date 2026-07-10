import Twilio from 'twilio'

let twilioClient: ReturnType<typeof Twilio> | null = null

function getTwilio(): ReturnType<typeof Twilio> | null {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !token || sid === 'AC_placeholder') return null
  if (!twilioClient) twilioClient = Twilio(sid, token)
  return twilioClient
}

export function isSmsConfigured(): boolean {
  return !!getTwilio()
}

export async function sendSms(params: {
  to: string
  body: string
  from?: string
}) {
  const client = getTwilio()
  if (!client) return { success: false, error: 'SMS not configured' }

  try {
    const message = await client.messages.create({
      from: params.from || process.env.TWILIO_PHONE_NUMBER || '+966500000000',
      to: params.to,
      body: params.body,
    })
    return { success: true, id: message.sid }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}
