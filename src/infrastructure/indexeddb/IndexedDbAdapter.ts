const DATABASE_NAME = 'parish-system'
const STORE_NAME = 'metadata'

export class IndexedDbAdapter {
  private open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DATABASE_NAME, 1)
      request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async get<T>(key: string): Promise<T | undefined> {
    const database = await this.open()
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key)
      request.onsuccess = () => resolve(request.result as T | undefined)
      request.onerror = () => reject(request.error)
    })
  }

  async set<T>(key: string, value: T): Promise<void> {
    const database = await this.open()
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(value, key)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async remove(key: string): Promise<void> {
    const database = await this.open()
    return new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(key)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}
