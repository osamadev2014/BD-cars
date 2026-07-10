import { SupabaseStorageProvider } from './supabase-provider'
import { processImage, getImageMetadata, generateThumbnail, getOptimizedFormat, getContentType } from './image-processor'
import type { StorageProvider, UploadOptions, UploadResult } from './types'
import { THUMBNAIL_SIZE, MEDIUM_SIZE, LARGE_SIZE, DEFAULT_COMPRESS_QUALITY, ALLOWED_TYPES, MAX_FILE_SIZE } from './types'

export class StorageService {
  private provider: StorageProvider

  constructor(provider?: StorageProvider) {
    this.provider = provider || new SupabaseStorageProvider()
  }

  setProvider(provider: StorageProvider) {
    this.provider = provider
  }

  getProvider(): StorageProvider {
    return this.provider
  }

  validateFile(file: File | { name: string; size: number; type: string }): string | null {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Unsupported file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}`
    }
    if (file.size > MAX_FILE_SIZE) {
      return `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Max: ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }
    return null
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    userId: string,
    folder = 'listings',
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const ext = originalName.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const basePath = `${folder}/${userId}/${timestamp}`

    const format = options.compress !== false ? getOptimizedFormat(ext) : undefined
    const maxW = options.maxWidth || LARGE_SIZE
    const maxH = options.maxHeight || LARGE_SIZE

    let processedBuffer = buffer
    if (options.compress !== false || maxW || maxH) {
      processedBuffer = await processImage(buffer, {
        width: maxW,
        height: maxH,
        fit: 'inside',
        quality: options.compressQuality ?? DEFAULT_COMPRESS_QUALITY,
        format,
      })
    }

    const meta = await getImageMetadata(processedBuffer)
    const finalExt = format || ext
    const fileName = `${basePath}.${finalExt}`
    const contentType = getContentType(fileName)

    const result = await this.provider.upload(fileName, processedBuffer, {
      contentType,
      upsert: options.upsert ?? true,
    })

    let thumbnailUrl: string | undefined
    let thumbnailPath: string | undefined

    if (options.createThumbnail !== false) {
      const thumbBuffer = await generateThumbnail(buffer, options.thumbnailWidth || THUMBNAIL_SIZE)
      const thumbName = `${basePath}_thumb.jpg`
      await this.provider.upload(thumbName, thumbBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })
      thumbnailUrl = this.provider.getPublicUrl(thumbName)
      thumbnailPath = thumbName
    }

    return {
      ...result,
      size: processedBuffer.length,
      width: meta.width,
      height: meta.height,
      thumbnailUrl,
      thumbnailPath,
    }
  }

  async uploadFromFile(
    file: File,
    userId: string,
    folder = 'listings',
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const validationError = this.validateFile(file)
    if (validationError) throw new Error(validationError)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return this.uploadFile(buffer, file.name, userId, folder, options)
  }

  async deleteFile(path: string): Promise<void> {
    await this.provider.delete(path)
    const thumbPath = path.replace(/\.\w+$/, '_thumb.jpg')
    try {
      await this.provider.delete(thumbPath)
    } catch {
      // thumbnail may not exist
    }
  }

  async deleteFiles(paths: string[]): Promise<void> {
    const allPaths = paths.flatMap((p) => [
      p,
      p.replace(/\.\w+$/, '_thumb.jpg'),
    ])
    await this.provider.deleteMany(allPaths)
  }

  getUrl(path: string): string {
    return this.provider.getPublicUrl(path)
  }

  async moveFile(from: string, to: string): Promise<void> {
    await this.provider.copy(from, to)
    await this.provider.delete(from)
  }
}

export function createStorageService(bucket?: string): StorageService {
  return new StorageService(new SupabaseStorageProvider(bucket))
}
