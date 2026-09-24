export interface LocalDirectoryHandle {
  readonly kind: 'directory'
  readonly name: string
  queryPermission(options?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>
  requestPermission(options?: { mode?: 'read' | 'readwrite' }): Promise<PermissionState>
  getDirectoryHandle(name: string, options?: { create?: boolean }): Promise<LocalDirectoryHandle>
  getFileHandle(name: string, options?: { create?: boolean }): Promise<LocalFileHandle>
}

export interface LocalFileHandle {
  getFile(): Promise<File>
  createWritable(): Promise<{ write(data: string | ArrayBuffer): Promise<void>; close(): Promise<void> }>
}

type DirectoryPickerWindow = Window & {
  showDirectoryPicker?: () => Promise<LocalDirectoryHandle>
}

export class FileSystemAdapter {
  isSupported(): boolean {
    return window.isSecureContext && typeof (window as DirectoryPickerWindow).showDirectoryPicker === 'function'
  }

  async pickDirectory(): Promise<LocalDirectoryHandle> {
    const picker = (window as DirectoryPickerWindow).showDirectoryPicker
    if (!this.isSupported() || !picker) {
      throw new Error('FILESYSTEM_UNSUPPORTED')
    }
    return picker()
  }

  async requestPermission(handle: LocalDirectoryHandle): Promise<boolean> {
    return (await handle.requestPermission({ mode: 'readwrite' })) === 'granted'
  }

  async verifyPermission(handle: LocalDirectoryHandle): Promise<PermissionState> {
    return handle.queryPermission({ mode: 'readwrite' })
  }

  async ensureStructure(handle: LocalDirectoryHandle): Promise<void> {
    for (const directory of ['account', 'parish', 'system', 'backups']) {
      await handle.getDirectoryHandle(directory, { create: true })
    }
  }

  async writeJson(handle: LocalDirectoryHandle, path: string[], fileName: string, data: unknown): Promise<void> {
    let directory = handle
    for (const segment of path) {
      directory = await directory.getDirectoryHandle(segment, { create: true })
    }
    const file = await directory.getFileHandle(fileName, { create: true })
    const writable = await file.createWritable()
    await writable.write(JSON.stringify(data, null, 2))
    await writable.close()
  }

  async readJson<T>(handle: LocalDirectoryHandle, path: string[], fileName: string): Promise<T> {
    let directory = handle
    for (const segment of path) {
      directory = await directory.getDirectoryHandle(segment)
    }
    const file = await (await directory.getFileHandle(fileName)).getFile()
    return JSON.parse(await file.text()) as T
  }
}
