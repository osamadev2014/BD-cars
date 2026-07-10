export enum AiFeature {
  CompleteCarData = 'completeCarData',
  SuggestDescription = 'suggestDescription',
  EstimatePrice = 'estimatePrice',
  SummarizeReport = 'summarizeReport',
  DetectAnomalies = 'detectAnomalies',
  SuggestParts = 'suggestParts',
}

export interface AiProviderConfig {
  mockDelay?: number
}

export interface AiRequest {
  prompt: string
  context?: Record<string, unknown>
  locale?: 'ar' | 'en'
}

export interface AiResponse<T = unknown> {
  success: boolean
  data: T | null
  error: string | null
}

export interface CarDataResult {
  trim: string
  engine: string
  horsepower: string
  transmission: string
  drivetrain: string
  fuelType: string
  bodyType: string
  cylinders: number
  doors: number
  color: string
}

export interface DescriptionResult {
  description: string
  highlights: string[]
}

export interface PriceEstimateResult {
  estimatedPrice: number
  priceRange: { min: number; max: number }
  confidence: 'low' | 'medium' | 'high'
  factors: string[]
}

export interface ReportSummaryResult {
  summary: string
  keyFindings: string[]
  recommendation: string
}

export interface AnomalyResult {
  anomalies: string[]
  severity: 'low' | 'medium' | 'high'
  suggestion: string
}

export interface PartSuggestionResult {
  parts: Array<{
    name: string
    partNumber: string
    compatibility: string
    estimatedPrice: number
    type: 'original' | 'aftermarket' | 'oem'
  }>
}

export interface AiProvider {
  completeCarData(
    make: string,
    model: string,
    year: number,
    locale?: 'ar' | 'en'
  ): Promise<AiResponse<CarDataResult>>

  suggestDescription(
    make: string,
    model: string,
    year: number,
    specs: Record<string, unknown>,
    locale?: 'ar' | 'en'
  ): Promise<AiResponse<DescriptionResult>>

  estimatePrice(
    make: string,
    model: string,
    year: number,
    mileage: number,
    condition: string,
    locale?: 'ar' | 'en'
  ): Promise<AiResponse<PriceEstimateResult>>

  summarizeReport(
    reportData: Record<string, unknown>,
    locale?: 'ar' | 'en'
  ): Promise<AiResponse<ReportSummaryResult>>

  detectAnomalies(
    listingData: Record<string, unknown>,
    locale?: 'ar' | 'en'
  ): Promise<AiResponse<AnomalyResult>>

  suggestParts(
    carMake: string,
    model: string,
    year: number,
    partName: string,
    locale?: 'ar' | 'en'
  ): Promise<AiResponse<PartSuggestionResult>>
}
