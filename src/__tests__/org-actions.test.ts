import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  registerOrganization,
  getMyOrganizations,
  getPendingOrganizations,
  getAllOrganizations,
  approveOrganization,
  rejectOrganization,
  getOrganizationMembers,
  inviteMember,
  updateMemberRole,
  removeMember,
  getCurrentOrgId,
} from '@/lib/actions/org-actions'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const mockRequireAuth = vi.fn()
const mockRequirePermission = vi.fn()
vi.mock('@/server/guards', () => ({
  requireAuth: () => mockRequireAuth(),
  requirePermission: (perm: string) => mockRequirePermission(perm),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

beforeEach(() => {
  vi.clearAllMocks()
  mockRequireAuth.mockResolvedValue({ allowed: true, userId: 'user-1' })
  mockRequirePermission.mockResolvedValue({ allowed: true, userId: 'user-1' })
  // Reset supabase from mock to default
  const c = vi.mocked(createServerSupabaseClient())
  c.from.mockReset()
  c.from.mockImplementation(() => qb())
})

function getClient() {
  return vi.mocked(createServerSupabaseClient())
}

/**
 * Create a thenable query builder with a specific resolve value.
 * When awaited, returns resolveValue. All chain methods return the builder.
 */
function qb(resolveValue: any = { data: null, error: null }) {
  // Raw spies stored on _spies for test assertions (access via builder._spies.xxx)
  const spies = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    neq: vi.fn(),
    in: vi.fn(),
    not: vi.fn(),
    limit: vi.fn(),
    order: vi.fn(),
    maybeSingle: vi.fn(),
    single: vi.fn(),
  }

  const proxy = new Proxy(spies, {
    get(_target, prop) {
      if (prop === 'then') {
        return (resolve: any, reject: any) =>
          Promise.resolve(resolveValue).then(resolve, reject)
      }
      if (prop === '_spies') return spies
      const val = (_target as any)[prop]
      if (typeof val === 'function') {
        return (...args: any[]) => {
          val(...args)
          return proxy
        }
      }
      return val
    },
  })

  return proxy
}

describe('registerOrganization', () => {
  const validForm = {
    org_type: 'car_dealer',
    name: 'Test Dealer',
    name_ar: 'معرض اختبار',
    phone: '+966500000000',
    email: 'test@dealer.com',
  }

  it('creates org and owner member on success', async () => {
    const client = getClient()
    const orgBuilder = qb({ data: { id: 'org-123' }, error: null })
    const memberBuilder = qb({ error: null })
    client.from.mockReturnValueOnce(orgBuilder).mockReturnValueOnce(memberBuilder)

    const result = await registerOrganization(validForm)
    expect(result).toEqual({ orgId: 'org-123' })

    // First call: organizations insert
    expect(client.from).toHaveBeenNthCalledWith(1, 'organizations')
    expect(orgBuilder._spies.insert).toHaveBeenCalledWith(
      expect.objectContaining({ org_type: 'car_dealer', status: 'pending_approval', created_by: 'user-1' })
    )

    // Second call: members insert
    expect(client.from).toHaveBeenNthCalledWith(2, 'organization_members')
    expect(memberBuilder._spies.insert).toHaveBeenCalledWith(
      expect.objectContaining({ organization_id: 'org-123', user_id: 'user-1', role: 'owner' })
    )
  })

  it('throws if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue({ allowed: false, error: 'Auth required' })
    await expect(registerOrganization(validForm)).rejects.toThrow('Authentication required')
  })

  it('throws on db error during org insert', async () => {
    const client = getClient()
    client.from.mockReturnValueOnce(qb({ data: null, error: new Error('DB error') }))
    await expect(registerOrganization(validForm)).rejects.toThrow('DB error')
  })
})

describe('getMyOrganizations', () => {
  it('returns orgs with my_role when user has memberships', async () => {
    const client = getClient()
    const memberships = qb({
      data: [
        { organization_id: 'org-a', role: 'admin' },
        { organization_id: 'org-b', role: 'member' },
      ],
      error: null,
    })
    const orgs = qb({
      data: [
        { id: 'org-a', name: 'Org A', org_type: 'car_dealer' },
        { id: 'org-b', name: 'Org B', org_type: 'inspection_center' },
      ],
      error: null,
    })
    client.from.mockReturnValueOnce(memberships).mockReturnValueOnce(orgs)

    const result = await getMyOrganizations()
    expect(result).toHaveLength(2)
    expect(result[0].my_role).toBe('admin')
    expect(result[1].my_role).toBe('member')
    expect(client.from).toHaveBeenNthCalledWith(1, 'organization_members')
    expect(client.from).toHaveBeenNthCalledWith(2, 'organizations')
  })

  it('returns empty array if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue({ allowed: false })
    expect(await getMyOrganizations()).toEqual([])
  })

  it('returns empty array if no memberships', async () => {
    const client = getClient()
    client.from.mockReturnValueOnce(qb({ data: [], error: null }))
    expect(await getMyOrganizations()).toEqual([])
  })
})

