// @ts-check
import { createSupplier, findAllSupplier, findSupplierById, findSupplierByName, removeSupplier, updateSupplier } from './dao'
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
  const supplier = await findAllSupplier(limit, page)
  const data = multiple(supplier)
  return res.respond({ data })
}
/**
 * Crear un producto
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function getById(req, res) {
  const { id } = req.params
  try {
    const supplier = await findSupplierById(id)

    if (!supplier) {
      return res.failNotFound({ errors: labels.errors.getBy.notFound })
    }
    return res.respond({ data: supplier })
  } catch (error) {
    return res.failServerError({ errors: error.message })
  }
}
/**
 * Crear un producto
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function getByName(req, res) {
  const { search } = req.params
  try {
    const supplier = await findSupplierByName(search)
    if (!supplier) {
      return res.failNotFound({ errors: 'No se encontro el dato' })
    }
    return res.respond({ data: supplier })
  } catch (error) {
    return res.failServerError({ errors: error.message })
  }
}
/**
 * Crear un producto
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function create(req, res) {
  const newSupplier = req.body
  try {
    const supplierCreate = await createSupplier(newSupplier)
    if (supplierCreate === 'CampoNumeroTipoDocumento') {
      return res.failNotFound({ errors: labels.errors.validation.isNumericTipoDocumentoID })
    }
    if (supplierCreate === 'noEncontrado') {
      return res.failNotFound({ errors: labels.errors.validation.notFoundTipoDocumentoID })
    }
    if (supplierCreate === 'noEncontradoDistrictID') {
      return res.failNotFound({ errors: labels.errors.validation.notFoundTipoDistrictID })
    }
    if (supplierCreate === 'camposImcompletos') {
      return res.failNotFound({ errors: labels.errors.validation.missingFieldsContact })
    }
    if (supplierCreate === 'correoIncorrecto') {
      return res.failNotFound({ errors: labels.errors.validation.isEmail })
    }
    if (supplierCreate === 'correoExistente') {
      return res.failNotFound({ errors: labels.errors.validation.isEmailUnique })
    }
    return res.respondCreated({ data: supplierCreate, message: labels.success.response.created })
  } catch (error) {
    return res.failServerError({ errors: error.message })
  }
}
/**
 * Crear un producto
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function updateById(req, res) {
  const { id } = req.params
  const dataSupplier = req.body

  try {
    const supplier = await updateSupplier(id, dataSupplier)
    if (supplier === 'CampoNumeroTipoDocumento') {
      return res.failNotFound({ errors: labels.errors.validation.isNumericTipoDocumentoID })
    }
    if (supplier === 'noEncontrado') {
      return res.failNotFound({ errors: labels.errors.validation.notFoundTipoDocumentoID })
    }
    if (supplier === 'noEncontradoDistrictID') {
      return res.failNotFound({ errors: labels.errors.validation.notFoundTipoDistrictID })
    }
    if (supplier === 'camposImcompletos') {
      return res.failNotFound({ errors: labels.errors.validation.missingFieldsContact })
    }
    if (supplier === 'correoIncorrecto') {
      return res.failNotFound({ errors: labels.errors.validation.isEmail })
    }
    if (supplier === 'idNoCreado') {
      return res.failNotFound({ errors: labels.errors.validation.idNotFoundSuplier })
    }
    if (supplier === 'correoExistente') {
      return res.failNotFound({ errors: labels.errors.validation.isEmailUnique })
    }
    return res.respondUpdated({ data: supplier, message: labels.success.response.updated })
  } catch (error) {
    return res.failServerError({ errors: error.message })
  }
}
/**
 * Crear un producto
 * @param {import('express').Request} req
 * @param {import('../../helpers/types').CustomResponse} res
 */
export async function removeById(req, res) {
  const { id } = req.params

  const supplierDeleted = await removeSupplier(id)
  if (!supplierDeleted) {
    return res.failNotFound({ errors: labels.errors.removeById.errors })
  }

  return res.respondDeleted({ message: labels.errors.removeById.message })
}
