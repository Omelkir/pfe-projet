// Type Imports
import type { ThemeColor } from '@core/types'
import type { OptionsMenuType } from '@core/components/option-menu/types'
import type { CustomAvatarProps } from '@core/components/mui/Avatar'

export type CardStatsVerticalProps = {
  title: string
  stats: string
  avatarIcon: string
  subtitle: string
  avatarColor?: ThemeColor
  trendNumber: string
  trend?: 'positive' | 'negative'
  avatarSkin?: CustomAvatarProps['skin']
  avatarSize?: number
  moreOptions?: OptionsMenuType
}
export type CardStatsProps = {
  icons: string
  number: string
  title: string
  color: string
  bg: string
}
export type CardStatsProps2 = {
  title: string
  nom: string
  image: string
}
export type CardArrow = {
  title: string
  subTitle: string
}
