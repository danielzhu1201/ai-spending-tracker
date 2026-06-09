import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded'
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded'
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
    label: 'Scan',
    path: '/scan',
    icon: DocumentScannerRoundedIcon,
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
  {
    label: 'Account',
    path: '/login',
    icon: PersonRoundedIcon,
  },
]

export const desktopTransactionsNavigationItems: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: GridViewRoundedIcon,
  },
  {
    label: 'Receipts',
    path: '/transactions',
    icon: DocumentScannerRoundedIcon,
  },
  {
    label: 'Analytics',
    path: '/insights',
    icon: TrendingUpRoundedIcon,
  },
  {
    label: 'Account',
    path: '/login',
    icon: PersonRoundedIcon,
  },
]
