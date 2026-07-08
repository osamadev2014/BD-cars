import { z } from 'zod'
import { SAUDI_PHONE_REGEX, OTP_LENGTH } from '@/constants'

export const phoneSchema = z.string().regex(SAUDI_PHONE_REGEX, 'Invalid Saudi phone number')

export const otpSchema = z.string().length(OTP_LENGTH, `Code must be ${OTP_LENGTH} digits`)

export const uuidSchema = z.string().uuid('Invalid UUID')

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})
