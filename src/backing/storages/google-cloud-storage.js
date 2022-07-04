// @ts-check
import config from 'config'
import { Storage } from '@google-cloud/storage'

class Bucket {
  /**
   * @param {string} pathKey
   * @param {string} nameBucket
   */
  constructor(pathKey, nameBucket) {
    this.keyFilename = pathKey
    this.setBucket = nameBucket

    this.storage = new Storage({
      keyFilename: this.keyFilename
    })
  }

  getName() {
    return this.setBucket.toString()
  }

  /**
   *
   * @param {string} nameDirectory
   */
  async createBucket(nameDirectory) {
    await this.storage.createBucket(nameDirectory)
  }

  async getBuckets() {
    return await this.storage.getBuckets()
  }

  async getFiles(folder = '/', viewSubFolders = false) {
    const options = {
      prefix: folder,
      delimiter: !viewSubFolders ? '/' : ''
    }

    const [files] = await this.storage
      .bucket(this.getName())
      .getFiles(folder === '/' ? null : options)

    return files.map((file) => {
      return { nameFile: file.name }
    })
  }

  async deleteFile(/** @type {any} */ pathFile, /** @type {any} */ fileName) {
    try {
      if (pathFile === undefined) { throw new Error('Datos no definidos en función') }

      await this.storage
        .bucket(this.getName())
        .file(`${pathFile}${fileName}`)
        .delete()
      return true
    } catch (e) {
      throw new Error(e.name + ': ' + e.message)
    }
  }

  /**
   * Subir un archivo
   * @param {string} fileName - Nombre final que tendrá el archivo a subir
   * @param {string} filePathUpload - Ubicación del archivo en la carpeta temporal
   * @param {string} pathDestino - Carpeta de desino final
   */
  async uploadFile(/** @type {string} */ fileName, filePathUpload, pathDestino) {
    try {
      await this.storage.bucket(this.getName()).upload(filePathUpload, {
        destination: `${pathDestino}${fileName}`,
        gzip: true
      })

      this.storage
        .bucket(this.getName())
        .file(`${pathDestino}${fileName}`)
        .setMetadata({ cacheControl: 'no-cache' })
    } catch (e) {
      console.log(e)
      throw new Error(e.name + ': ' + e.message)
    }
  }
}

const { PATH_KEY, NAME } = config.get('BUCKET')

export default new Bucket(PATH_KEY, NAME)
