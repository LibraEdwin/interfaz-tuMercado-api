// @ts-check
import SubcategoryDao from './dao'
import SubcategoryDto from './dto'
import labels from './labels'

/**
 * Obtener una lista de subcategorías
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const index = async (req, res) => {
  const { limit, page, ...query } = req.query

  const results = await SubcategoryDao.findAllSubcategories(Number(limit), Number(page), { ...query })

  const data = SubcategoryDto.multiple(results, query)

  res.respond({ data })
}

/**
 * Obtener una subcategoría por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const getById = async (req, res) => {
  const id = req.params.id

  const result = await SubcategoryDao.findSubcategoryById(id)

  if (!result) {
    return res.failNotFound({ errors: labels.errors.response.notFound })
  }

  const data = SubcategoryDto.single(result)

  return res.respond({ data })
}

/**
 * Crear una subcategoría
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const create = async (req, res) => {
  const category = req.body

  const subcategoryCreated = await SubcategoryDao.registerSubcategory(category)

  const data = SubcategoryDto.single(subcategoryCreated)

  return res.respondCreated({ data, message: labels.success.response.created })
}

/**
 * Actualizar una subcategoria por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const updateById = async (req, res) => {
  const id = req.params.id

  const subcategory = req.body

  const subcategoryUpdated = await SubcategoryDao.updateSubcategoryById(id, subcategory)

  if (!subcategoryUpdated) {
    return res.failNotFound({ errors: labels.errors.response.notFound })
  }

  const data = SubcategoryDto.single(subcategoryUpdated)

  return res.respondUpdated({ data, message: labels.success.response.updated })
}

/**
 * Remover una subcategoría por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const deleteById = async (req, res) => {
  const id = req.params.id

  const isDeleted = await SubcategoryDao.deleteSubcategoryById(id)

  if (!isDeleted) {
    return res.failNotFound({ errors: labels.errors.response.notFound })
  }
  return res.respondDeleted({ message: labels.success.response.deleted })
}

export default {
  index,
  getById,
  create,
  updateById,
  deleteById
}
