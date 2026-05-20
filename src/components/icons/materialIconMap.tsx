import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded'
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded'
import ContactlessRoundedIcon from '@mui/icons-material/ContactlessRounded'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LocalCafeRoundedIcon from '@mui/icons-material/LocalCafeRounded'
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
  contactless: ContactlessRoundedIcon,
  account_balance: AccountBalanceRoundedIcon,
  autorenew: AutorenewRoundedIcon,
} as const

export function renderMaterialIcon(name: string, props?: SvgIconProps): JSX.Element {
  const IconComponent = iconMap[name as keyof typeof iconMap] ?? RestaurantRoundedIcon
  return <IconComponent {...props} />
}
