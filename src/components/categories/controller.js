// @ts-check
import CategoryDao from './dao'
import CategoryDto from './dto'
import labels from './labels'
import 'types/index'

/**
 * Obtener una lista de categorías
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const index = async (req, res) => {
  const { limit, page, ...query } = req.query

  const results = await CategoryDao.findAllCategories(Number(limit), Number(page), { ...query })

  const data = CategoryDto.multiple(results, query)

  res.respond({ data })
}

/**
 * Obtener una categoría por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const getById = async (req, res) => {
  const id = Number(req.params.id)

  const result = await CategoryDao.findCategoryById(id)

  if (!result) {
    return res.failNotFound({ errors: labels.errors.response.notFound })
  }

  const data = CategoryDto.single(result)

  return res.respond({ data })
}

/**
 * Crear una categoría
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const create = async (req, res) => {
  const category = req.body

  const categoryCreated = await CategoryDao.registerCategory(category)

  const data = CategoryDto.single(categoryCreated)

  return res.respondCreated({ data, message: labels.success.response.created })
}

/**
 * Actualizar una categoria por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const updateById = async (req, res) => {
  const id = Number(req.params.id)

  const category = req.body

  const categoryUpdated = await CategoryDao.updateCategory(id, category)

  if (!categoryUpdated) {
    return res.failNotFound({ errors: labels.errors.response.notFound })
  }

  const data = CategoryDto.single(categoryUpdated)

  return res.respondUpdated({ data, message: labels.success.response.updated })
}

/**
 * Remover una categoría por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const deleteById = async (req, res) => {
  const id = Number(req.params.id)

  const isDeleted = await CategoryDao.deleteCategoryById(id)

  if (!isDeleted) {
    return res.failNotFound({ errors: labels.errors.response.notFound })
  }
  return res.respondDeleted({ message: labels.success.response.deleted })
}

/**
 * Obtener un id correlativo
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const getCorrelativeId = async (req, res) => {
  return res.respond({ data: { nextId: await CategoryDao.correlativeId() } })
}

export default {
  index,
  getById,
  create,
  updateById,
  deleteById,
  getCorrelativeId
}
