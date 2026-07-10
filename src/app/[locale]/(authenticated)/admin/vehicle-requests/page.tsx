import { getTranslations } from 'next-intl/server'
import { getAllVehicleRequests } from '@/lib/actions/request-actions'
import { AdminVehicleRequestsClient } from './admin-vehicle-requests-client'

export default async function AdminVehicleRequestsPage() {
  const t = await getTranslations('vehicle_requests')
  const requests = await getAllVehicleRequests()

  return <AdminVehicleRequestsClient requests={requests} />
}
