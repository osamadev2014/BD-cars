import { AI_MOCK_DELAY } from '@/constants'
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

function delay(ms: number = AI_MOCK_DELAY): Promise<void> {
  const jitter = Math.floor(Math.random() * 500)
  return new Promise((resolve) => setTimeout(resolve, ms + jitter))
}

function log(feature: string, input: unknown): void {
  console.log(`[AI Mock] ${feature} called with:`, JSON.stringify(input, null, 2))
}

const arMakes: Record<string, string> = {
  Toyota: 'تويوتا',
  Honda: 'هوندا',
  Nissan: 'نيسان',
  Hyundai: 'هيونداي',
  Kia: 'كيا',
  BMW: 'بي إم دبليو',
  Mercedes: 'مرسيدس',
}

const fuelTypes = ['بنزين', 'ديزل', 'هايبرد', 'كهرباء']
const fuelTypesEn = ['Gasoline', 'Diesel', 'Hybrid', 'Electric']

const conditions = ['ممتازة', 'جيدة جداً', 'جيدة', 'مقبولة']
const conditionsEn = ['Excellent', 'Very Good', 'Good', 'Fair']

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export class MockAiProvider implements AiProvider {
  async completeCarData(
    make: string,
    model: string,
    year: number,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<CarDataResult>> {
    log('completeCarData', { make, model, year, locale })
    await delay()
    const isAr = locale === 'ar'
    return {
      success: true,
      data: {
        trim: isAr ? 'فل كامل' : 'Full Option',
        engine: isAr ? '2.5 لتر 4 سلندر' : '2.5L 4-Cylinder',
        horsepower: isAr ? '200 حصان' : '200 HP',
        transmission: isAr ? 'أوتوماتيك' : 'Automatic',
        drivetrain: isAr ? 'دفع أمامي' : 'FWD',
        fuelType: pick(isAr ? fuelTypes : fuelTypesEn),
        bodyType: isAr ? 'سيدان' : 'Sedan',
        cylinders: 4,
        doors: 4,
        color: isAr ? 'أبيض' : 'White',
      },
      error: null,
    }
  }

  async suggestDescription(
    make: string,
    model: string,
    year: number,
    specs: Record<string, unknown>,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<DescriptionResult>> {
    log('suggestDescription', { make, model, year, specs, locale })
    await delay()
    const isAr = locale === 'ar'
    const makeAr = arMakes[make] || make
    const mileage = (specs.mileage as string) || (isAr ? '٨٠,٠٠٠ كم' : '80,000 km')
    const condition = pick(isAr ? conditions : conditionsEn)

    if (isAr) {
      return {
        success: true,
        data: {
          description: [
            `سيارة ${makeAr} ${model} موديل ${year} بحالة ${condition}.`,
            `عداد المسافة ${mileage}.`,
            'السيارة صيانة دورية وكالة، مطلية باللون الأصلي، بدون حوادث.',
            'جاهزة للفحص والتجربة.',
          ].join(' '),
          highlights: [
            'صيانة دورية في الوكالة',
            'بدون حوادث',
            `عداد المسافة ${mileage}`,
            `حالة ${condition}`,
          ],
        },
        error: null,
      }
    }

    return {
      success: true,
      data: {
        description: [
          `${make} ${model} ${year} in ${condition} condition.`,
          `Mileage: ${mileage}.`,
          'Regular agency maintenance, original paint, accident-free.',
          'Ready for inspection and test drive.',
        ].join(' '),
        highlights: [
          'Regular agency maintenance',
          'Accident-free',
          `Mileage: ${mileage}`,
          `${condition} condition`,
        ],
      },
      error: null,
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
    log('estimatePrice', { make, model, year, mileage, condition, locale })
    await delay()
    const basePrice = randBetween(50000, 150000)
    const range = Math.floor(basePrice * 0.15)
    return {
      success: true,
      data: {
        estimatedPrice: basePrice,
        priceRange: { min: basePrice - range, max: basePrice + range },
        confidence: 'medium',
        factors: [
          locale === 'ar'
            ? `متوسط سعر السوق لـ ${make} ${model}`
            : `Average market price for ${make} ${model}`,
          locale === 'ar'
            ? `المسافة: ${mileage.toLocaleString()} كم`
            : `Mileage: ${mileage.toLocaleString()} km`,
          locale === 'ar'
            ? `حالة السيارة: ${condition}`
            : `Condition: ${condition}`,
          locale === 'ar'
            ? `سنة الصنع: ${year}`
            : `Year: ${year}`,
        ],
      },
      error: null,
    }
  }

  async summarizeReport(
    reportData: Record<string, unknown>,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<ReportSummaryResult>> {
    log('summarizeReport', { reportData, locale })
    await delay()
    const isAr = locale === 'ar'
    return {
      success: true,
      data: {
        summary: isAr
          ? 'تقرير الفحص يظهر أن السيارة في حالة جيدة مع بعض الملاحظات البسيطة.'
          : 'The inspection report shows the vehicle is in good condition with minor observations.',
        keyFindings: isAr
          ? ['الهيكل سليم', 'المحرك يعمل بكفاءة', 'دهان أصلي', 'بعض الخدوش البسيطة']
          : ['Body structure intact', 'Engine running efficiently', 'Original paint', 'Minor scratches'],
        recommendation: isAr
          ? 'ينصح بإجراء صيانة دورية قبل الشراء.'
          : 'Recommended to perform routine maintenance before purchase.',
      },
      error: null,
    }
  }

  async detectAnomalies(
    listingData: Record<string, unknown>,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<AnomalyResult>> {
    log('detectAnomalies', { listingData, locale })
    await delay()
    const isAr = locale === 'ar'
    return {
      success: true,
      data: {
        anomalies: isAr
          ? ['سعر أقل من متوسط السوق بنسبة ٢٠٪', 'لا توجد صور كافية']
          : ['Price is 20% below market average', 'Insufficient images'],
        severity: 'low',
        suggestion: isAr
          ? 'يرجى التحقق من مصداقية البائع والتأكد من كامل الوثائق.'
          : 'Please verify seller credibility and ensure complete documentation.',
      },
      error: null,
    }
  }

  async suggestParts(
    carMake: string,
    model: string,
    year: number,
    partName: string,
    locale: 'ar' | 'en' = 'ar'
  ): Promise<AiResponse<PartSuggestionResult>> {
    log('suggestParts', { carMake, model, year, partName, locale })
    await delay()
    return {
      success: true,
      data: {
        parts: [
          {
            name: partName,
            partNumber: `${carMake.toUpperCase()}-${year}-${partName.replace(/\s+/g, '-').toUpperCase()}`,
            compatibility: `${carMake} ${model} ${year}`,
            estimatedPrice: randBetween(200, 5000),
            type: 'original',
          },
        ],
      },
      error: null,
    }
  }
}
