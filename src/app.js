// @ts-check
/**
 * @fileoverview Configuración de la aplicación express
 * @version     1.0
 * @author      Interfaz
 */

import express from 'express'
import cors from 'cors'
// import helmet from 'helmet'
import logger from 'morgan'
import config from 'config'
import router from 'interface/router'
import customResponse from 'helpers/customResponse'
import { error404, generalErrorHandler } from 'middlewares/errors'
import { getDate } from './helpers/utils'

/**
  * Inicializamos la aplicacion
  */
const app = express()
/**
  * Logger de la aplicacion / sirve para ver en consola las respuestas http/https
  */
const LOGGER_FORMAT = config.get('LOGGER')

logger.token('date', (req, res) => {
  return getDate(new Date(), 'dddd DD, MMMM del YYYY - HH:mm:ss:ss')
})

app
  .use(cors({ origin: '*' }))
  .use(logger(LOGGER_FORMAT))
  .use(express.json({ limit: '1mb' }))
  .use(express.urlencoded({ extended: true }))
  .use(customResponse)

router(app)

/**
  * Error por defecto cuando no encuentra una ruta
  */
app.use(error404)

/**
  * Manejador de error general, esto evita que la app se cuelgue ante un throw Error
  */
app.use(generalErrorHandler)

export default app
