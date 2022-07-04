/**
 * @fileoverview Archivo de Configuración, conección a mongodb
 */
import config from 'config'
import mongoose from 'mongoose'
import chalk from 'chalk'

const { MONGODB_URI } = config.get('DATABASE')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoIndex: true
}

const connection = mongoose.connect(MONGODB_URI, options)

export const connectionMongo = async () => {
  try {
    await connection
    console.info(chalk.yellow('[database]: ') + `MongoDB => Conneccion abierta ${MONGODB_URI}`)
  } catch (err) {
    console.error(`🔥 [database]: ${chalk.red(`Oh!!! ocurrió un error con MongoDB razón: ${err}`)}`)
  }
}

export const disconnectMongo = async () => {
  try {
    await (await connection).disconnect()
    console.info(chalk.yellow('[database]: ') + 'MongoDB => Se cerro la coneccion')
  } catch (err) {
    console.error(`🔥 [database]: ${chalk.red(`Hubo un error al intentar cerrar la coneccion: ${err}`)}`)
  }
}
