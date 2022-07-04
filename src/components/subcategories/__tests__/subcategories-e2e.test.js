import config from 'config'
import app from 'app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import SubcategoryModel from 'components/subcategories/model'
import labels from 'components/subcategories/labels'
import CategoryModel from 'components/categories/model'
import ProductModel from 'components/products/model'
import ProductFactory from 'factory/products'

const api = supertest(app)
const ENDPOINT = '/api/v1/subcategories'
const { MONGODB_URI } = config.get('DATABASE')

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

/**
 * LISTAR TODAS LAS SUBCATEGORIAS
 */
describe('GET /api/v1/subcategories', () => {
  test('Debe devolver un 200 y una sola subcategoria en lista', async () => {
    const subcategory = await SubcategoryModel.create({
      _id: 1,
      name: 'Categoria 1'
    })

    await api
      .get(ENDPOINT)
      .expect(200)
      .then(response => {
        const { code, data: { subcategories } } = response.body
        // revisar la respuesta
        expect(subcategories.length).toEqual(1) //
        expect(code).toEqual(200)
        expect(subcategories[0].id).toBe(subcategory._id)
        expect(subcategories[0].name).toBe(subcategory.name)
      })
  })

  test('Debe responder un 200 con un total de 3 documentos(subcategorias)', async () => {
    await SubcategoryModel.create({
      _id: 1,
      name: 'Subcategoria 1'
    })

    await SubcategoryModel.create({
      _id: 2,
      name: 'Subcategoria 2'
    })

    const subcategory3 = await SubcategoryModel.create({
      _id: 3,
      name: 'Subcategoria 3'
    })

    await SubcategoryModel.deleteById(subcategory3._id)

    await SubcategoryModel.create({
      _id: 4,
      name: 'Subcategoria 4'
    })

    await api
      .get(ENDPOINT)
      .expect(200)
      .then(response => {
        const { data: { info, subcategories } } = response.body
        expect(info.totalDocs).toBe(3)
        expect(subcategories.length).toBe(3)
      })
  })

  test('Debe responder un 200 con un documento(subcategoria) en la pagina 2', async () => {
    await SubcategoryModel.create({
      _id: 1,
      name: 'Categoria 1'
    })

    await SubcategoryModel.create({
      _id: 2,
      name: 'Categoria 2'
    })

    const category3 = await SubcategoryModel.create({
      _id: 3,
      name: 'Categoria 3'
    })

    await SubcategoryModel.deleteById(category3._id)

    await SubcategoryModel.create({
      _id: 4,
      name: 'Categoria 4'
    })

    await api
      .get(ENDPOINT)
      .query({ page: 2, limit: 2 })
      .expect(200)
      .then(response => {
        const { data: { info, subcategories } } = response.body
        expect(info.totalDocs).toBe(3)
        expect(info.page).toBe(2)
        expect(info.limit).toBe(2)
        expect(info.totalPages).toBe(2)
        expect(subcategories.length).toBe(1)
      })
  })
})

/**
 * BUSCAR UNA CATEGORIA POR SU NOMBRE
 */
describe('GET /api/v1/subcategories?name={value}', () => {
  test('Deberia devolver un 200 con un total de 3 coincidencias', async () => {
    await SubcategoryModel.create({
      _id: 1,
      name: 'Carne de res'
    })

    await SubcategoryModel.create({
      _id: 2,
      name: 'Carne de pollo'
    })

    await SubcategoryModel.create({
      _id: 3,
      name: 'Carne de chancho'
    })

    await api.get(ENDPOINT)
      .query({ name: 'carne' })
      .expect(200)
      .then(response => {
        const { code, data: { info } } = response.body
        expect(code).toBe(200)
        expect(info.totalDocs).toBe(3)
      })
  })
})

/**
 * BUSCAR UNA CATEGORIA POR CATEGORÍA
 */
