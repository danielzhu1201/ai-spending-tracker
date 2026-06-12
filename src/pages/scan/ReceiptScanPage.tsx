import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded'
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded'
import PhotoCameraRoundedIcon from '@mui/icons-material/PhotoCameraRounded'
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageContainer } from '../../components/layout/PageContainer'
import { authenticatedFetch } from '../../lib/authenticatedFetch'
import type { TransactionInfo } from '../../types/domain'

type ReceiptUploadState = 'empty' | 'ready' | 'uploading' | 'uploaded' | 'invalid'

const receiptUploadEndpoint = 'http://127.0.0.1:8000/receipts/upload'

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function ReceiptScanPage() {
  const navigate = useNavigate()
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadState, setUploadState] = useState<ReceiptUploadState>('empty')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const selectReceipt = (file: File | undefined) => {
    if (!file) {
      return
    }

    if (!file.type.startsWith('image/')) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }

      setReceiptFile(null)
      setPreviewUrl(null)
      setUploadState('invalid')
      setErrorMessage('Select an image file to upload a receipt.')
      return
    }

    const nextPreviewUrl = URL.createObjectURL(file)

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setReceiptFile(file)
    setPreviewUrl(nextPreviewUrl)
    setUploadState('ready')
    setErrorMessage(null)
  }

  const removeReceipt = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    setReceiptFile(null)
    setPreviewUrl(null)
    setUploadState('empty')
    setErrorMessage(null)
  }

  const uploadReceipt = async () => {
    if (!receiptFile || uploadState === 'uploading') {
      return
    }

    setUploadState('uploading')
    setErrorMessage(null)

    const formData = new FormData()
    formData.append('receipt', receiptFile)

    try {
      const response = await authenticatedFetch(receiptUploadEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let message = 'Unable to upload receipt.'

        try {
          const errorBody = (await response.json()) as { detail?: string }
          message = errorBody.detail ?? message
        } catch {
          message = response.statusText || message
        }

        throw new Error(message)
      }

      const transaction = (await response.json()) as TransactionInfo
      setUploadState('uploaded')
      navigate('/manual-entry', { state: { receiptTransaction: transaction } })
    } catch (error) {
      setUploadState('ready')
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to upload receipt.',
      )
    }
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectReceipt(event.target.files?.[0])
    event.target.value = ''
  }

  const hasReceipt = Boolean(receiptFile)
  const isUploading = uploadState === 'uploading'
  const statusCopy = {
    empty: 'No receipt selected',
    ready: 'Ready for upload',
    uploading: 'Uploading',
    uploaded: 'Uploaded',
    invalid: 'Invalid file',
  }[uploadState]

  return (
    <PageContainer>
      <Stack spacing={3}>
        <Stack spacing={0.75}>
          <Typography variant="h2" sx={{ color: 'var(--aura-on-surface)' }}>
            Scan Receipt
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
            Capture or select a receipt image, then review extracted details before saving.
          </Typography>
        </Stack>

        <Paper
          variant="outlined"
          sx={{
            p: 3,
            borderRadius: '16px',
            borderColor: 'var(--aura-outline-variant)',
            bgcolor: 'var(--aura-surface-container-lowest)',
          }}
        >
          <Stack spacing={2.5}>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', minWidth: 0 }}>
                <Box
                  sx={{
                    display: 'grid',
                    placeItems: 'center',
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    bgcolor:
                      uploadState === 'invalid'
                        ? 'var(--aura-error-container)'
                        : 'var(--aura-secondary-container)',
                    color:
                      uploadState === 'invalid'
                        ? 'var(--aura-on-error-container)'
                        : 'var(--aura-on-secondary-container)',
                    flex: '0 0 auto',
                  }}
                >
                  {uploadState === 'invalid' ? (
                    <ErrorRoundedIcon fontSize="small" />
                  ) : uploadState === 'uploaded' ? (
                    <CheckCircleRoundedIcon fontSize="small" />
                  ) : (
                    <DocumentScannerRoundedIcon fontSize="small" />
                  )}
                </Box>
                <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, color: 'var(--aura-on-surface)' }}>
                    {statusCopy}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color:
                        uploadState === 'invalid'
                          ? 'var(--aura-error)'
                          : 'var(--aura-on-surface-variant)',
                    }}
                  >
                    {errorMessage ?? (hasReceipt ? 'Review the image before uploading.' : 'Use the camera on mobile or choose a file on desktop.')}
                  </Typography>
                </Stack>
              </Stack>

              {isUploading ? (
                <CircularProgress size={26} sx={{ color: 'var(--aura-secondary)' }} />
              ) : null}
            </Stack>

            <Box
              sx={{
                display: 'grid',
                placeItems: 'center',
                minHeight: { xs: 280, sm: 360 },
                borderRadius: '16px',
                border: '1px dashed var(--aura-outline-variant)',
                bgcolor: 'var(--aura-surface-container-low)',
                overflow: 'hidden',
              }}
            >
              {previewUrl ? (
                <Box
                  component="img"
                  src={previewUrl}
                  alt="Selected receipt preview"
                  sx={{
                    width: '100%',
                    height: '100%',
                    maxHeight: { xs: 420, sm: 520 },
                    objectFit: 'contain',
                    bgcolor: 'var(--aura-surface-container-lowest)',
                  }}
                />
              ) : (
                <Stack spacing={1.5} sx={{ alignItems: 'center', px: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'grid',
                      placeItems: 'center',
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      bgcolor: 'var(--aura-surface-container-high)',
                      color: 'var(--aura-on-surface-variant)',
                    }}
                  >
                    <PhotoCameraRoundedIcon />
                  </Box>
                  <Stack spacing={0.5}>
                    <Typography sx={{ fontWeight: 700, color: 'var(--aura-on-surface)' }}>
                      No receipt selected
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                      Take a photo or select an image to preview it here.
                    </Typography>
                  </Stack>
                </Stack>
              )}
            </Box>

            {receiptFile ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  borderRadius: '12px',
                  borderColor: 'var(--aura-outline-variant)',
                  bgcolor: 'var(--aura-surface)',
                }}
              >
                <Stack spacing={0.75}>
                  <Typography
                    variant="caption"
                    sx={{ color: 'var(--aura-on-surface-variant)', letterSpacing: '0.08em' }}
                  >
                    SELECTED FILE
                  </Typography>
                  <Typography
                    sx={{
                      color: 'var(--aura-on-surface)',
                      fontWeight: 700,
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {receiptFile.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'var(--aura-on-surface-variant)' }}>
                    {formatFileSize(receiptFile.size)} • {receiptFile.type || 'Image file'}
                  </Typography>
                </Stack>
              </Paper>
            ) : null}

            <Stack spacing={1.5}>
              <Button
                component="label"
                variant={hasReceipt ? 'outlined' : 'contained'}
                size="large"
                startIcon={hasReceipt ? <ReplayRoundedIcon /> : <PhotoCameraRoundedIcon />}
                disabled={isUploading}
                sx={{
                  minHeight: 52,
                  borderRadius: '12px',
                  flex: 1,
                }}
              >
                {hasReceipt ? 'Retake / Select Again' : 'Take / Select Photo'}
                <Box
                  component="input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  sx={{
                    clip: 'rect(0 0 0 0)',
                    clipPath: 'inset(50%)',
                    height: 1,
                    overflow: 'hidden',
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    whiteSpace: 'nowrap',
                    width: 1,
                  }}
                />
              </Button>

              <Button
                variant="outlined"
                size="large"
                color="error"
                startIcon={<DeleteRoundedIcon />}
                disabled={!hasReceipt || isUploading}
                onClick={removeReceipt}
                sx={{
                  minHeight: 52,
                  borderRadius: '12px',
                  flex: 1,
                }}
              >
                Remove
              </Button>

              <Button
                variant="contained"
                size="large"
                startIcon={<CloudUploadRoundedIcon />}
                disabled={!hasReceipt || isUploading}
                onClick={uploadReceipt}
                sx={{
                  minHeight: 52,
                  borderRadius: '12px',
                  flex: 1,
                }}
              >
                {uploadState === 'uploaded' ? 'Upload Again' : 'Upload'}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </PageContainer>
  )
}
