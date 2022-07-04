// @ts-check
import ZoneModel from './model'

export async function getAllZones () {
  return await ZoneModel.find()
}

/**
 * Obtener una zona
 * @param {string} codigo
 */
export async function getZone (codigo) {
  return await ZoneModel.findOne({ _id: codigo })
}

/**
 * Validar si existe zona por id
 * @param {string} codigo
 *
 * @return {Promise<any>}
 */
export async function zoneExist (codigo) {
  return await ZoneModel.exists({ _id: codigo })
}
