export async function readApiError(response: Response, fallback: string) {
  return response.json().then((body: { error?: string }) => body.error || fallback).catch(() => fallback)
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function responseFilename(response: Response, fallback: string) {
  return response.headers.get('Content-Disposition')?.match(/filename="?([^";]+)"?/i)?.[1] ?? fallback
}
