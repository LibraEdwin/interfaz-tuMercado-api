// @ts-check
import * as DistrictDao from './dao'

/**
 * Listar distritos
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function index(req, res) {
  const allDistritcts = await DistrictDao.getAllDistricts()
  return res.respond({ data: allDistritcts })
}

/**
 * Obtener un distrito
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function getById (req, res) {
  const { id } = req.params
  const district = await DistrictDao.getDistrict(id)
  return res.respond({ data: district })
}
