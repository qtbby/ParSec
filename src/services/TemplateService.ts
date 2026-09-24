import type { Template } from '../domain/models/Template'
import type { SetupMetadata } from '../repositories/LocalMetadataRepository'
import { DirectoryHandleService } from './DirectoryHandleService'

export class TemplateService {
  constructor(private readonly directories = new DirectoryHandleService()) {}

  async load(): Promise<Template[]> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    return this.directories.readCollection<Template>(handle, ['templates'], 'templates.json')
  }

  async save(_setup: SetupMetadata, templates: Template[]): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.writeCollection(handle, ['templates'], 'templates.json', templates)
  }

  async upload(file: File, template: Template): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    const fileHandle = await this.directories.getFileHandle(handle, ['templates', template.category], template.fileName)
    const writable = await fileHandle.createWritable()
    await writable.write(await file.arrayBuffer())
    await writable.close()
  }

  async read(template: Template): Promise<Blob> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    const fileHandle = await this.directories.getFileHandle(handle, ['templates', template.category], template.fileName)
    return fileHandle.getFile()
  }

  async remove(template: Template): Promise<void> {
    const handle = await this.directories.getStoredDirectoryHandle()
    if (!handle) throw new Error('DIRECTORY_UNAVAILABLE')
    await this.directories.removeFile(handle, ['templates', template.category], template.fileName)
  }
}
