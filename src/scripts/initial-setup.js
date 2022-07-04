// @ts-check
import config from 'config'
import { connectionMongo, disconnectMongo } from 'backing/databases/mongodb'
import ubigeos from './ubigeos'
import factory from 'factory'

(async () => {
  const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
  const isProduction = ENVIRONMENT === 'production'

  try {
    /**
     * Conectarse con la base de datos
     */
    await connectionMongo()

    /**
     * Cargar Ubigeos
     */
    await ubigeos()

    /**
     * Cargar datos fake solo en el ambiente desarrollo
     */
    if (!isProduction) {
      await factory()
    }
    /**
     * Desconectarse de la base de datos
     */
    await disconnectMongo()
  } catch (error) {
    console.log(error)
  }
})()
