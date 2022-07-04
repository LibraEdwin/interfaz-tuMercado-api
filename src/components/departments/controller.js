// @ts-check
import * as DepartamentDao from './dao'

/**
 * Listar departamentos
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function index(req, res) {
  const allDepartments = await DepartamentDao.getAllDepartments()
  return res.respond({ data: allDepartments })
}

/**
 * Obtener un departamento
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function getById (req, res) {
  const { id } = req.params
  const departament = await DepartamentDao.getDepartament(id)
  return res.respond({ data: departament })
}
