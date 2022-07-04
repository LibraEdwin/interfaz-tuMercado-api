// @ts-check
import * as ProvinceDao from './dao'

/**
 * Listar provincias
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function index(req, res) {
  const allProvinces = await ProvinceDao.getAllProvinces()
  return res.respond({ data: allProvinces })
}

/**
 * Obtener una provincia
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function getById (req, res) {
  const { id } = req.params
  const province = await ProvinceDao.getProvince(id)
  return res.respond({ data: province })
}
