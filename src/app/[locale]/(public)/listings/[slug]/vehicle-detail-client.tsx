 'use client'
import { useState } from 'react'
import { toggleFavorite, recordView } from '@/lib/actions/vehicle-actions'
import { createPurchaseRequest, createViewingAppointment } from '@/lib/actions/buy-actions'
import { startConversation } from '@/lib/actions/message-actions'
import { createFinanceRequest } from '@/lib/actions/finance-actions'
import { createInsuranceRequest } from '@/lib/actions/insurance-actions'
import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import { CompareButton } from '@/components/compare/compare-button'

export function VehicleDetailClient({ listing, financePartners, insurancePartners }: { listing: any; financePartners?: any[]; insurancePartners?: any[] }) {
  const t = useTranslations('common')
  const ft = useTranslations('finance')
  const it = useTranslations('insurance')
  const locale = useLocale()
  const isRtl = locale === 'ar'
  const { user } = useAuth()
  const router = useRouter()

  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [showViewingForm, setShowViewingForm] = useState(false)
  const [showFinanceForm, setShowFinanceForm] = useState(false)
  const [showInsuranceForm, setShowInsuranceForm] = useState(false)
  const [message, setMessage] = useState('')
  const [proposedPrice, setProposedPrice] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [financePartner, setFinancePartner] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [insurancePartner, setInsurancePartner] = useState('')
  const [insuranceType, setInsuranceType] = useState('comprehensive')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    recordView(listing.id)
  }, [listing.id])

  const requireAuth = (action: () => void) => {
    if (!user) { router.push(`/login`); return }
    action()
  }

  const handlePurchaseRequest = async () => {
    requireAuth(async () => {
      setLoading(true)
      try {
        await createPurchaseRequest(
          listing.id,
          message || t('message_placeholder'),
          proposedPrice ? parseFloat(proposedPrice) : undefined
        )
        await startConversation({
          listingId: listing.id,
          content: message || t('message_placeholder'),
          subject: 'purchase_inquiry',
        })
        alert(t('request_sent'))
        setShowPurchaseForm(false)
        setMessage('')
        setProposedPrice('')
      } catch (err: any) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    })
  }

  const handleBookViewing = async () => {
    requireAuth(async () => {
      if (!appointmentDate || !location) return
      setLoading(true)
      try {
        await createViewingAppointment(listing.id, appointmentDate, location, notes)
        alert(t('viewing_booked'))
        setShowViewingForm(false)
        setAppointmentDate('')
        setLocation('')
        setNotes('')
      } catch (err: any) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    })
  }

  const handleFinanceRequest = async () => {
    requireAuth(async () => {
      if (!financePartner) return
      setLoading(true)
      try {
        await createFinanceRequest(listing.id, financePartner, listing.price, parseFloat(downPayment) || 0)
        alert(ft('request_sent'))
        setShowFinanceForm(false)
        setFinancePartner('')
        setDownPayment('')
      } catch (err: any) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    })
  }

  const handleInsuranceRequest = async () => {
    requireAuth(async () => {
      if (!insurancePartner) return
      setLoading(true)
      try {
        await createInsuranceRequest(listing.id, insurancePartner, listing.price, insuranceType)
        alert(it('request_sent'))
        setShowInsuranceForm(false)
        setInsurancePartner('')
        setInsuranceType('comprehensive')
      } catch (err: any) {
        alert(err.message)
      } finally {
        setLoading(false)
      }
    })
  }

  const handleToggleFavorite = async () => {
    requireAuth(async () => {
      await toggleFavorite(listing.id)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleToggleFavorite}>
          {t('save_listing')}
        </Button>
        <CompareButton listingId={listing.id} />

        <Button onClick={() => requireAuth(() => setShowPurchaseForm(true))}>
          {t('request_purchase')}
        </Button>
        <Button variant="outline" onClick={() => requireAuth(() => setShowViewingForm(true))}>
          {t('book_viewing')}
        </Button>
        {(financePartners || []).length > 0 && (
          <Button variant="outline" onClick={() => requireAuth(() => setShowFinanceForm(true))}>
            {ft('request_finance')}
          </Button>
        )}
        {(insurancePartners || []).length > 0 && (
          <Button variant="outline" onClick={() => requireAuth(() => setShowInsuranceForm(true))}>
            {it('request_insurance')}
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <p className="w-full text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('payment_options')}</p>
        {[
          { id: 'tabby', label: isRtl ? 'تابي' : 'Tabby', icon: '💜' },
          { id: 'tamara', label: isRtl ? 'تمارا' : 'Tamara', icon: '💚' },
          { id: 'amwal', label: isRtl ? 'أموال' : 'Amwal', icon: '💙' },
        ].map((opt) => (
          <span key={opt.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-400">
            <span>{opt.icon}</span>
            <span>{opt.label}</span>
          </span>
        ))}
      </div>

      {showPurchaseForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowPurchaseForm(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{t('purchase_request')}</h3>
            <div>
              <label className="text-sm font-medium">{t('your_message')}</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('message_placeholder')}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('proposed_price')} ({t('optional')})</label>
              <Input
                type="number"
                value={proposedPrice}
                onChange={(e) => setProposedPrice(e.target.value)}
                placeholder={t('price')}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handlePurchaseRequest} disabled={loading} className="flex-1">
                {loading ? t('loading') : t('submit')}
              </Button>
              <Button variant="outline" onClick={() => setShowPurchaseForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showViewingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowViewingForm(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{t('book_viewing')}</h3>
            <div>
              <label className="text-sm font-medium">{t('appointment_date')}</label>
              <Input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('appointment_location')}</label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('appointment_location')}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t('viewing_notes')}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleBookViewing} disabled={loading || !appointmentDate || !location} className="flex-1">
                {loading ? t('loading') : t('submit')}
              </Button>
              <Button variant="outline" onClick={() => setShowViewingForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showFinanceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowFinanceForm(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{ft('request_finance')}</h3>
            <div>
              <label className="text-sm font-medium">{ft('partner')}</label>
              <select
                value={financePartner}
                onChange={(e) => setFinancePartner(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              >
                <option value="">{ft('select_partner')}</option>
                {financePartners?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name || p.name_ar}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{t('price')}: {listing.price?.toLocaleString()} SAR</label>
            </div>
            <div>
              <label className="text-sm font-medium">{ft('down_payment')}</label>
              <Input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder={ft('down_payment_placeholder')}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFinanceRequest} disabled={loading || !financePartner} className="flex-1">
                {loading ? t('loading') : ft('submit')}
              </Button>
              <Button variant="outline" onClick={() => setShowFinanceForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {showInsuranceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowInsuranceForm(false)}>
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4 space-y-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold">{it('request_insurance')}</h3>
            <div>
              <label className="text-sm font-medium">{it('partner')}</label>
              <select
                value={insurancePartner}
                onChange={(e) => setInsurancePartner(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              >
                <option value="">{it('select_partner')}</option>
                {insurancePartners?.map((p: any) => (
                  <option key={p.id} value={p.id}>{p.name || p.name_ar}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">{it('insurance_type')}</label>
              <select
                value={insuranceType}
                onChange={(e) => setInsuranceType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
              >
                <option value="comprehensive">{it('comprehensive')}</option>
                <option value="tpl">{it('tpl')}</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleInsuranceRequest} disabled={loading || !insurancePartner} className="flex-1">
                {loading ? t('loading') : it('submit')}
              </Button>
              <Button variant="outline" onClick={() => setShowInsuranceForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
