import config from 'config'
import app from 'app'
import supertest from 'supertest'
import path from 'path'
import fs from 'fs'
import mongoose from 'mongoose'
import ProductModel from 'components/products/model'
import ProductFactory from 'factory/products'
import labels from 'components/products/labels'
import SubcategoryModel from 'components/subcategories/model'
import CategoryModel from 'components/categories/model'
import UnitMeasurementModel from 'components/measurementUnits/model'
import { DIR_UPLOAD_PUBLIC } from 'helpers/uploads'
import ProductDao from 'components/products/dao'

const api = supertest(app)
const ENDPOINT = '/api/v1/products'
const { MONGODB_URI } = config.get('DATABASE')
const DOMAIN_IMAGES = config.get('DOMAIN_IMAGES')

const invalidImageSize = fs.readFileSync(path.join(DIR_UPLOAD_PUBLIC, 'avatars/big.jpg'))
const invalidImageFormat = fs.readFileSync(path.join(DIR_UPLOAD_PUBLIC, 'avatars/item.svg'))
const validImage = fs.readFileSync(path.join(DIR_UPLOAD_PUBLIC, 'avatars/avatar.jpg'))

beforeEach((done) => {
  mongoose.connect(
    MONGODB_URI,
    { useNewUrlParser: true },
    () => done()
  )
})

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  })
})

const productFake = ProductFactory.createProduct(1, 3, 1)
const productListFake = ProductFactory.createProductList(4, 3)

describe('GET /api/v1/products', () => {
  test('Debe devolver un 200', async () => {
    await api.get(ENDPOINT)
      .expect(200)
      .then(response => {
        const { code } = response.body
        expect(code).toBe(200)
      })
  })

  test('Debe devolver un 200 con un un total de 0 documentos', async () => {
    await api.get(ENDPOINT)
      .expect(200)
      .then(response => {
        const { data: { info, products } } = response.body
        expect(info.totalDocs).toBe(0)
        expect(products.length).toBe(0)
      })
  })

  test('Debe devolver un 200 con un un 1 documento en concreto', async () => {
    await ProductModel.create(productFake)

    await api.get(ENDPOINT)
      .expect(200)
      .then(response => {
        const { data: { info, products } } = response.body

        const productResponse = products[0]
        expect(info.totalDocs).toBe(1)
        expect(products.length).toBe(1)
        expect(productResponse.name).toEqual(productFake.name)
        expect(productResponse.description).toEqual(productFake.description)
        expect(productResponse.image).toEqual(DOMAIN_IMAGES + productFake.image)
      })
  })

  test('Debe devolver un limite de 2 documentos en la pagina 2', async () => {
    await ProductModel.create(productFake)

    await api.get(ENDPOINT)
      .expect(200)
      .then(response => {
        const { data: { info, products } } = response.body

        const productResponse = products[0]
        expect(info.totalDocs).toBe(1)
        expect(products.length).toBe(1)
        expect(productResponse.name).toEqual(productFake.name)
        expect(productResponse.description).toEqual(productFake.description)
        expect(productResponse.image).toEqual(DOMAIN_IMAGES + productFake.image)
      })
  })
})

describe('GET /api/v1/products/:id', () => {
  test('Debe devolver un 400 porque se ingreso un id invalido', async () => {
    await api
      .get(ENDPOINT + '/someId')
      .expect(400)
      .then(response => {
        const { description, errors } = response.body
        expect(errors[0]).toBe(labels.errors.response.badId)
        expect(description).toEqual('Bad Request')
      })
  })

  test('Deberia devolver un 404 porque no se encontro el producto', async () => {
    await api
      .get(ENDPOINT + '/2')
      .expect(404)
      .then(response => {
        const { description, errors } = response.body
        expect(errors[0]).toBe(labels.errors.response.notFound)
        expect(description).toEqual('Not Found')
      })
  })

  test('Deberia devolver un 404 porque intento obtener un producto eliminado', async () => {
    const product = await ProductModel.create(productFake)
    await ProductModel.deleteById(product._id)
    await api
      .get(ENDPOINT + '/' + product._id)
      .expect(404)
      .then(response => {
        const { description, errors } = response.body
        expect(errors[0]).toBe(labels.errors.response.notFound)
        expect(description).toEqual('Not Found')
      })
  })

  test('Debe devolver un 200 con el producto', async () => {
    const product = await ProductModel.create(productFake)

    await api
      .get(ENDPOINT + '/' + product._id)
      .expect(200)
      .then(response => {
        const { code, data } = response.body
        expect(code).toBe(200)
        expect(data.name).toBe(product.name)
        expect(data.description).toBe(product.description)
        expect(data.deleted).toBe(false)
        expect(typeof data.purchasePrice.retail).toBe('number')
        expect(typeof data.purchasePrice.wholesale).toBe('number')
        expect(typeof data.salePrice.retail).toBe('number')
        expect(typeof data.salePrice.wholesale).toBe('number')
      })
  })
})

