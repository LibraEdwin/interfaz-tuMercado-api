// @ts-check
import * as ZonesDao from './dao'

/**
 * Obtener lista de zonas
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function index(req, res) {
  const allZones = await ZonesDao.getAllZones()
  return res.respond({ data: allZones })
}

/**
 * Obtener una zona
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function getById (req, res) {
  const { id } = req.params
  const zone = await ZonesDao.getZone(id)
  return res.respond({ data: zone })
}
