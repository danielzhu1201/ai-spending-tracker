import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'

interface EmptyStateShimmerProps {
  rows?: number
}

export function EmptyStateShimmer({ rows = 3 }: EmptyStateShimmerProps) {
  return (
    <Stack spacing={1.5}>
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton
          key={index}
          variant="rounded"
          width="100%"
          height={index === rows - 1 ? 26 : 18}
          sx={{
            bgcolor: 'var(--aura-surface-container-high)',
          }}
        />
      ))}
    </Stack>
  )
}
