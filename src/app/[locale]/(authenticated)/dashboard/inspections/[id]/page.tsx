import { getTranslations } from 'next-intl/server'
import { getUserInspections } from '@/lib/actions/inspection-actions'
import { getInspectionReport } from '@/lib/actions/inspect-report-actions'
import { InspectionDetailClient } from './inspection-detail-client'
import { notFound } from 'next/navigation'

export default async function InspectionDetailPage({ params }: { params: { id: string } }) {
  const t = await getTranslations('inspection')
  const appointments = await getUserInspections()
  const appointment = appointments.find((a: any) => a.id === params.id)
  if (!appointment) notFound()

  const report = appointment.report ? await getInspectionReport(appointment.report.id) : null

  return <InspectionDetailClient appointment={appointment} report={report} />
}
