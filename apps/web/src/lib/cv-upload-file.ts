export function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
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
