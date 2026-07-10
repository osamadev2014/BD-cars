import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'

export interface PaginationParams {
  page: number
  perPage: number
  offset: number
}

export function parsePagination(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1') || 1)
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('per_page') || '20') || 20))
  return { page, perPage, offset: (page - 1) * perPage }
}

export function parseSort(
  searchParams: URLSearchParams,
  allowedFields: string[],
  defaultField = 'created_at',
  defaultDir: 'asc' | 'desc' = 'desc'
): { field: string; dir: 'asc' | 'desc' } {
  const raw = searchParams.get('sort_by') || `${defaultField}_${defaultDir}`
  const parts = raw.split('_')
  const dir = parts.pop() === 'asc' ? 'asc' : 'desc'
  const field = parts.join('_') || defaultField
  return { field: allowedFields.includes(field) ? field : defaultField, dir }
}

export async function getAuthUser(supabase: SupabaseClient, request?: Request) {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) return user

  const apiKey = request?.headers.get('x-api-key')
  if (!apiKey) return null

  const { data: keyData } = await (supabase as any)
    .from('api_keys')
    .select('user_id, is_active')
    .eq('key', apiKey)
    .eq('is_active', true)
    .single()

  if (keyData) {
    const { data: { user: keyUser } } = await supabase.auth.admin.getUserById(keyData.user_id)
    return keyUser
  }

  return null
}

export function corsHeaders(origin?: string | null) {
  const allowed = origin?.match(/^https?:\/\/(.+\.)?(bd\.evico\.sa|localhost:\d+)/) ? origin : '*'
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
    'Access-Control-Max-Age': '86400',
  }
}

export function handleApiError(err: unknown, defaultMessage = 'Internal server error') {
  const message = err instanceof Error ? err.message : defaultMessage
  console.error('[API Error]', err)
  return NextResponse.json(
    { success: false, error: message },
    { status: message.includes('permission') || message.includes('denied') ? 403 : 500, headers: corsHeaders() }
  )
}

export function requireUser(user: any) {
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401, headers: corsHeaders() }
    )
  }
  return null
}

export function badRequest(message: string) {
  return NextResponse.json(
    { success: false, error: message },
    { status: 400, headers: corsHeaders() }
  )
}

export function notFound(message = 'Not found') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 404, headers: corsHeaders() }
  )
}
