'use client'

import { Building2, Wrench, Car, Truck, ShieldCheck, Landmark, Megaphone, Package, Ship, Warehouse, ChevronLeft, ChevronRight, Clock, MapPin, AlertCircle, User, Ban, ArrowLeft, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { OrganizationStatusBadge } from './OrganizationStatusBadge'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const ORG_ICONS: Record<string, LucideIcon> = {
  car_dealer: Car,
  inspection_center: Wrench,
  wholesale_vehicle_trader: Warehouse,
  spare_parts_supplier: Package,
  finance_company: Landmark,
  insurance_company: ShieldCheck,
  advertising_marketing_company: Megaphone,
  car_rental_company: Truck,
  product_shipping_company: Ship,
  vehicle_transport_company: Truck,
}

const ORG_LABELS: Record<string, [string, string]> = {
  car_dealer: ['Car Dealership', 'معرض سيارات'],
  inspection_center: ['Inspection Center', 'مركز فحص'],
  wholesale_vehicle_trader: ['Wholesale Trader', 'تاجر جملة'],
  spare_parts_supplier: ['Parts Supplier', 'مورد قطع غيار'],
  finance_company: ['Finance Company', 'شركة تمويل'],
  insurance_company: ['Insurance Company', 'شركة تأمين'],
  advertising_marketing_company: ['Advertising & Marketing', 'إعلانات وتسويق'],
  car_rental_company: ['Car Rental', 'تأجير سيارات'],
  product_shipping_company: ['Shipping Company', 'شركة شحن'],
  vehicle_transport_company: ['Vehicle Transport', 'نقل سيارات'],
}

const ORG_GRADIENTS: Record<string, string> = {
  car_dealer: 'from-blue-600 to-blue-700',
  inspection_center: 'from-emerald-600 to-emerald-700',
  wholesale_vehicle_trader: 'from-amber-600 to-amber-700',
  spare_parts_supplier: 'from-violet-600 to-violet-700',
  finance_company: 'from-sky-600 to-sky-700',
  insurance_company: 'from-rose-600 to-rose-700',
  advertising_marketing_company: 'from-fuchsia-600 to-fuchsia-700',
  car_rental_company: 'from-teal-600 to-teal-700',
  product_shipping_company: 'from-cyan-600 to-cyan-700',
  vehicle_transport_company: 'from-orange-600 to-orange-700',
}

const ROLE_LABELS: Record<string, [string, string]> = {
  owner: ['Owner', 'المالك'],
  admin: ['Admin', 'مدير المنشأة'],
  branch_manager: ['Branch Manager', 'مدير فرع'],
  sales_employee: ['Sales Employee', 'موظف مبيعات'],
  accountant: ['Accountant', 'محاسب'],
  employee: ['Employee', 'موظف'],
}

export function getOrgLabel(type: string, isRtl: boolean): string {
  const pair = ORG_LABELS[type]
  return pair ? (isRtl ? pair[1] : pair[0]) : type
}

export function getRoleLabel(role: string, isRtl: boolean): string {
  const pair = ROLE_LABELS[role]
  return pair ? (isRtl ? pair[1] : pair[0]) : role
}

export function getOrgIcon(type: string): LucideIcon {
  return ORG_ICONS[type] || Building2
}

export function getOrgGradient(type: string): string {
  return ORG_GRADIENTS[type] || 'from-primary to-primary/80'
}

function OrgTypeIcon({ type, className }: { type: string; className?: string }) {
  const IconCmp = ORG_ICONS[type] || Building2
  return <IconCmp className={className} />
}

interface OrganizationCardProps {
  org: any
  isRtl: boolean
  isRecent?: boolean
  selecting?: string | null
  onSelect: (org: any) => void
}

function getStatusAction(org: any, locale: string) {
  const isAr = locale === 'ar'

  if (org.status === 'pending_approval') {
    return {
      label: isAr ? 'قيد مراجعة البيانات' : 'Under Review',
      disabled: true,
      variant: 'secondary' as const,
    }
  }

  if (org.status === 'incomplete' || (!org.is_active && org.status === 'active')) {
    return {
      label: isAr ? 'استكمال بيانات المنشأة' : 'Complete Registration',
      disabled: false,
      variant: 'outline' as const,
    }
  }

  if (org.status === 'suspended') {
    return {
      label: isAr ? 'تواصل مع الدعم' : 'Contact Support',
      disabled: false,
      variant: 'outline' as const,
    }
  }

  if (org.status === 'invited') {
    return {
      label: isAr ? 'عرض الدعوة' : 'View Invitation',
      disabled: false,
      variant: 'secondary' as const,
    }
  }

  return {
    label: isAr ? 'دخول لوحة التحكم' : 'Enter Dashboard',
    disabled: false,
    variant: 'primary' as const,
  }
}

export function OrganizationCard({ org, isRtl, isRecent, selecting, onSelect }: OrganizationCardProps) {
  const gradient = getOrgGradient(org.org_type)
  const statusAction = getStatusAction(org, isRtl ? 'ar' : 'en')
  const isDisabled = !!selecting || org.status === 'suspended' || org.status === 'pending_approval'
  const isSelecting = selecting === org.id
  const hasLogo = !!org.logo_url

  const handleClick = () => {
    if (isDisabled) return
    onSelect(org)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isDisabled) onSelect(org)
    }
  }

  return (
    <Card
      variant={org.status === 'suspended' ? 'ghost' : 'default'}
      hover={!isDisabled}
      className={cn(
        'relative overflow-hidden transition-all duration-200 group',
        isDisabled && !isSelecting && 'opacity-60',
        isSelecting && 'ring-2 ring-primary shadow-lg',
        !isDisabled && 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer',
        org.status === 'suspended' && 'border-destructive/20 bg-destructive/[0.02]',
        org.status === 'pending_approval' && 'border-amber-200/50',
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isDisabled ? -1 : 0}
      role="button"
      aria-disabled={isDisabled ? 'true' as const : undefined}
      aria-label={`${org.name_ar || org.name} - ${getOrgLabel(org.org_type, isRtl)}`}
    >
      {isRecent && (
        <div className="absolute top-3 start-3 z-10">
          <Badge variant="info" size="sm" iconLeft={<Clock className="h-3 w-3" />}>
            {isRtl ? 'آخر منشأة استخدمتها' : 'Recently Used'}
          </Badge>
        </div>
      )}

      {org.status === 'suspended' && (
        <div className="absolute inset-0 bg-destructive/[0.02] pointer-events-none" />
      )}

      <CardContent className={cn('p-0', isRecent && 'pt-2')}>
        {/* Icon / Logo area */}
        <div className={cn('px-5 pt-5 pb-3', isRecent && 'pt-3')}>
          <div className="flex items-start gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="relative shrink-0">
              {hasLogo ? (
                <div className="h-14 w-14 rounded-2xl overflow-hidden border border-border/60 bg-white shadow-sm flex items-center justify-center">
                  <Image
                    src={org.logo_url}
                    alt={org.name_ar || org.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className={cn(
                  'h-14 w-14 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-sm border border-white/20',
                  gradient
                )}>
                  <OrgTypeIcon type={org.org_type} className="h-7 w-7 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-lg font-bold text-foreground leading-snug line-clamp-2">
                {org.name_ar || org.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                <span className={cn(
                  'inline-block w-1.5 h-1.5 rounded-full shrink-0',
                  gradient.replace('from-', 'bg-').split(' ')[0]
                )} />
                {getOrgLabel(org.org_type, isRtl)}
              </p>
            </div>
          </div>
        </div>

        {/* Status + Role row */}
        <div className="px-5 pb-2">
          <div className="flex flex-wrap items-center gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
            <OrganizationStatusBadge
              status={org.status}
              isActive={org.is_active}
              locale={isRtl ? 'ar' : 'en'}
            />
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/40">
              <User className="h-3 w-3" />
              {getRoleLabel(org.my_role || 'member', isRtl)}
            </span>
          </div>
        </div>

        {/* Optional metadata - only when real data available */}
        {(org.city_id || org.last_access) && (
          <div className="px-5 pb-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground/70" dir={isRtl ? 'rtl' : 'ltr'}>
              {org.city_id && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {typeof org.city_id === 'string' && org.city_id.length > 3
                    ? org.city_id
                    : isRtl ? 'الرياض' : 'Riyadh'}
                </span>
              )}
              {org.last_access && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {isRtl ? 'آخر دخول: ' : 'Last access: '}
                  {new Date(org.last_access).toLocaleDateString(isRtl ? 'ar-SA' : 'en-US', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action area */}
        <div className={cn(
          'px-5 py-3 border-t border-border/40',
          'bg-muted/20'
        )}>
          {org.status === 'active' && org.is_active && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              loading={isSelecting}
              disabled={statusAction.disabled}
              onClick={(e) => { e.stopPropagation(); onSelect(org) }}
              className="h-10"
              iconRight={
                !isSelecting ? (
                  isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                ) : undefined
              }
            >
              {statusAction.label}
            </Button>
          )}

          {org.status === 'pending_approval' && (
            <Button variant="secondary" size="sm" fullWidth disabled className="h-10">
              <AlertCircle className="h-4 w-4" />
              {statusAction.label}
            </Button>
          )}

          {(org.status === 'suspended') && (
            <Button variant="outline" size="sm" fullWidth onClick={(e) => { e.stopPropagation(); onSelect(org) }} className="h-10 text-destructive border-destructive/30 hover:bg-destructive/5">
              <Ban className="h-4 w-4" />
              {statusAction.label}
            </Button>
          )}

          {(org.status === 'incomplete' || (!org.is_active && org.status === 'active')) && (
            <Button variant="outline" size="sm" fullWidth onClick={(e) => { e.stopPropagation(); onSelect(org) }} className="h-10">
              {statusAction.label}
              {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}

          {(org.status === 'invited' || org.status === 'invite_pending') && (
            <Button variant="secondary" size="sm" fullWidth onClick={(e) => { e.stopPropagation(); onSelect(org) }} className="h-10">
              {statusAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { ORG_LABELS, ORG_ICONS, ORG_GRADIENTS, ROLE_LABELS }
