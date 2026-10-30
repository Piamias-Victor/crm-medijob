/** Read File as base64 with 0–1 progress (FileReader). */
export function fileToBase64Progress(
  file: File,
  onProgress: (ratio: number) => void,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.min(1, event.loaded / event.total))
      }
    }
    reader.onload = () => {
      onProgress(1)
      const result = reader.result
      if (typeof result !== 'string') return reject(new Error('READ_FAILED'))
      const dataBase64 = result.split(',')[1]
      if (!dataBase64) return reject(new Error('READ_FAILED'))
      resolve(dataBase64)
    }
    reader.onerror = () => reject(new Error('READ_FAILED'))
    reader.readAsDataURL(file)
  })
}
