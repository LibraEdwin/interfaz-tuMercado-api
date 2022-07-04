// @ts-check
import { createUnitMeasurement, findAllUnitMeasurement, findPUnitMeasurementById, removeUnitMeasurement, updateUnitMeasurement } from './dao'
import { multiple } from './dto'
import labels from './labels'
/**
 * Obtener un producto por su id
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function index(req, res) {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const unitMeasurement = await findAllUnitMeasurement(limit, page)
  const data = multiple(unitMeasurement)
  return res.respond({ data })
}
/**
 * Obtener un producto por su id
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function getById(req, res) {
  const { id } = req.params
  try {
    const unitMeasurement = await findPUnitMeasurementById(id)
    return res.respond({ data: unitMeasurement })
  } catch (error) {
    return res.failServerError({ errors: error.message })
  }
}
/**
 * Obtener un producto por su id
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function create(req, res) {
  const newUnitMeasurement = req.body
  try {
    const unitMeasurementCreated = await createUnitMeasurement(newUnitMeasurement)
    return res.respondCreated({ data: unitMeasurementCreated, message: labels.success.response.created })
  } catch (error) {
    return res.failServerError({ errors: error.message })
  }
}
/**
 * Obtener un producto por su id
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function updateById(req, res) {
  const { id } = req.params
  const dataUnitMeasurement = req.body
  try {
    const unidadMedida = await updateUnitMeasurement(id, dataUnitMeasurement)
    return res.respondUpdated({ data: unidadMedida, message: labels.success.response.updated })
  } catch (error) {
    return res.failServerError({ errors: error.message })
  }
}
/**
 * Obtener un producto por su id
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function removeById(req, res) {
  const { id } = req.params

  const unitMeasurementDeleted = await removeUnitMeasurement(id)
  if (!unitMeasurementDeleted) {
    return res.failNotFound({ errors: labels.errors.removeById.errors })
  }
  return res.respondDeleted({ message: labels.errors.removeById.message })
}
