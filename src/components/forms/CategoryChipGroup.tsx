import Stack from '@mui/material/Stack'

import { renderMaterialIcon } from '../icons/materialIconMap'
import { FilterChip } from '../ui/FilterChip'
import type { FilterOption } from '../../types/domain'

interface CategoryChipGroupProps {
  options: FilterOption[]
  selectedValue: string
  onChange?: (value: string) => void
}

export function CategoryChipGroup({
  options,
  selectedValue,
  onChange,
}: CategoryChipGroupProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      sx={{
        flexWrap: 'wrap',
      }}
    >
      {options.map((option) => (
        <FilterChip
          key={option.id}
          label={option.label}
          selected={option.value === selectedValue}
          icon={option.icon ? renderMaterialIcon(option.icon, { fontSize: 'small' }) : undefined}
          onClick={() => onChange?.(option.value)}
        />
      ))}
    </Stack>
  )
}
