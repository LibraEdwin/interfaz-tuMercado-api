// @ts-check
/**
 * @fileoverview Archivo principal de arranque del servidor
 * @version     1.0
 * @author      Interfaz
 *
 */
import chalk from 'chalk'
import http from 'http'
import https from 'https'
import { readFileSync } from 'fs'
import config from 'config'
import app from 'app'
import { connectionMongo } from 'backing/databases/mongodb'

const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
const { PORT, HOST, HTTPS, DOMAIN_NAME_CERT } = config.get('SERVER')

console.info(chalk.blueBright('[environment]: ') + ENVIRONMENT)

/**
  * Inicialización del servidor
  */
let server

if (HTTPS) {
  const options = {
    key: readFileSync(`/etc/letsencrypt/live/${DOMAIN_NAME_CERT}/privkey.pem`),
    cert: readFileSync(`/etc/letsencrypt/live/${DOMAIN_NAME_CERT}/cert.pem`),
    ca: readFileSync(`/etc/letsencrypt/live/${DOMAIN_NAME_CERT}/chain.pem`)
  }

  server = https.createServer(options, app).listen(PORT, () => {
    console.info(chalk.magentaBright('[server]: ') + `https://${HOST}:${PORT}`)
  })
} else {
  server = http.createServer(app).listen(PORT, () => {
    console.info(chalk.magentaBright('[server]: ') + `http://${HOST}:${PORT}`)
  })
}

/**
  * Conección con la base de datos MongoDB
  */
connectionMongo()

export default server
