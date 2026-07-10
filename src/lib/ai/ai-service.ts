import { isFeatureEnabled } from '@/lib/settings/settings-service'
import { createAuditLog } from '@/lib/audit/audit-service'
import { MockAiProvider } from './mock-provider'
import type {
  AiProvider,
  AiResponse,
  CarDataResult,
  DescriptionResult,
  PriceEstimateResult,
  ReportSummaryResult,
  AnomalyResult,
  PartSuggestionResult,
} from './types'

export class AiService {
  private provider: AiProvider

  constructor(provider?: AiProvider) {
    this.provider = provider ?? new MockAiProvider()
  }

  private async checkEnabled(): Promise<boolean> {
    return isFeatureEnabled('ai_enabled')
  }

  private async audit(action: string, metadata: unknown) {
    await createAuditLog({
      action: 'create',
      entityType: 'ai',
      entityId: null,
      metadata: { ai_action: action, ...(metadata as Record<string, unknown>) },
    }).catch(() => {})
  }

  async completeCarData(
    make: string,
    model: string,
    year: number,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<CarDataResult>> {
    const enabled = await this.checkEnabled()
    if (!enabled) return { success: false, data: null, error: 'AI features are disabled' }

    try {
      const result = await this.provider.completeCarData(make, model, year, locale)
      await this.audit('completeCarData', { make, model, year, success: result.success })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI service error'
      return { success: false, data: null, error: message }
    }
  }

  async suggestDescription(
    make: string,
    model: string,
    year: number,
    specs: Record<string, unknown>,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<DescriptionResult>> {
    const enabled = await this.checkEnabled()
    if (!enabled) return { success: false, data: null, error: 'AI features are disabled' }

    try {
      const result = await this.provider.suggestDescription(make, model, year, specs, locale)
      await this.audit('suggestDescription', { make, model, year, success: result.success })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI service error'
      return { success: false, data: null, error: message }
    }
  }

  async estimatePrice(
    make: string,
    model: string,
    year: number,
    mileage: number,
    condition: string,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<PriceEstimateResult>> {
    const enabled = await this.checkEnabled()
    if (!enabled) return { success: false, data: null, error: 'AI features are disabled' }

    try {
      const result = await this.provider.estimatePrice(make, model, year, mileage, condition, locale)
      await this.audit('estimatePrice', { make, model, year, success: result.success })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI service error'
      return { success: false, data: null, error: message }
    }
  }

  async summarizeReport(
    reportData: Record<string, unknown>,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<ReportSummaryResult>> {
    const enabled = await this.checkEnabled()
    if (!enabled) return { success: false, data: null, error: 'AI features are disabled' }

    try {
      const result = await this.provider.summarizeReport(reportData, locale)
      await this.audit('summarizeReport', { success: result.success })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI service error'
      return { success: false, data: null, error: message }
    }
  }

  async detectAnomalies(
    listingData: Record<string, unknown>,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<AnomalyResult>> {
    const enabled = await this.checkEnabled()
    if (!enabled) return { success: false, data: null, error: 'AI features are disabled' }

    try {
      const result = await this.provider.detectAnomalies(listingData, locale)
      await this.audit('detectAnomalies', { success: result.success })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI service error'
      return { success: false, data: null, error: message }
    }
  }

  async suggestParts(
    carMake: string,
    model: string,
    year: number,
    partName: string,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<PartSuggestionResult>> {
    const enabled = await this.checkEnabled()
    if (!enabled) return { success: false, data: null, error: 'AI features are disabled' }

    try {
      const result = await this.provider.suggestParts(carMake, model, year, partName, locale)
      await this.audit('suggestParts', { carMake, model, year, partName, success: result.success })
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'AI service error'
      return { success: false, data: null, error: message }
    }
  }
}
