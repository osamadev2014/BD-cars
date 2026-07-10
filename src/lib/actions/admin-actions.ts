'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requirePermission } from '@/server/guards'
import { revalidatePath } from 'next/cache'
import { createAuditLog } from '@/lib/audit/audit-service'
import { createNotification } from '@/lib/actions/notification-actions'

export async function getPendingApprovals() {
  const guard = await requirePermission('approve_listings')
  if (!guard.allowed) return []

  const supabase = (await createServerSupabaseClient()) as any

  const { data } = await (supabase as any)
    .from('listing_approval_requests')
    .select(`
      *,
      listing:vehicle_listings(
        id, slug, price, status, created_at,
        seller:profiles(id, full_name, phone),
        vehicle:vehicles(
          id, year,
          make:car_makes(name),
          model:car_models(name),
          images:vehicle_images(*)
        )
      ),
      requester:profiles(id, full_name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  return data || []
}

export async function approveListing(requestId: string, reviewNotes?: string) {
  const guard = await requirePermission('approve_listings')
  if (!guard.allowed) throw new Error('Permission denied')
  if (!guard.userId) throw new Error('User ID not found')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: request } = await (supabase as any)
    .from('listing_approval_requests')
    .select('listing_id, requested_by')
    .eq('id', requestId)
    .single()
  if (!request) throw new Error('Request not found')

  await (supabase as any)
    .from('listing_approval_requests')
    .update({
      status: 'approved',
      reviewed_by: guard.userId,
      review_notes: reviewNotes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  await (supabase as any)
    .from('vehicle_listings')
    .update({ status: 'active' })
    .eq('id', request.listing_id)

  await (supabase as any).from('listing_status_history').insert({
    listing_id: request.listing_id,
    status: 'active',
    changed_by: guard.userId,
    notes: reviewNotes || 'Approved by admin',
  })

  await createNotification(
    request.requested_by,
    'Listing Approved',
    'Your listing has been approved and is now live.',
    'success',
    'listing',
    request.listing_id,
    'تم الموافقة على الإعلان',
    'تمت الموافقة على إعلانك وهو الآن منشور.',
  )

  await createAuditLog({
    userId: guard.userId,
    action: 'approve',
    entityType: 'listing',
    entityId: request.listing_id,
    newValues: { status: 'active' },
    metadata: { request_id: requestId, notes: reviewNotes },
  })

  revalidatePath('/admin/approvals')
  revalidatePath('/listings')
}

export async function rejectListing(requestId: string, reviewNotes: string) {
  const guard = await requirePermission('approve_listings')
  if (!guard.allowed) throw new Error('Permission denied')
  if (!guard.userId) throw new Error('User ID not found')

  const supabase = (await createServerSupabaseClient()) as any

  const { data: request } = await (supabase as any)
    .from('listing_approval_requests')
    .select('listing_id, requested_by')
    .eq('id', requestId)
    .single()
  if (!request) throw new Error('Request not found')

  await (supabase as any)
    .from('listing_approval_requests')
    .update({
      status: 'rejected',
      reviewed_by: guard.userId,
      review_notes: reviewNotes,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  await (supabase as any)
    .from('vehicle_listings')
    .update({ status: 'rejected' })
    .eq('id', request.listing_id)

  await (supabase as any).from('listing_status_history').insert({
    listing_id: request.listing_id,
    status: 'rejected',
    changed_by: guard.userId,
    notes: reviewNotes,
  })

  await createNotification(
    request.requested_by,
    'Listing Rejected',
    `Your listing was rejected. Reason: ${reviewNotes}`,
    'error',
    'listing',
    request.listing_id,
    'تم رفض الإعلان',
    `تم رفض إعلانك. السبب: ${reviewNotes}`,
  )

  await createAuditLog({
    userId: guard.userId,
    action: 'reject',
    entityType: 'listing',
    entityId: request.listing_id,
    newValues: { status: 'rejected' },
    metadata: { request_id: requestId, notes: reviewNotes },
  })

  revalidatePath('/admin/approvals')
}

export async function getAllListings(page = 1, pageSize = 20) {
  const guard = await requirePermission('view_admin_dashboard')
  if (!guard.allowed) return { data: [], count: 0 }

  const supabase = (await createServerSupabaseClient()) as any

  const { data, count, error } = await (supabase as any)
    .from('vehicle_listings')
    .select(`
      *,
      seller:profiles(id, full_name, phone),
      vehicle:vehicles(
        id, year,
        make:car_makes(name),
        model:car_models(name),
        images:vehicle_images(*)
      )
    `, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (error) throw new Error(error.message)
  return { data: data || [], count: count || 0 }
}
