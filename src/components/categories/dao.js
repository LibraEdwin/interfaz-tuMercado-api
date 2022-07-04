// @ts-check
import { getOptionsPagination } from 'helpers/utils'
import CategoryModel from './model'
import SubcategoryDao from 'components/subcategories/dao'
import 'types/index'

/**
 * Obtener el id correlativo
 * @returns {Promise<number>}
 */
const correlativeId = async () => {
  const totalDocuments = await CategoryModel.countDocuments()
  return totalDocuments + 1
}

/**
 * Obtener todas las categorias
 * @param {number} limit
 * @param {number} page
 * @param {object} query
 * @returns
 */
const findAllCategories = async (limit, page, query) => {
  const options = getOptionsPagination(limit, page)

  const { name } = query

  if (name) {
    query = {
      ...query,
      name: {
        $regex: name,
        $options: 'i'
      }
    }
  }

  return await CategoryModel.paginate(
    CategoryModel.find(query)
    , options)
}

/**
 * Buscar una categoria por id
 * @param {number} id
 * @returns {Promise<Category|null>}
 */
const findCategoryById = async (id) => {
  return await CategoryModel.findOne({ _id: id })
}

/**
 * Registrar una categoria
 * @param {Category} category - data de la categoria
 * @returns {Promise<Category>}
 */
const registerCategory = async (category) => {
  const _id = await correlativeId()
  return await CategoryModel.create({
    ...category,
    _id
  })
}

/**
 * Actualizar una categoria por id
 * @param {number} id - id de la categoria a actualizar
 * @param {Category} category - data para actualizar
 *
 * @returns {Promise<null|Category>} - si no se encontró la categoria
 */
const updateCategory = async (id, category) => {
  const categoryUpdated = await CategoryModel.findOneAndUpdate(
    { _id: id },
    category,
    {
      new: true,
      runValidation: true
    }
  )

  if (!categoryUpdated) {
    return null
  }

  return categoryUpdated
}

/**
 * Eliminar una categoria por su id
 * @param {number} id - id de la categoria
 * @returns
 */
const deleteCategoryById = async (id) => {
  const result = await CategoryModel.deleteById(id)
  await SubcategoryDao.updateToDefaultCategory(id)
  return result.matchedCount
}

/**
 * Eliminar todas las categorias
 */
const deleteAllDocuments = async () => {
  await CategoryModel.deleteMany()
}

export default {
  findAllCategories,
  findCategoryById,
  registerCategory,
  updateCategory,
  deleteCategoryById,
  correlativeId,
  deleteAllDocuments
}
