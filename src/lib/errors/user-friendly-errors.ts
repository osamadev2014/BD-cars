type ErrorMap = Record<string, { titleKey: string; descriptionKey: string }>

const AR_ERRORS: ErrorMap = {
  rls_violation: { titleKey: 'errors.rls.title', descriptionKey: 'errors.rls.desc' },
  permission_denied: { titleKey: 'errors.permission.title', descriptionKey: 'errors.permission.desc' },
  session_expired: { titleKey: 'errors.session.title', descriptionKey: 'errors.session.desc' },
  org_access_denied: { titleKey: 'errors.org_access.title', descriptionKey: 'errors.org_access.desc' },
  duplicate_record: { titleKey: 'errors.duplicate.title', descriptionKey: 'errors.duplicate.desc' },
  required_field: { titleKey: 'errors.required.title', descriptionKey: 'errors.required.desc' },
  invalid_data: { titleKey: 'errors.invalid.title', descriptionKey: 'errors.invalid.desc' },
  upload_failed: { titleKey: 'errors.upload.title', descriptionKey: 'errors.upload.desc' },
  image_too_large: { titleKey: 'errors.image_size.title', descriptionKey: 'errors.image_size.desc' },
  unsupported_file: { titleKey: 'errors.file_type.title', descriptionKey: 'errors.file_type.desc' },
  network_error: { titleKey: 'errors.network.title', descriptionKey: 'errors.network.desc' },
  db_connection: { titleKey: 'errors.db.title', descriptionKey: 'errors.db.desc' },
  not_found: { titleKey: 'errors.not_found.title', descriptionKey: 'errors.not_found.desc' },
  server_error: { titleKey: 'errors.server.title', descriptionKey: 'errors.server.desc' },
}

export function getUserFriendlyError(
  error: unknown,
  locale: string
): { title: string; description: string; technical?: string } {
  const message = extractMessage(error)
  const key = classifyError(message)
  const map = AR_ERRORS

  if (locale === 'ar') {
    const ar = AR_ERRORS[key]
    if (ar) {
      return { title: ar.titleKey, description: ar.descriptionKey, technical: message }
    }
    return { title: 'خطأ غير معروف', description: 'حدث خطأ غير متوقع. حاول مرة أخرى لاحقاً.', technical: message }
  }

  const en: Record<string, { titleKey: string; descriptionKey: string }> = {
    rls_violation: { titleKey: 'Unable to Save', descriptionKey: 'You do not have permission to perform this action. Check your account permissions or contact support.' },
    permission_denied: { titleKey: 'Permission Denied', descriptionKey: 'You do not have the required permissions for this action.' },
    session_expired: { titleKey: 'Session Expired', descriptionKey: 'Your session has expired. Please log in again.' },
    org_access_denied: { titleKey: 'Access Denied', descriptionKey: 'You do not have access to this organization.' },
    duplicate_record: { titleKey: 'Duplicate Record', descriptionKey: 'A record with this information already exists.' },
    required_field: { titleKey: 'Missing Information', descriptionKey: 'Please fill in all required fields.' },
    invalid_data: { titleKey: 'Invalid Data', descriptionKey: 'The provided data is not valid. Please check your input.' },
    upload_failed: { titleKey: 'Upload Failed', descriptionKey: 'Failed to upload file. Please try again.' },
    image_too_large: { titleKey: 'Image Too Large', descriptionKey: 'The selected image exceeds the maximum file size.' },
    unsupported_file: { titleKey: 'Unsupported File', descriptionKey: 'This file type is not supported. Please choose a different file.' },
    network_error: { titleKey: 'Network Error', descriptionKey: 'A network error occurred. Check your connection and try again.' },
    db_connection: { titleKey: 'Service Unavailable', descriptionKey: 'The service is temporarily unavailable. Please try again later.' },
    not_found: { titleKey: 'Not Found', descriptionKey: 'The requested resource was not found.' },
    server_error: { titleKey: 'Server Error', descriptionKey: 'An unexpected error occurred. Please try again later.' },
  }

  const item = en[key] || { titleKey: 'Unknown Error', descriptionKey: 'An unexpected error occurred. Please try again later.' }
  return { title: item.titleKey, description: item.descriptionKey, technical: message }
}

function extractMessage(error: unknown): string {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object') {
    const obj = error as any
    return obj.message || obj.error || obj.error_description || JSON.stringify(error)
  }
  return String(error)
}

function classifyError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('row-level security') || m.includes('rls') || m.includes('policy') || m.includes('violates row')) return 'rls_violation'
  if (m.includes('permission denied') || m.includes('not authorized') || m.includes('forbidden') || m.includes('unauthorized')) return 'permission_denied'
  if (m.includes('session') && (m.includes('expired') || m.includes('invalid') || m.includes('not found'))) return 'session_expired'
  if (m.includes('organization') && (m.includes('access') || m.includes('member') || m.includes('not found'))) return 'org_access_denied'
  if (m.includes('duplicate') || m.includes('already exists') || m.includes('unique constraint')) return 'duplicate_record'
  if (m.includes('required') || m.includes('missing') || m.includes('cannot be null') || m.includes('not null')) return 'required_field'
  if (m.includes('invalid') || m.includes('malformed') || m.includes('bad request') || m.includes('validation')) return 'invalid_data'
  if (m.includes('upload') && (m.includes('fail') || m.includes('error'))) return 'upload_failed'
  if (m.includes('image') && (m.includes('size') || m.includes('large') || m.includes('max'))) return 'image_too_large'
  if (m.includes('file type') || m.includes('unsupported') || m.includes('format')) return 'unsupported_file'
  if (m.includes('network') || m.includes('fetch') || m.includes('econnrefused') || m.includes('timeout') || m.includes('abort')) return 'network_error'
  if (m.includes('connection') || m.includes('database error') || (m.includes('postgres') || m.includes('supabase')) && m.includes('error')) return 'db_connection'
  if (m.includes('not found') || m.includes('404') || m.includes('does not exist')) return 'not_found'
  if (m.includes('server error') || m.includes('500') || m.includes('internal')) return 'server_error'
  return 'server_error'
}