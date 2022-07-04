// @ts-check
import { createDocumentType, findAllDocumentType, findDocumentTypeById, removeDocumentType, updateDocumentType } from './dao'
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
  const documentType = await findAllDocumentType(limit, page)
  const data = multiple(documentType)
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
    const documentType = await findDocumentTypeById(id)
    return res.respond({ data: documentType })
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
  const newTipoDocumento = req.body

  try {
    const documentTypeCreated = await createDocumentType(newTipoDocumento)
    return res.respondCreated({ data: documentTypeCreated, message: labels.success.response.created })
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
  const datadocumentType = req.body

  try {
    const documentType = await updateDocumentType(id, datadocumentType)
    return res.respondUpdated({ data: documentType, message: labels.success.response.updated })
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

  const documentTypeDeleted = await removeDocumentType(id)
  if (!documentTypeDeleted) {
    return res.failNotFound({ errors: labels.errors.removeById.errors })
  }
  return res.respondDeleted({ message: labels.errors.removeById.message })
}