describe('DELETE /api/v1/products/:id', () => {
  test('Debe responder un 200 y eliminar el producto', async () => {
    const product = await ProductModel.create(productFake)

    await api
      .delete(ENDPOINT + '/' + product._id)
      .expect(200)
      .then(response => {
        const { code, message } = response.body
        expect(code).toBe(200)
        expect(message).toBe(labels.success.response.deleted)
      })
  })
})

describe('POST /api/v1/products', () => {
  test('Debe devolver un 400 porque no se enviaron datos', async () => {
    await api
      .post(ENDPOINT)
      .expect(400)
      .then(response => {
        const { code } = response.body
        expect(code).toBe(400)
      })
  })

  test('Debe devolver un 400 porque la imagen es de formato invalido', async () => {
    await api
      .post(ENDPOINT)
      .attach('image', invalidImageFormat, 'item.svg')
      .expect(400)
      .then(response => {
        const { errors } = response.body

        expect(errors.includes('No es un formato de imagen válida, formatos: (JPG, JPEG, PNG)')).toBe(true)
      })
  })

  test('Debe devolver un 400 porque la imagen tiene un tamaño que excede de 2mb', async () => {
    await api
      .post(ENDPOINT)
      .attach('image', invalidImageSize, 'big.jpg')
      .expect(400)
      .then(response => {
        const { errors } = response.body

        expect(errors.includes(labels.errors.validation.image.limitFileSize)).toBe(true)
      })
  })

  test('Debe devolver un 400 y los mensajes de los datos requeridos', async () => {
    await api
      .post(ENDPOINT)
      .expect(400)
      .then(response => {
        const { code, errors } = response.body
        expect(code).toBe(400)
        expect(errors.length > 0).toBe(true)
        expect(errors.includes(labels.errors.validation.name.required)).toEqual(true)
        expect(errors.includes(labels.errors.validation.image.required)).toEqual(true)
        expect(errors.includes(labels.errors.validation.unitMeasurement.required)).toEqual(true)
        expect(errors.includes(labels.errors.validation.purchasePrice.retail.required)).toEqual(true)
        expect(errors.includes(labels.errors.validation.purchasePrice.wholesale.required)).toEqual(true)
        expect(errors.includes(labels.errors.validation.salePrice.retail.required)).toEqual(true)
        expect(errors.includes(labels.errors.validation.salePrice.wholesale.required)).toEqual(true)
      })
  })

  test('Debe devolver 400 porque no la unidad de medida y la subcategoria son incorrectas', async () => {
    await UnitMeasurementModel.create({ _id: 1, name: 'Kilogramo' })
    await CategoryModel.create({ _id: 1, name: 'Sin categoria' })
    await SubcategoryModel.create({ _id: 1, name: 'Sin subcategoria' })

    await api.post(ENDPOINT)
      .attach('image', validImage, 'avatar.jpg')
      .field('unitMeasurement', 2)
      .field('subcategory', 2)
      .expect(400)
      .then(response => {
        const { code, errors } = response.body
        expect(code).toBe(400)

        expect(errors.includes(labels.errors.validation.unitMeasurement.notFound)).toEqual(true)
        expect(errors.includes(labels.errors.validation.subcategory.notFound)).toEqual(true)
      })
  })

  test('Debe devolver 400 porque los precios de compra y venta mayorista es incorrecto', async () => {
    await UnitMeasurementModel.create({ _id: 1, name: 'Kilogramo' })
    await CategoryModel.create({ _id: 1, name: 'Sin categoria' })
    await SubcategoryModel.create({ _id: 1, name: 'Sin subcategoria' })

    await api.post(ENDPOINT)
      .attach('image', validImage, 'avatar.jpg')
      .field('purchasePrice[retail]', 12.15)
      .field('purchasePrice[wholesale]', 12.10)
      .field('salePrice[retail]', 18.90)
      .field('salePrice[wholesale]', 18.89)
      .expect(400)
      .then(response => {
        const { code, errors } = response.body
        expect(code).toBe(400)

        expect(errors.includes(labels.errors.validation.purchasePrice.wholesale.notValid)).toEqual(true)
        expect(errors.includes(labels.errors.validation.salePrice.wholesale.notValid)).toEqual(true)
      })
  })

  test('Debe devolver 200 con el producto creado', async () => {
    const unitMeasurement = await UnitMeasurementModel.create({ _id: 1, name: 'Kilogramo' })
    const category = await CategoryModel.create({ _id: 1, name: 'Sin categoria' })
    const subcategory = await SubcategoryModel.create({ _id: 1, name: 'Sin subcategoria', category: category._id })

    await api.post(ENDPOINT)
      .attach('image', validImage, 'avatar.jpg')
      .field('name', 'Nombre del Producto')
      .field('description', 'Descripcion del producto')
      .field('unitMeasurement', 1)
      .field('unitKG', 25)
      .field('purchasePrice[retail]', 12.15)
      .field('purchasePrice[wholesale]', 24.10)
      .field('salePrice[retail]', 18.90)
      .field('salePrice[wholesale]', 36.50)
      .expect(201)
      .then(async response => {
        const { code, data } = response.body
        expect(code).toBe(201)

        const findProductCreated = await ProductDao.findProductById(data.id)
        expect(findProductCreated.name).toBe(data.name)
        expect(findProductCreated.unitMeasurement).toBe(unitMeasurement._id)
        expect(data.image).toBe(DOMAIN_IMAGES + findProductCreated.image)
        expect(data.subcategory.id).toBe(subcategory._id)
        expect(data.subcategory.category.id).toBe(category._id)
      })
  })
})

