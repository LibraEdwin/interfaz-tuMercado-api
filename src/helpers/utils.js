// @ts-check
/**
 * @fileoverview Utilidades generales
 * @version     1.0
 * @author      Interfaz
 *
 */
import config from 'config'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/es-mx'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale('es-mx')

const VERSION = config.get('VERSION')
const DOMAIN = config.get('DOMAIN')
const TZ = config.get('TZ')

/**
 * Función para retornar la upi completa de la api
 * @returns {string}
 */
export function getBaseUriApi(resourceName) {
  if (resourceName) {
    return `${DOMAIN}/api/${VERSION}/${resourceName}`
  }

  return `${DOMAIN}/api/${VERSION}`
}

/**
 * Función para generar nombres de url
 * @param {any} id - id
 * @param {string} text - texto a parsear
 *
 * @returns {string}
 */
export function generateUrlName(id, text) {
  let str = text.toLowerCase()
  str = str.replace(/[-[\]{}()´`*+?.,\\^$|#\s]/g, ' ').trim()

  const characters = 'àáãäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const replace = 'aaaaaeeeeiiiioooouuuunc------'

  for (let i = 0; i < characters.length; i++) {
    str = str.replace(new RegExp(characters.charAt(i), 'g'), replace.charAt(i))
  }

  str = str.replace(/[^a-zA-Z0-9]/g, '-')
  str = str.replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  return `${id}-${str}`
}

/**
 * Función para convertir la fecha estandar a una fecha de zona horaria distinta
 * @param {Date} standardDate
 * @param {string} format
 * @returns
 */
export function getDate(standardDate = undefined, format = null) {
  return dayjs(standardDate).tz(TZ).format(format)
}

/**
 * Agregar query a una uri
 * @param {string} uri - url del endpoint
 * @param {object} query - queries
 *
 * @example
 * uriWithQuery('http://localhost:3000/api/v1/resourse', {
 * limit: 10, page: 2, name: 'example'
 * }) // result 'http://localhost:3000/api/v1/resourse?limit=10&page=2&name=example'
 *
 * @returns {string}
 */
export function uriWithQuery(uri, query) {
  let str = ''
  for (const property in query) {
    if (query[property] !== '' && query[property] !== undefined) {
      if (str === '') {
        str += '?'
      } else {
        str += '&'
      }

      let value = query[property]

      if (typeof value === 'string') {
        value = query[property].replace(/ /g, '%20')
      }

      str += `${property}=${value}`
    }
  }

  return uri + str
}

export function getOptionsPagination(limit, page) {
  let options = {
    sort: { _id: 'desc' }
  }

  if (limit === 0) {
    options = {
      ...options,
      pagination: false
    }
  } else {
    options = {
      ...options,
      page: page || 1,
      limit: limit || 10
    }
  }

  return options
}
