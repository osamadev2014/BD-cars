import { createServiceRoleClient } from '@/lib/supabase/service-role'
import type { StorageProvider, UploadOptions, UploadResult } from './types'

export class SupabaseStorageProvider implements StorageProvider {
  private bucket: string
  private basePath: string

  constructor(bucket = 'vehicles', basePath = '') {
    this.bucket = bucket
    this.basePath = basePath
  }

  getBucket(): string {
    return this.bucket
  }

  private fullPath(path: string): string {
    return this.basePath ? `${this.basePath}/${path}` : path
  }

  async upload(path: string, buffer: Buffer, options?: UploadOptions): Promise<UploadResult> {
    const client = createServiceRoleClient()
    const full = this.fullPath(path)

    const { error } = await client.storage
      .from(this.bucket)
      .upload(full, buffer, {
        contentType: options?.contentType || 'image/jpeg',
        upsert: options?.upsert ?? true,
        cacheControl: options?.cacheControl || '31536000',
      })

    if (error) throw new Error(`Upload failed: ${error.message}`)

    const { data: urlData } = client.storage
      .from(this.bucket)
      .getPublicUrl(full)

    return {
      url: urlData.publicUrl,
      path: full,
      size: buffer.length,
      mimetype: options?.contentType || 'image/jpeg',
    }
  }

  getPublicUrl(path: string): string {
    const client = createServiceRoleClient()
    const full = this.fullPath(path)
    const { data } = client.storage.from(this.bucket).getPublicUrl(full)
    return data.publicUrl
  }

  async getSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    const client = createServiceRoleClient()
    const full = this.fullPath(path)
    const { data, error } = await client.storage
      .from(this.bucket)
      .createSignedUrl(full, expiresIn)

    if (error) throw new Error(`Signed URL failed: ${error.message}`)
    return data.signedUrl
  }

  async delete(path: string): Promise<void> {
    const client = createServiceRoleClient()
    const full = this.fullPath(path)
    const { error } = await client.storage.from(this.bucket).remove([full])
    if (error) throw new Error(`Delete failed: ${error.message}`)
  }

  async deleteMany(paths: string[]): Promise<void> {
    if (paths.length === 0) return
    const client = createServiceRoleClient()
    const full = paths.map((p) => this.fullPath(p))
    const { error } = await client.storage.from(this.bucket).remove(full)
    if (error) throw new Error(`Batch delete failed: ${error.message}`)
  }

  async list(prefix: string): Promise<string[]> {
    const client = createServiceRoleClient()
    const full = this.fullPath(prefix)
    const { data, error } = await client.storage.from(this.bucket).list(full)
    if (error) throw new Error(`List failed: ${error.message}`)
    return (data || []).map((f: any) => `${full}/${f.name}`)
  }

  async copy(from: string, to: string): Promise<void> {
    const client = createServiceRoleClient()
    const fromFull = this.fullPath(from)
    const toFull = this.fullPath(to)
    const { error } = await client.storage.from(this.bucket).copy(fromFull, toFull)
    if (error) throw new Error(`Copy failed: ${error.message}`)
  }

  async exists(path: string): Promise<boolean> {
    try {
      const client = createServiceRoleClient()
      const full = this.fullPath(path)
      const { data } = await client.storage.from(this.bucket).list(full.split('/').slice(0, -1).join('/'))
      const fileName = full.split('/').pop()
      return (data || []).some((f: any) => f.name === fileName)
    } catch {
      return false
    }
  }
}
