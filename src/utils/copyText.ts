export default function copyText(text: string, onSuccess: () => void, onError: (err: any) => void) {
  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard.writeText(text)
        .then(() => onSuccess())
        .catch((err) => onError(err))
  } else if (document.queryCommandSupported('copy')) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    onSuccess()
  }
}
