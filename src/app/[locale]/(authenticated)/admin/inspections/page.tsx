import { getTranslations } from 'next-intl/server'
import { getAllAppointments, getAllInspectionCenters } from '@/lib/actions/inspect-report-actions'
import { getCities } from '@/lib/actions/dealer-actions'
import { AdminInspectionsClient } from './admin-inspections-client'

export default async function AdminInspectionsPage() {
  const t = await getTranslations('admin')
  const appointments = await getAllAppointments()
  const centers = await getAllInspectionCenters()
  const cities = await getCities()

  return <AdminInspectionsClient appointments={appointments} centers={centers} cities={cities} />
}
