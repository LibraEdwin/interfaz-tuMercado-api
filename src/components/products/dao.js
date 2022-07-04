// @ts-check
import ProductModel from './model'
import 'types/index'

const correlativeId = async () => {
  const totalDocuments = await ProductModel.countDocumentsWithDeleted()
  return totalDocuments + 1
}

/**
 * Obtener una lista de productos
 * @param {number} limit -límite de productos por página
 * @param {number} page - número de página
 *
 * @returns {Promise<void>}
 */
const findAllProducts = async (limit, page, query) => {
  const options = {
    page: page || 1,
    limit: limit || 10,
    sort: { _id: 'desc' }
  }

  const { name, subcategory, unitMeasurement } = query

  let customQuery = {}

  if (name) {
    customQuery = {
      ...customQuery,
      name: {
        $regex: name,
        $options: 'i'
      }
    }
  }

  if (subcategory) {
    customQuery = {
      ...customQuery,
      subcategory
    }
  }

  return await ProductModel.paginate(
    ProductModel.find(customQuery)
      .populate({
        path: 'subcategory',
        populate: [
          { path: 'category' }
        ]
      })
    , options)
}

const findProductById = async (id) => {
  return await ProductModel.findOne({ _id: id })
    .populate({
      path: 'subcategory',
      populate: [
        { path: 'category' }
      ]
    })
}

/**
 * Obtener productos por una categoria
 * @param {number} id
 * @param {number} page
 * @param {number} limit
 * @param  {...any} query
 * @returns
 */
const findProductsByCategory = async (id, page, limit, ...query) => {
  const options = {
    page: page || 1,
    limit: limit || 10,
    sort: { _id: 'desc' }
  }

  const myAggregate = ProductModel.aggregate([
    { $match: { deleted: false } },
    {
      $lookup: {
        from: 'subcategories',
        localField: 'subcategory',
        foreignField: '_id',
        as: 'subcategory'
      }
    },
    { $unwind: '$subcategory' },
    {
      $lookup: {
        from: 'categories',
        localField: 'subcategory.category',
        foreignField: '_id',
        as: 'subcategory.category'
      }
    },
    { $match: { 'subcategory.category._id': id } },
    { $unwind: '$subcategory.category' }
  ])

  return await ProductModel.aggregatePaginate(myAggregate, options)
}

/**
 * Crear un producto
 * @param {Product} product - data dek oroducto
 * @returns {Promise<Product>}
 */
const createProduct = async (product) => {
  const image = `/uploads/tu-mercado/productos/${product._id}/1.jpg`

  const newProduct = await ProductModel.create({
    ...product,
    image
  })

  return await findProductById(newProduct._id)
}

const updateProductById = async (id, product) => {
  const productById = await findProductById(id)

  const productUpdated = await ProductModel.findOneAndUpdate(
    { _id: id },
    {
      ...product,
      purchasePrice: {
        retail: product.purchasePrice?.retail || productById.purchasePrice.retail,
        wholesale: product.purchasePrice?.wholesale || productById.purchasePrice.wholesale
      },
      salePrice: {
        retail: product.salePrice?.retail || productById.salePrice.retail,
        wholesale: product.salePrice?.wholesale || productById.salePrice.wholesale
      }
    },
    {
      new: true,
      runValidators: true
    }
  ).populate({
    path: 'subcategory',
    populate: [
      { path: 'category' }
    ]
  })

  if (!productUpdated) {
    return null
  }

  return productUpdated
}

const removeProductById = async (id) => {
  const result = await ProductModel.deleteById(id)
  return result.matchedCount
}

const updateSubcategoryDefault = async (id) => {
  await ProductModel.updateMany({ subcategory: id }, { subcategory: 1 })
}

export default {
  correlativeId,
  findAllProducts,
  findProductById,
  createProduct,
  updateProductById,
  removeProductById,
  updateSubcategoryDefault,
  findProductsByCategory
}
