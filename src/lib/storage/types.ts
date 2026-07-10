export interface UploadOptions {
  contentType?: string
  upsert?: boolean
  cacheControl?: string
  createThumbnail?: boolean
  thumbnailWidth?: number
  thumbnailHeight?: number
  compress?: boolean
  compressQuality?: number
  maxWidth?: number
  maxHeight?: number
}

export interface UploadResult {
  url: string
  path: string
  thumbnailUrl?: string
  thumbnailPath?: string
  size: number
  width?: number
  height?: number
  mimetype: string
}

export interface StorageProvider {
  upload(path: string, buffer: Buffer, options?: UploadOptions): Promise<UploadResult>
  getPublicUrl(path: string): string
  getSignedUrl(path: string, expiresIn?: number): Promise<string>
  delete(path: string): Promise<void>
  deleteMany(paths: string[]): Promise<void>
  list(prefix: string, bucket?: string): Promise<string[]>
  copy(from: string, to: string): Promise<void>
  exists(path: string): Promise<boolean>
  getBucket(): string
}

export interface ImageProcessingOptions {
  width?: number
  height?: number
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  quality?: number
  format?: 'jpeg' | 'png' | 'webp' | 'avif'
}

export interface ImageMetadata {
  width: number
  height: number
  format: string
  size: number
  hasAlpha?: boolean
}

export const THUMBNAIL_SIZE = 300
export const MEDIUM_SIZE = 800
export const LARGE_SIZE = 1600
export const DEFAULT_COMPRESS_QUALITY = 80
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const MAX_FILE_SIZE = 20 * 1024 * 1024
