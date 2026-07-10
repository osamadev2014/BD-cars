export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'BD'
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
export const DEFAULT_LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE || 'ar'
export const SUPPORTED_LOCALES = (process.env.NEXT_PUBLIC_SUPPORTED_LOCALES || 'ar,en').split(',')
export const DEV_OTP = process.env.DEV_OTP || '1234'
export const IS_DEV = process.env.NODE_ENV === 'development'

export const SAUDI_PHONE_REGEX = /^0?5[0-9]{8}$/
export const OTP_LENGTH = 4
export const OTP_EXPIRY_SECONDS = 300
export const OTP_RESEND_COOLDOWN_SECONDS = 60

export const VAT_PERCENTAGE = 15
export const SAUDI_CURRENCY = 'SAR'
export const SAUDI_CURRENCY_SYMBOL = '﷼'

export const PAGINATION_DEFAULT_LIMIT = 20
export const PAGINATION_MAX_LIMIT = 100

export const IMAGE_MAX_SIZE_MB = 10
export const VIDEO_MAX_SIZE_MB = 100
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm']
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

export const DEALER_SLUG_PREFIX = 'dealer'
export const INSPECTION_CENTER_SLUG_PREFIX = 'inspection'
export const PART_SLUG_PREFIX = 'part'

export const AI_MOCK_DELAY = 500
