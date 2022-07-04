// @ts-check
import { getOptionsPagination } from 'helpers/utils'
import SubcategoryModel from './model'
import ProductDao from 'components/products/dao'

const correlativeId = async () => {
  const totalDocuments = await SubcategoryModel.countDocuments()
  return totalDocuments + 1
}

const findAllSubcategories = async (limit, page, query) => {
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

  return await SubcategoryModel.paginate(
    SubcategoryModel.find(query)
      .populate('category')
    , options)
}

const findSubcategoryById = async (id) => {
  return await SubcategoryModel.findOne({ _id: id }).populate('category')
}

const registerSubcategory = async (category) => {
  const _id = await correlativeId()
  return await SubcategoryModel.create({
    ...category,
    _id
  })
}

const updateSubcategoryById = async (id, category) => {
  const categoryUpdated = await SubcategoryModel.findOneAndUpdate(
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

const deleteSubcategoryById = async (id) => {
  const result = await SubcategoryModel.deleteById(id)
  await ProductDao.updateSubcategoryDefault(id)
  return result.matchedCount
}

const existSubcategoryById = async (id) => {
  return await SubcategoryModel.exists({ _id: id })
}

const updateToDefaultCategory = async (id) => {
  await SubcategoryModel.updateMany({ category: id }, { category: 1 })
}

export default {
  findAllSubcategories,
  findSubcategoryById,
  registerSubcategory,
  updateSubcategoryById,
  deleteSubcategoryById,
  existSubcategoryById,
  updateToDefaultCategory
}
