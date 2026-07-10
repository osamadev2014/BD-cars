import sharp from 'sharp'
import type { ImageProcessingOptions, ImageMetadata } from './types'

export async function processImage(
  buffer: Buffer,
  options: ImageProcessingOptions
): Promise<Buffer> {
  let pipeline = sharp(buffer)

  if (options.width || options.height) {
    pipeline = pipeline.resize(options.width, options.height, {
      fit: options.fit || 'cover',
      withoutEnlargement: true,
    })
  }

  const format = options.format || 'jpeg'
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality: options.quality ?? 80, mozjpeg: true })
      break
    case 'png':
      pipeline = pipeline.png({ quality: options.quality ?? 80, compressionLevel: 8 })
      break
    case 'webp':
      pipeline = pipeline.webp({ quality: options.quality ?? 80 })
      break
    case 'avif':
      pipeline = pipeline.avif({ quality: options.quality ?? 65 })
      break
  }

  return pipeline.toBuffer()
}

export async function getImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
  const meta = await sharp(buffer).metadata()
  return {
    width: meta.width || 0,
    height: meta.height || 0,
    format: meta.format || 'jpeg',
    size: buffer.length,
    hasAlpha: meta.hasAlpha,
  }
}

export async function generateThumbnail(
  buffer: Buffer,
  size = 300
): Promise<Buffer> {
  return sharp(buffer)
    .resize(size, size, { fit: 'cover', withoutEnlargement: true })
    .jpeg({ quality: 70, mozjpeg: true })
    .toBuffer()
}

export async function generatePreview(
  buffer: Buffer,
  maxWidth = 800
): Promise<Buffer> {
  return sharp(buffer)
    .resize(maxWidth, undefined, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer()
}

export function getOptimizedFormat(input: string): 'jpeg' | 'png' | 'webp' | 'avif' {
  const ext = input.split('.').pop()?.toLowerCase()
  if (ext === 'png') return 'png'
  if (ext === 'webp') return 'webp'
  if (ext === 'avif') return 'avif'
  return 'jpeg'
}

export function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    avif: 'image/avif',
  }
  return map[ext || ''] || 'image/jpeg'
}