describe('getPendingOrganizations', () => {
  it('returns pending orgs for authorized users', async () => {
    const client = getClient()
    client.from.mockReturnValueOnce(qb({
      data: [{ id: 'org-p1', name: 'Pending 1', status: 'pending_approval', owner: { id: 'user-1' } }],
      error: null,
    }))
    const result = await getPendingOrganizations()
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('org-p1')
  })

  it('returns empty if user lacks permission', async () => {
    mockRequirePermission.mockResolvedValue({ allowed: false })
    expect(await getPendingOrganizations()).toEqual([])
  })
})

describe('approveOrganization', () => {
  it('updates org to active', async () => {
    const client = getClient()
    const builder = qb({ error: null })
    client.from.mockReturnValueOnce(builder)

    await approveOrganization('org-123')
    expect(client.from).toHaveBeenCalledWith('organizations')
    expect(builder._spies.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'active', is_active: true })
    )
    expect(builder._spies.eq).toHaveBeenCalledWith('id', 'org-123')
  })

  it('throws if permission denied', async () => {
    mockRequirePermission.mockResolvedValue({ allowed: false, error: 'Permission denied' })
    await expect(approveOrganization('org-123')).rejects.toThrow('Permission denied')
  })
})

describe('rejectOrganization', () => {
  it('updates org to rejected with reason', async () => {
    const client = getClient()
    const builder = qb({ error: null })
    client.from.mockReturnValueOnce(builder)

    await rejectOrganization('org-123', 'Invalid documents')
    expect(builder._spies.update).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'rejected', status_notes: 'Invalid documents' })
    )
    expect(builder._spies.eq).toHaveBeenCalledWith('id', 'org-123')
  })
})

describe('getOrganizationMembers', () => {
  it('returns members with user profile', async () => {
    const client = getClient()
    client.from.mockReturnValueOnce(qb({
      data: [
        { id: 'm1', role: 'admin', user: { id: 'u1', full_name: 'Admin' } },
        { id: 'm2', role: 'member', user: { id: 'u2', full_name: 'Member' } },
      ],
      error: null,
    }))

    const result = await getOrganizationMembers('org-1')
    expect(result).toHaveLength(2)
    expect(result[0].role).toBe('admin')
    expect(result[0].user.full_name).toBe('Admin')
  })

  it('returns empty if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue({ allowed: false })
    expect(await getOrganizationMembers('org-1')).toEqual([])
  })
})

describe('inviteMember', () => {
  it('invites a new member by phone', async () => {
    const client = getClient()
    const roleCheck = qb({ data: { role: 'admin' }, error: null })
    const profileLookup = qb({ data: { id: 'invited-user', full_name: 'New User' }, error: null })
    const existingCheck = qb({ data: null, error: null })
    const insertAction = qb({ error: null })

    client.from
      .mockReturnValueOnce(roleCheck)
      .mockReturnValueOnce(profileLookup)
      .mockReturnValueOnce(existingCheck)
      .mockReturnValueOnce(insertAction)

    await inviteMember('org-1', '+966500000000', 'member')

    expect(client.from).toHaveBeenNthCalledWith(1, 'organization_members')
    expect(client.from).toHaveBeenNthCalledWith(2, 'profiles')
    expect(client.from).toHaveBeenNthCalledWith(3, 'organization_members')
    expect(client.from).toHaveBeenNthCalledWith(4, 'organization_members')
    expect(insertAction._spies.insert).toHaveBeenCalledWith(
      expect.objectContaining({ organization_id: 'org-1', user_id: 'invited-user', role: 'member' })
    )
  })

  it('throws if caller is not owner/admin', async () => {
    const client = getClient()
    client.from.mockReturnValueOnce(qb({ data: { role: 'member' }, error: null }))
    await expect(inviteMember('org-1', '+966500000000')).rejects.toThrow('Only owners and admins can invite members')
  })

  it('throws if user not found by phone', async () => {
    const client = getClient()
    client.from
      .mockReturnValueOnce(qb({ data: { role: 'admin' }, error: null }))
      .mockReturnValueOnce(qb({ data: null, error: null }))
    await expect(inviteMember('org-1', '+966500000000')).rejects.toThrow('User not found')
  })

  it('throws if user is already a member', async () => {
    const client = getClient()
    client.from
      .mockReturnValueOnce(qb({ data: { role: 'admin' }, error: null }))
      .mockReturnValueOnce(qb({ data: { id: 'existing' }, error: null }))
      .mockReturnValueOnce(qb({ data: { id: 'existing-member' }, error: null }))
    await expect(inviteMember('org-1', '+966500000000')).rejects.toThrow('already a member')
  })

  it('throws if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue({ allowed: false })
    await expect(inviteMember('org-1', '+966500000000')).rejects.toThrow('Authentication required')
  })
})

