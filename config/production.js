const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

if (!fs.existsSync('.env')) {
  throw new Error(chalk.bgRed('🔥🔥 => No existe el archivo .env cree una copia del archivo .env.example y coloque los valores de producción'))
}

/**
 * dotenv.config({ path: '.env.example' })
 */

require('dotenv').config()

const SERVER = {
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  HTTPS: false, // CAMBIAR A TRUE CUANDO SE TENGAN LAS KEYS
  DOMAIN_NAME_CERT: null
}

const DOMAIN = process.env.DOMAIN

const TZ = process.env.TZ

const DATABASE = {
  MONGODB_URI: process.env.MONGODB_URI,
  MYSQL_URI: null
}

const JSWT = {
  SESSION_SECRET: process.env.JSWT_SESSION_SECRET,
  SESSION_EXPIRE_IN: process.env.SESSION_EXPIRE_IN
}

const LOGGER = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'

const BUCKET = {
  NAME: process.env.BUCKET_NAME,
  PATH_KEY: path.join(__dirname, `../${process.env.BUCKET_PATH_KEY}`)
}

const DOMAIN_IMAGES = process.env.DOMAIN_IMAGES

module.exports = {
  SERVER,
  DOMAIN,
  TZ,
  DATABASE,
  LOGGER,
  JSWT,
  BUCKET,
  DOMAIN_IMAGES
}
