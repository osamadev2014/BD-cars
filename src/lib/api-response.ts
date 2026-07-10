import { NextResponse } from 'next/server'

export function success(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function paginated(data: unknown[], total: number, page: number, perPage: number) {
  return NextResponse.json({
    success: true,
    data,
    pagination: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  })
}

export function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}
