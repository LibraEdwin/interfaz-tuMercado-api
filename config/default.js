const path = require('path')
require('dotenv').config({ path: '.env.dev.local' })

const VERSION = 'v1'

const SERVER = {
  HOST: 'localhost',
  PORT: 3000,
  HTTPS: false
}

const DOMAIN = 'http://localhost:3000'

const TZ = 'America/Lima'

const DATABASE = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://dbDev:235411@serverlessinstance0.xjgs0.mongodb.net/tu_mercado_dev?retryWrites=true&w=majority',
  MYSQL_URI: ''
}

const LOGGER = 'dev'

const JSWT = {
  SESSION_SECRET: 'secret',
  SESSION_EXPIRE_IN: '2m'
}

const BUCKET = {
  NAME: 'container-csi-public',
  PATH_KEY: path.join(__dirname, '../keysGoogleStorage.json')
}

const DOMAIN_IMAGES = 'https://storage.googleapis.com/container-csi-public'

module.exports = {
  SERVER,
  DOMAIN,
  TZ,
  DATABASE,
  LOGGER,
  JSWT,
  VERSION,
  BUCKET,
  DOMAIN_IMAGES
}
