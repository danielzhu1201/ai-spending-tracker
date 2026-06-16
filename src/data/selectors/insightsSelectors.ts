import type { InsightCard } from '../../types/domain'
import type {
  InsightRangeApiValue,
  InsightsApiResponse,
  InsightsRangeApiDto,
} from '../mock/insightsApi'

export type InsightRange = InsightRangeApiValue

export interface InsightRangeOption {
  id: InsightRange
  label: string
}

export interface InsightRangeViewModel {
  observations: InsightCard[]
}

export interface InsightsPageViewModel {
  selectedRange: InsightRange
  ranges: InsightRangeOption[]
  views: Record<InsightRange, InsightRangeViewModel>
}

function toRange(value: InsightRangeApiValue): InsightRange {
  return value
}

function toRangeViewModel(dto: InsightsRangeApiDto): InsightRangeViewModel {
  return {
    observations: dto.observations.map((observation) => ({
      id: observation.id,
      title: observation.title,
      description: observation.description,
      icon: observation.icon,
    })),
  }
}

export function selectInsightsPageViewModel(
  api: InsightsApiResponse,
): InsightsPageViewModel {
  return {
    selectedRange: toRange(api.selected_range),
    ranges: api.ranges.map((range) => ({
      id: toRange(range.id),
      label: range.label,
    })),
    views: {
      weekly: toRangeViewModel(api.views.weekly),
      monthly: toRangeViewModel(api.views.monthly),
      yearly: toRangeViewModel(api.views.yearly),
    },
  }
}