describe('PATCH /api/v1/:id', () => {
  test('Debe devolver un 400 poque el id es invalid', async () => {
    await api.patch(ENDPOINT + '/1nvalid')
      .expect(400)
      .then(response => {
        const { code, errors } = response.body

        expect(code).toBe(400)
        expect(errors.includes(labels.errors.response.badId)).toEqual(true)
      })
  })

  test('Debe devolver un 404 poque no se encontro el producto a editar', async () => {
    await api.patch(ENDPOINT + '/2000')
      .expect(404)
      .then(response => {
        const { code, errors } = response.body

        expect(code).toBe(404)
        expect(errors.includes(labels.errors.response.notFound)).toEqual(true)
      })
  })

  test('Debe devolver un 400 porque el precio mayorista es menor al precio minorista', async () => {
    const product = await ProductModel.create(productFake)

    await api.patch(ENDPOINT + '/' + product._id)
      .expect(400)
      .field('purchasePrice[wholesale]', (product.purchasePrice.retail - 0.1))
      .field('salePrice[wholesale]', (product.salePrice.retail - 0.1))
      .then(response => {
        const { code, errors } = response.body

        expect(code).toBe(400)
        expect(errors.includes(labels.errors.validation.purchasePrice.wholesale.notValid)).toEqual(true)
        expect(errors.includes(labels.errors.validation.salePrice.wholesale.notValid)).toEqual(true)
      })
  })

  test('Debe devolver un 400 porque la subcategoria y la unidad de medida son id`s que no estan en la DB', async () => {
    const product = await ProductModel.create(productFake)

    await api.patch(ENDPOINT + '/' + product._id)
      .expect(400)
      .field('subcategory', 2)
      .field('unitMeasurement', 2)
      .then(response => {
        const { code, errors } = response.body

        expect(code).toBe(400)
        expect(errors.includes(labels.errors.validation.subcategory.notFound)).toEqual(true)
        expect(errors.includes(labels.errors.validation.unitMeasurement.notFound)).toEqual(true)
      })
  })

  test('Debe devolver un 200 con el producto actualizado', async () => {
    await UnitMeasurementModel.create({ _id: 1, name: 'Kilogramo' })
    const category = await CategoryModel.create({ _id: 1, name: 'Sin categoria' })
    await SubcategoryModel.create({ _id: 1, name: 'Sin subcategoria', category: category._id })
    const product = await ProductModel.create(productFake)

    const newProduct = {
      name: 'Producto actualizado',
      description: 'Descripcion actualizada',
      unitKG: 15
    }

    await api.patch(ENDPOINT + '/' + product._id)
      .field('name', newProduct.name)
      .field('description', newProduct.description)
      .expect(200)
      .then(response => {
        const { code, data } = response.body

        console.log(data)

        expect(code).toBe(200)
        expect(data.name).toBe(newProduct.name)
        expect(data.description).toBe(newProduct.description)
        expect(data.subcategory.id).toBe(product.subcategory)
        expect(data.unitMeasurement).toBe(product.unitMeasurement)
      })
  })
})

describe('GET /api/v1/products/category/:id', () => {
  test('Deberia devolver una lista de 3 productos con una categoria 2', async () => {
    await CategoryModel.create({
      _id: 1, name: 'Sin categoria'
    })

    await CategoryModel.create({
      _id: 2, name: 'Frutas'
    })

    await SubcategoryModel.create({
      _id: 1, name: 'Sin subcategoria', category: 1
    })

    await SubcategoryModel.create({
      _id: 2, name: 'Citricos', category: 2
    })

    await ProductModel.create(ProductFactory.createProduct(1, 1, 1))
    await ProductModel.create(ProductFactory.createProduct(2, 1, 1))
    await ProductModel.create(ProductFactory.createProduct(3, 1, 2))
    await ProductModel.create(ProductFactory.createProduct(4, 1, 2))
    await ProductModel.create(ProductFactory.createProduct(5, 1, 2))
    const productSix = await ProductModel.create(ProductFactory.createProduct(6, 1, 2))

    await ProductModel.deleteById(productSix._id)

    await api.get(ENDPOINT + '/categoria/' + 2)
      .expect(200)
      .then(response => {
        const { code, data: { info, products } } = response.body
        expect(code).toBe(200)
        expect(info.totalDocs).toBe(3)
        expect(products.length).toBe(3)
      })
  })
})