describe('updateMemberRole', () => {
  it('updates role for authorized admin', async () => {
    const client = getClient()
    client.from
      .mockReturnValueOnce(qb({ data: { organization_id: 'org-1' }, error: null }))
      .mockReturnValueOnce(qb({ data: { role: 'admin' }, error: null }))
      .mockReturnValueOnce(qb({ error: null }))

    await updateMemberRole('member-1', 'manager')

    expect(client.from).toHaveBeenNthCalledWith(1, 'organization_members')
    expect(client.from).toHaveBeenNthCalledWith(2, 'organization_members')
    expect(client.from).toHaveBeenNthCalledWith(3, 'organization_members')

    const thirdBuilder = client.from.mock.results[2].value
    expect(thirdBuilder._spies.update).toHaveBeenCalledWith(expect.objectContaining({ role: 'manager' }))
    expect(thirdBuilder._spies.eq).toHaveBeenCalledWith('id', 'member-1')
  })

  it('throws if member not found', async () => {
    const client = getClient()
    client.from.mockReturnValueOnce(qb({ data: null, error: null }))
    await expect(updateMemberRole('bad-id', 'admin')).rejects.toThrow('Member not found')
  })
})

describe('removeMember', () => {
  it('soft-deletes a non-owner member', async () => {
    const client = getClient()
    client.from
      .mockReturnValueOnce(qb({ data: { organization_id: 'org-1' }, error: null }))
      .mockReturnValueOnce(qb({ data: { role: 'admin' }, error: null }))
      .mockReturnValueOnce(qb({ data: { role: 'member' }, error: null }))
      .mockReturnValueOnce(qb({ error: null }))

    await removeMember('member-1')

    const fourthBuilder = client.from.mock.results[3].value
    expect(fourthBuilder._spies.update).toHaveBeenCalledWith(
      expect.objectContaining({ is_active: false, status: 'left' })
    )
    expect(fourthBuilder._spies.eq).toHaveBeenCalledWith('id', 'member-1')
  })

  it('throws when trying to remove owner', async () => {
    const client = getClient()
    client.from
      .mockReturnValueOnce(qb({ data: { organization_id: 'org-1' }, error: null }))
      .mockReturnValueOnce(qb({ data: { role: 'admin' }, error: null }))
      .mockReturnValueOnce(qb({ data: { role: 'owner' }, error: null }))
    await expect(removeMember('owner-member')).rejects.toThrow('Cannot remove the organization owner')
  })
})

describe('getCurrentOrgId', () => {
  it('returns first org id from memberships', async () => {
    const client = getClient()
    client.from.mockReturnValueOnce(qb({
      data: [{ organization_id: 'org-first' }],
      error: null,
    }))
    expect(await getCurrentOrgId()).toBe('org-first')
  })

  it('returns null if no memberships', async () => {
    const client = getClient()
    client.from.mockReturnValueOnce(qb({ data: [], error: null }))
    expect(await getCurrentOrgId()).toBeNull()
  })

  it('returns null if not authenticated', async () => {
    mockRequireAuth.mockResolvedValue({ allowed: false })
    expect(await getCurrentOrgId()).toBeNull()
  })
})
