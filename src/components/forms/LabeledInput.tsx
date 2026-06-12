import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'

interface LabeledInputProps extends Omit<TextFieldProps, 'label'> {
  label: string
}

export function LabeledInput({ label, ...props }: LabeledInputProps) {
  return (
    <Stack spacing={1}>
      {label && (
        <Typography
          variant="caption"
          sx={{
            color: 'var(--aura-on-surface-variant)',
            letterSpacing: '0.08em',
          }}
        >
          {label}
        </Typography>
      )}
      <TextField
        size="small"
        {...props}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'var(--aura-surface-container-lowest)',
          },
          ...props.sx,
        }}
      />
    </Stack>
  )
}