describe('GET /api/v1/subcategories?category={value}', () => {
  test('Deberia devolver un 200 con un total de 2 coincidencias', async () => {
    await CategoryModel.create({
      _id: 2,
      name: 'Categoría padre 2'
    })

    await CategoryModel.create({
      _id: 3,
      name: 'Categoría padre 3'
    })

    await SubcategoryModel.create({
      _id: 1,
      name: 'Carne de res',
      category: 3
    })

    await SubcategoryModel.create({
      _id: 2,
      name: 'Carne de pollo',
      category: 3
    })

    await SubcategoryModel.create({
      _id: 3,
      name: 'Carne de chancho',
      category: 2
    })

    await api.get(ENDPOINT)
      .query({ category: 3 })
      .expect(200)
      .then(response => {
        const { code, data: { info } } = response.body
        expect(code).toBe(200)
        expect(info.totalDocs).toBe(2)
      })
  })
})

/**
 * BUSCAR UNA CATEGORIA POR SU ID
 */
describe('GET /api/v1/subcategories/:id', () => {
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

  test('Deberia devolver un 404 porque no se encontro la subcategoria', async () => {
    await SubcategoryModel.create({
      _id: 1,
      name: 'Subcategoria registrada'
    })

    await api
      .get(ENDPOINT + '/2')
      .expect(404)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toBe(404)
        expect(errors).toBe(labels.errors.response.notFound)
      })
  })

  test('Deberia devolver un 404 porque se intento acceder a una subcategoria eliminada', async () => {
    const category = await SubcategoryModel.create({
      _id: 1,
      name: 'Subcategoria registrada'
    })

    await SubcategoryModel.deleteById(category._id)

    await api
      .get(ENDPOINT + '/' + category._id)
      .expect(404)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toBe(404)
        expect(errors).toBe(labels.errors.response.notFound)
      })
  })

  test('Debe devolver un 200 con la subcategoria correcta', async () => {
    const category = await SubcategoryModel.create({
      _id: 2,
      name: 'Subcategoria de prueba 2'
    })

    await api
      .get(ENDPOINT + '/' + category._id)
      .expect(200)
      .then(response => {
        const { code, data } = response.body
        // revisar la respuesta
        expect(code).toEqual(200)
        expect(data.id).toBe(2)
        expect(data.name).toBe(category.name)
      })
  })
})

/**
 * CREACION DE UNA CATEGORIA
 */
describe('POST /api/v1/subcategories', () => {
  test('Debe devolver un error 400 porque el nombre de la subcategoria esta vacia', async () => {
    const subcategory = {}

    await api
      .post(ENDPOINT)
      .send(subcategory)
      .expect(400)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toEqual(400)
        expect(errors[0]).toEqual(labels.errors.validationData.name.required)
      })
  })

  test('Debe devolver 200 con una subcategoria creada', async () => {
    const subcategory = {
      name: 'Categoria de prueba'
    }

    await api
      .post(ENDPOINT)
      .send(subcategory)
      .expect(201)
      .then(response => {
        const { code, data, message } = response.body
        expect(code).toEqual(201)
        expect(data.id).toBe(1)
        expect(data.name).toBe(subcategory.name)
        expect(data.deleted).toBe(false)
        expect(message).toEqual(labels.success.response.created)
      })
  })
})

/**
 * ACTUALIZACION DE UNA CATEGORIA
 */
