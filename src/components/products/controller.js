// @ts-check
import ProductDao from './dao'
import labels from './labels'
import ProductDto from './dto'
import Bucket from 'backing/storages/google-cloud-storage'
import { deleteFileTemp, DIR_UPLOAD_TEMP } from 'helpers/uploads'
import path from 'path'

/**
 * Obtener una lista de productos
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const index = async (req, res) => {
  const { limit, page, ...query } = req.query

  const results = await ProductDao.findAllProducts(Number(limit), Number(page), { ...query })

  const data = ProductDto.multiple(results, query)

  return res.respond({ data })
}

/**
 * Obtener un producto por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const getById = async (req, res) => {
  const id = req.params.id

  const product = await ProductDao.findProductById(id)

  if (!product) {
    return res.failNotFound({ errors: [labels.errors.response.notFound] })
  }

  const data = ProductDto.single(product)

  return res.respond({ data })
}

/**
 * Crear un producto
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const create = async (req, res) => {
  try {
    const product = req.body

    const fileImage = req.file

    const id = await ProductDao.correlativeId()

    const imageDirectory = `uploads/tu-mercado/productos/${id}/`

    const fileTemp = path.join(DIR_UPLOAD_TEMP, fileImage.filename)

    await Bucket.uploadFile('1.jpg', fileTemp, imageDirectory)

    /**
     * Si la carga fue exitosa entonces eliminamos el archivo subido de la carpeta 'temp'
     */
    await deleteFileTemp(fileImage.filename)

    const productCreated = await ProductDao.createProduct({
      ...product,
      _id: id,
      image: `/${imageDirectory}`
    })

    return res.respondCreated({
      message: labels.success.response.created,
      data: ProductDto.single(productCreated)
    })
  } catch (error) {
    return res.failServerError({ errors: [error.message] })
  }
}

/**
 * Actualizar un producto por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const updateById = async (req, res) => {
  try {
    const id = req.params.id
    const product = req.body
    const image = req.file

    const productUpdated = await ProductDao.updateProductById(id, product)

    if (image) {
      // subir la imagen a google storage
      const fileTemp = path.join(DIR_UPLOAD_TEMP, image.filename)
      const destinationFolder = `uploads/tu-mercado/productos/${id}/`

      await Bucket.uploadFile('1.jpg', fileTemp, destinationFolder)

      /**
       * Si la carga fue exitosa entonces eliminamos el archivo subido de la carpeta 'temp'
       */
      await deleteFileTemp(image.filename)
    }
    return res.respondUpdated({ data: ProductDto.single(productUpdated) })
  } catch (error) {
    return res.failServerError({ errors: [error.message] })
  }
}

/**
 * Remover un producto por su id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
const removeById = async (req, res) => {
  const id = req.params.id

  const isDeleted = await ProductDao.removeProductById(id)

  if (!isDeleted) {
    return res.failNotFound({ errors: [labels.errors.response.notFound] })
  }

  return res.respondDeleted({ message: labels.success.response.deleted })
}

const getByCategoryId = async (req, res) => {
  const { limit, page, ...query } = req.query

  const id = Number(req.params.id)

  const products = await ProductDao.findProductsByCategory(id, page, limit, { ...query })

  return res.respond({ data: ProductDto.multiple(products, query, `/categoria/${id}`) })
}

export default {
  index,
  getById,
  create,
  updateById,
  removeById,
  getByCategoryId
}
