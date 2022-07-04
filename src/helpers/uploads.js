// @ts-check
/**
 * @fileoverview upload.js, helpers para la carga de archivos
 * @version     1.0
 * @author      Interfaz
 *
 */

import os from 'os'
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import config from 'config'

const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
export const DIR_API = path.dirname(__dirname)
export const DIR_UPLOAD_PUBLIC = path.join(__dirname, '../../public/uploads')
export const DIR_UPLOAD_TEMP = ENVIRONMENT !== 'production' ? path.join(DIR_API, '../tmp') : os.tmpdir()
export const fsPromises = fs.promises

export function fileStoreEngine() {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, DIR_UPLOAD_TEMP)
    },
    filename: async (req, file, cb) => {
      /**
        * El nombre del archivo está formado por el valor de la fecha actual con el id random
        */
      const nameFile = `${Date.now()}_${path.extname(file.originalname)}`

      cb(null, nameFile)
    }
  })
}

export const uploadTempImage = multer({
  storage: fileStoreEngine(),
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter: (req, file, cb) => {
    /**
      * @constant
      * @type {RegExp}
      */
    const regex = /jpg|jpeg|png/

    /**
      * Validamos si el archivo subido cumple con el regex de imágenes
      */
    if (isSupportedFile(regex, file)) {
      cb(null, true)
    } else {
      /**
        * Si no es creamos una error con el mensaje
        */
      cb(new Error('No es un formato de imagen válida, formatos: (JPG, JPEG, PNG)'))
    }
  }
})

/**
  * Función para validar la si un archivo es compatible de acuerdo al regex que se mande
  * @param {RegExp} regex
  * @param {*} file
  * @returns {Boolean}
  */
export function isSupportedFile(regex, file) {
  const { mimetype } = file

  return regex.test(mimetype)
}

/**
  * Función remover el archivo de la carpeta temporal
  *
  * @param {string} fileName
  *
  * @returns {Promise<void>}
  */
export async function deleteFileTemp(fileName) {
  const filePath = path.join(DIR_UPLOAD_TEMP, fileName)

  await fsPromises.unlink(filePath)
}

/**
  * Función para copiar los archivos de la carpeta temporal a una carpeta en específico
  *
  * @param {string} fileName - Nombre del archivo que se quiere copiar de la carpeta temp
  * @param {string} dirName - Nombre del directorio al que se quiere copiar
  * @param {number} id - Id de la carpeta a la que se copiará
  *
  * @returns {Promise<void>}
  */
export async function copyFile(fileName, dirName, id = null) {
  /**
    * @constant - Ruta del archivo en la carpeta temporal
    * @type {string}
    */
  const fileTemp = path.join(DIR_UPLOAD_TEMP, fileName)
  /**
    * @let - Ruta del directorio de destino a donde copiaremos el archivo
    * @type {string}
    */
  let dirDest = path.join(DIR_UPLOAD_PUBLIC, dirName)

  if (id) {
    /**
      * Si existe el id, se agrega a la ruta directorio destino el id
      */
    dirDest = path.join(dirDest, id.toString())
    /**
      * Se crea una carpeta con el nombre del id
      */
    await fsPromises.mkdir(dirDest, { recursive: true })
  }

  /**
    * Ruta del destino con todo y el nombre del archivo
    * @constant
    * @type {string}
    */
  const fileDest = path.join(dirDest, fileName)

  /**
    * Cogemos la ruta de origen y de destino para copiar
    */
  await fsPromises.copyFile(fileTemp, fileDest)

  /**
    * Eliminamos el archivo copiado de la carpeta temporal
    */
  await deleteFileTemp(fileName)
}
