export async function readCommentsOrEmpty<T>(read: () => Promise<T[]>): Promise<T[]> {
  try {
    return await read()
  } catch {
    return []
  }
}
