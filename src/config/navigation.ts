import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import type { SvgIconComponent } from '@mui/icons-material'

export interface NavigationItem {
  label: string
  path: string
  icon: SvgIconComponent
}

export const mobileNavigationItems: NavigationItem[] = [
  {
    label: 'Home',
    path: '/dashboard',
    icon: DashboardRoundedIcon,
  },
  {
    label: 'Add Expense',
    path: '/manual-entry',
    icon: AddCircleRoundedIcon,
  },
  {
    label: 'Transactions',
    path: '/transactions',
    icon: ReceiptLongRoundedIcon,
  },
  {
    label: 'Insights',
    path: '/insights',
    icon: AnalyticsRoundedIcon,
  },
]
