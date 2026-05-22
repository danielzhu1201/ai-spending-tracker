export type InsightRangeApiValue = 'weekly' | 'monthly' | 'yearly'

export interface InsightRangeApiDto {
  id: InsightRangeApiValue
  label: string
}

export interface InsightObservationApiDto {
  id: string
  title: string
  description: string
  trend_value: number
  trend_direction: 'up' | 'down' | 'flat'
  trend_period: string
  icon: string
}

export interface InsightsRangeApiDto {
  observations: InsightObservationApiDto[]
}

export interface InsightsApiResponse {
  selected_range: InsightRangeApiValue
  ranges: InsightRangeApiDto[]
  views: Record<InsightRangeApiValue, InsightsRangeApiDto>
}

export const insightsApiResponseMock: InsightsApiResponse = {
  selected_range: 'monthly',
  ranges: [
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ],
  views: {
    weekly: {
      observations: [
        {
          id: 'weekly-dining',
          title: 'Lunch Drift',
          description:
            'Weekday lunch runs are pacing above your usual range. Moving two lunches home would keep the week under target.',
          trend_value: 8.2,
          trend_direction: 'up',
          trend_period: 'vs last week',
          icon: 'restaurant',
        },
        {
          id: 'weekly-transport',
          title: 'Commute Calm',
          description:
            'Transport spend is lower than expected after fewer rideshares. This gives the weekly plan a small buffer.',
          trend_value: 6.4,
          trend_direction: 'down',
          trend_period: 'vs last week',
          icon: 'directions_car',
        },
      ],
    },
    monthly: {
      observations: [
        {
          id: 'monthly-dining',
          title: 'Dining Behavior',
          description:
            'You spent 15% more on dining than last month. Moving three meals to home cooking could save $140 next month.',
          trend_value: 15.4,
          trend_direction: 'up',
          trend_period: 'vs last month',
          icon: 'restaurant',
        },
        {
          id: 'monthly-savings',
          title: 'Savings Pace',
          description:
            'Lower transport and fewer impulse purchases put your savings goal slightly ahead of schedule.',
          trend_value: 12.5,
          trend_direction: 'down',
          trend_period: 'spend reduction',
          icon: 'savings',
        },
      ],
    },
    yearly: {
      observations: [
        {
          id: 'yearly-recurring',
          title: 'Subscription Creep',
          description:
            'Recurring services are growing faster than discretionary categories. A quarterly audit would have the highest long-term payoff.',
          trend_value: 11.8,
          trend_direction: 'up',
          trend_period: 'year to date',
          icon: 'subscriptions',
        },
        {
          id: 'yearly-shopping',
          title: 'Shopping Seasonality',
          description:
            'Shopping spikes are concentrated in March and October. Pre-setting monthly caps would smooth the year.',
          trend_value: 5.6,
          trend_direction: 'flat',
          trend_period: 'annual rhythm',
          icon: 'shopping_bag',
        },
      ],
    },
  },
}
