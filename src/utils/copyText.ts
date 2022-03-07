export default function copyText(text: string, onSuccess: () => void) {
  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard.writeText(text)
        .then(() => onSuccess())
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log(err)
        })
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
