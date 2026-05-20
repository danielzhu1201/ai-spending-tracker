import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ContactlessRoundedIcon from '@mui/icons-material/ContactlessRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import DirectionsCarRoundedIcon from '@mui/icons-material/DirectionsCarRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LocalCafeRoundedIcon from '@mui/icons-material/LocalCafeRounded'
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded'
import PaymentsRoundedIcon from '@mui/icons-material/PaymentsRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import type { SvgIconProps } from '@mui/material/SvgIcon'
import type { JSX } from 'react'

const iconMap = {
  restaurant: RestaurantRoundedIcon,
  home: HomeRoundedIcon,
  payments: PaymentsRoundedIcon,
  shopping_bag: ShoppingBagRoundedIcon,
  local_cafe: LocalCafeRoundedIcon,
  commute: DirectionsCarRoundedIcon,
  directions_car: DirectionsCarRoundedIcon,
  contactless: ContactlessRoundedIcon,
  credit_card: CreditCardRoundedIcon,
  account_balance: AccountBalanceRoundedIcon,
  autorenew: AutorenewRoundedIcon,
  more_horiz: MoreHorizRoundedIcon,
} as const

export function renderMaterialIcon(name: string, props?: SvgIconProps): JSX.Element {
  const IconComponent = iconMap[name as keyof typeof iconMap] ?? RestaurantRoundedIcon
  return <IconComponent {...props} />
}
