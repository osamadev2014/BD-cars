import { getTranslations } from 'next-intl/server'
import { getInspectionReportByShareToken } from '@/lib/actions/inspect-report-actions'
import { ReportViewer } from './report-viewer'
import { notFound } from 'next/navigation'

export default async function ReportSharePage({ params }: { params: { token: string } }) {
  const t = await getTranslations('inspection')
  const report = await getInspectionReportByShareToken(params.token)
  if (!report) notFound()

  return <ReportViewer report={report} />
}
