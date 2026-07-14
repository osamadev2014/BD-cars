'use client'

import { Building2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  isRtl: boolean
  onCreate: () => void
}

export function OrganizationSelectorEmptyState({ isRtl, onCreate }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-primary/[0.02] flex items-center justify-center mb-6 border border-primary/10 ring-1 ring-primary/5">
        <svg className="h-10 w-10 text-primary/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-foreground">
        {isRtl ? 'لا توجد لديك منشآت حتى الآن' : 'No Organizations Yet'}
      </h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
        {isRtl
          ? 'أنشئ منشأتك الأولى وابدأ بإدارة عملياتك من مكان واحد.'
          : 'Create your first organization and start managing your operations from one place.'}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button onClick={onCreate} size="lg">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
          {isRtl ? 'إنشاء منشأة جديدة' : 'Create Organization'}
        </Button>
        <Button variant="outline" size="lg">
          <UserPlus className="h-4 w-4" />
          {isRtl ? 'لدي دعوة للانضمام' : 'I Have an Invitation'}
        </Button>
      </div>
    </div>
  )
}
