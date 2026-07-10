'use client'

import { useState, useCallback, useRef } from 'react'
import { useTranslations } from 'next-intl'

interface UploadedImage {
  url: string
  path: string
  thumbnailUrl?: string
  width?: number
  height?: number
}

interface ImageItem {
  file: File
  preview: string
  id: string
  progress: number
  status: 'pending' | 'uploading' | 'done' | 'error'
  result?: UploadedImage
  error?: string
}

interface ImageUploaderProps {
  maxFiles?: number
  maxSizeMB?: number
  bucket?: string
  folder?: string
  onUploadComplete?: (results: UploadedImage[]) => void
  existingImages?: string[]
  accept?: string
}

export function ImageUploader({
  maxFiles = 20,
  maxSizeMB = 10,
  bucket = 'vehicles',
  folder = 'listings',
  onUploadComplete,
  existingImages = [],
  accept = 'image/jpeg,image/png,image/webp,image/avif',
}: ImageUploaderProps) {
  const t = useTranslations('common')
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<ImageItem[]>(() =>
    existingImages.map((url) => ({
      file: new File([], ''),
      preview: url,
      id: url,
      progress: 100,
      status: 'done' as const,
      result: { url, path: url },
    }))
  )
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const uploadFile = async (image: ImageItem): Promise<UploadedImage | null> => {
    const formData = new FormData()
    formData.append('file', image.file)
    formData.append('bucket', bucket)
    formData.append('folder', folder)
    formData.append('thumbnail', 'true')

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      return {
        url: data.url,
        path: data.path,
        thumbnailUrl: data.thumbnailUrl,
        width: data.width,
        height: data.height,
      }
    } catch (e: any) {
      throw new Error(e.message || 'Upload failed')
    }
  }

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const pendingCount = images.filter((i) => i.status !== 'done').length
      const remaining = maxFiles - images.length + pendingCount
      if (remaining <= 0) return

      const newImages: ImageItem[] = []
      for (let i = 0; i < Math.min(files.length, remaining); i++) {
        const file = files[i]
        if (!accept.split(',').some((t) => file.type.match(t.trim().replace('*', '')))) continue
        if (file.size > maxSizeMB * 1024 * 1024) continue
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          id: `${Date.now()}-${i}`,
          progress: 0,
          status: 'pending',
        })
      }
      setImages((prev) => [...prev, ...newImages])
    },
    [maxFiles, maxSizeMB, accept, images.length]
  )

  const uploadAll = async () => {
    const pending = images.filter((i) => i.status === 'pending')
    if (pending.length === 0) return
    setIsUploading(true)

    const results: UploadedImage[] = []
    for (const image of pending) {
      setImages((prev) =>
        prev.map((i) => (i.id === image.id ? { ...i, status: 'uploading', progress: 30 } : i))
      )
      try {
        const result = await uploadFile(image)
        if (result) {
          results.push(result)
          setImages((prev) =>
            prev.map((i) =>
              i.id === image.id ? { ...i, progress: 100, status: 'done', result } : i
            )
          )
        }
      } catch (e: any) {
        setImages((prev) =>
          prev.map((i) =>
            i.id === image.id ? { ...i, status: 'error', error: e.message } : i
          )
        )
      }
    }
    setIsUploading(false)
    onUploadComplete?.(results)
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id)
      if (img?.preview && img.status !== 'done') URL.revokeObjectURL(img.preview)
      return prev.filter((i) => i.id !== id)
    })
  }

  const pendingCount = images.filter((i) => i.status === 'pending').length

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false) }
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 bg-muted/50 hover:border-muted-foreground/50'
        }`}
      >
        <svg className="mb-2 h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-muted-foreground">{t('drop_images')}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('max_images')}: {maxFiles} | {t('max_size')}: {maxSizeMB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
              <img
                src={img.status === 'done' && img.result?.thumbnailUrl ? img.result.thumbnailUrl : img.preview}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                disabled={img.status === 'uploading'}
                className="absolute top-1 end-1 h-5 w-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
              >
                &times;
              </button>
              {img.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {img.status === 'error' && (
                <div className="absolute inset-0 bg-red-900/60 flex items-center justify-center" title={img.error}>
                  <span className="text-white text-xs">!</span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted-foreground/20">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${img.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap items-center">
        {pendingCount > 0 && (
          <button
            type="button"
            onClick={uploadAll}
            disabled={isUploading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isUploading ? t('uploading') : `${t('upload_images')} (${pendingCount})`}
          </button>
        )}
        {images.filter((i) => i.status === 'done').length > 0 && (
          <span className="text-xs text-muted-foreground">
            {images.filter((i) => i.status === 'done').length} / {maxFiles} {t('uploaded').toLowerCase()}
          </span>
        )}
      </div>
    </div>
  )
}