describe('PATCH /api/v1/subcategories/:id', () => {
  test('Devuelve un 400 porque se ingreso un id invalido', async () => {
    await api
      .patch(ENDPOINT + '/1someId')
      .expect(400)
      .then(response => {
        const { description, errors } = response.body
        expect(errors[0]).toBe(labels.errors.response.badId)
        expect(description).toEqual('Bad Request')
      })
  })

  test('Devuelve 400 con un mensaje porque el nombre no puede estar vacio', async () => {
    const subcategory = await SubcategoryModel.create({
      _id: 1,
      name: 'Categoria nueva'
    })

    const subcategoryUpdated = {
      name: ''
    }

    await api
      .patch(ENDPOINT + '/' + subcategory._id)
      .send(subcategoryUpdated)
      .expect(400)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toBe(400)
        expect(errors[0]).toBe(labels.errors.validationData.name.notEmpty)
      })
  })

  test('Devuelve un 404 porque el id no esta registrado', async () => {
    const subcategoryUpdated = {
      name: 'Nombre actualizado'
    }
    await api
      .patch(ENDPOINT + '/1')
      .send(subcategoryUpdated)
      .expect(404)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toEqual(404)
        expect(errors).toEqual(labels.errors.response.notFound)
      })
  })

  test('Debe devolver un 404 porque se intento actualizar una subcategoria eliminada', async () => {
    const subcategory = await SubcategoryModel.create({
      _id: 3,
      name: 'Subcategoria que se eliminara'
    })

    await SubcategoryModel.deleteById(subcategory._id)

    await api
      .patch(ENDPOINT + '/' + subcategory._id)
      .send({ name: 'Categoria intentando actualizar' })
      .expect(404)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toBe(404)
        expect(errors).toEqual(labels.errors.response.notFound)
      })
  })

  test('Debe devolver un 200 con la categoria actualizada', async () => {
    const subcategory = await SubcategoryModel.create({
      _id: 1,
      name: 'Categoria nueva'
    })

    const subcategoryUpdated = {
      name: 'Nombre de categoria actualizada'
    }

    await api
      .patch(ENDPOINT + '/' + subcategory._id)
      .send(subcategoryUpdated)
      .expect(200)
      .then(async response => {
        const { code, message, data } = response.body
        expect(code).toEqual(200)
        expect(data.id).toBe(subcategory._id)
        expect(data.name).toBe(subcategoryUpdated.name)
        expect(message).toEqual(labels.success.response.updated)

        const newSubcategory = await SubcategoryModel.findOne({ _id: data.id })
        expect(newSubcategory.name).toBe(subcategoryUpdated.name)
        expect(newSubcategory.deleted).toBe(false)
      })
  })
})

/**
 * ELIMINACION DE UNA CATEGORIA
 */
describe('DELETE /api/v1/subcategories/:id', () => {
  test('El id no es id valido', async () => {
    await api
      .delete(ENDPOINT + '/someId')
      .expect(400)
      .then(response => {
        const { description, errors } = response.body
        expect(errors[0]).toBe(labels.errors.response.badId)
        expect(description).toEqual('Bad Request')
      })
  })

  test('El id no esta registrado', async () => {
    await api
      .delete(ENDPOINT + '/1')
      .expect(404)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toEqual(404)
        expect(errors).toEqual(labels.errors.response.notFound)
      })
  })

  test('Se elimino la subcategoria correctamente', async () => {
    const subcategory = await SubcategoryModel.create({
      _id: 1,
      name: 'Subategoria a eliminar'
    })

    await api
      .delete(ENDPOINT + '/' + subcategory._id)
      .expect(200)
      .then(async (response) => {
        const { code, message } = response.body
        expect(code).toEqual(200)
        expect(message).toEqual(labels.success.response.deleted)

        const r = await SubcategoryModel.findOne({ _id: subcategory._id })
        expect(r).toBeFalsy()
      })
  })

  test('Se elimino la subcategoria y los productos que dependan de el estaran "sin subcategoria"', async () => {
    await CategoryModel.create({
      _id: 1,
      name: 'Sin Categoria'
    })

    await SubcategoryModel.create({
      _id: 1,
      name: 'Sin subcategoria',
      category: 1
    })

    const someSubcategory = await SubcategoryModel.create({
      _id: 2,
      name: 'Fruto seco',
      category: 1
    })

    const someSubcategory2 = await SubcategoryModel.create({
      _id: 3,
      name: 'Grasas',
      category: 1
    })

    const productFake1 = ProductFactory.createProduct(1, 1, 2)
    const productFake2 = ProductFactory.createProduct(2, 1, 3)
    const productFake3 = ProductFactory.createProduct(3, 1, 3)
    const productFake4 = ProductFactory.createProduct(4, 1, 1)
    const product1 = await ProductModel.create(productFake1)
    const product2 = await ProductModel.create(productFake2)
    const product3 = await ProductModel.create(productFake3)
    const product4 = await ProductModel.create(productFake4)

    await api.delete(ENDPOINT + '/' + someSubcategory._id)
      .expect(200)
      .then(async response => {
        const { code, message } = response.body
        expect(code).toBe(200)
        expect(message).toBe(labels.success.response.deleted)

        const productsWihtoutSubcategory = await ProductModel.find({ subcategory: 1 })

        expect(productsWihtoutSubcategory.length).toBe(2)

        // expect(subcategoriesWihtoutCategory[2].category).toBe(1)
      })
  })
})
