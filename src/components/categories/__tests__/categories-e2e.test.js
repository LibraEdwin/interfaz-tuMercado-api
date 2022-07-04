import config from 'config'
import app from 'app'
import supertest from 'supertest'
import mongoose from 'mongoose'
import CategoryModel from 'components/categories/model'
import labels from 'components/categories/labels'
import SubcategoryModel from 'components/subcategories/model'

const api = supertest(app)
const ENDPOINT = '/api/v1/categories'
const { MONGODB_URI } = config.get('DATABASE')

beforeEach((done) => {
  mongoose.connect(
    MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true
    },
    () => done()
  )
})

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  })
})

/**
 * LISTAR TODAS LAS CATEGORIAS
 */
describe('GET /api/v1/categories', () => {
  test('Debe devolver un 200 y una sola categoria en lista', async () => {
    const category = await CategoryModel.create({
      _id: 1,
      name: 'Categoria 1'
    })

    await api
      .get(ENDPOINT)
      .expect(200)
      .then(response => {
        const { code, data: { categories } } = response.body
        // revisar la respuesta
        expect(categories.length).toEqual(1) //
        expect(code).toEqual(200)
        expect(categories[0].id).toBe(category._id)
        expect(categories[0].name).toBe(category.name)
      })
  })

  test('Debe responder un 200 con un total de 3 documentos(categorias)', async () => {
    await CategoryModel.create({
      _id: 1,
      name: 'Categoria 1'
    })

    await CategoryModel.create({
      _id: 2,
      name: 'Categoria 2'
    })

    const category3 = await CategoryModel.create({
      _id: 3,
      name: 'Categoria 3'
    })

    await CategoryModel.deleteById(category3._id)

    await CategoryModel.create({
      _id: 4,
      name: 'Categoria 4'
    })

    await api
      .get(ENDPOINT)
      .expect(200)
      .then(response => {
        const { data: { info, categories } } = response.body
        expect(info.totalDocs).toBe(3)
        expect(categories.length).toBe(3)
      })
  })

  test('Debe responder un 200 con un documento(categoria) en la pagina 2', async () => {
    await CategoryModel.create({
      _id: 1,
      name: 'Categoria 1'
    })

    await CategoryModel.create({
      _id: 2,
      name: 'Categoria 2'
    })

    const category3 = await CategoryModel.create({
      _id: 3,
      name: 'Categoria 3'
    })

    await CategoryModel.deleteById(category3._id)

    await CategoryModel.create({
      _id: 4,
      name: 'Categoria 4'
    })

    await api
      .get(ENDPOINT)
      .query({ page: 2, limit: 2 })
      .expect(200)
      .then(response => {
        const { data: { info, categories } } = response.body
        expect(info.totalDocs).toBe(3)
        expect(info.page).toBe(2)
        expect(info.limit).toBe(2)
        expect(info.totalPages).toBe(2)
        expect(categories.length).toBe(1)
      })
  })
})

/**
 * BUSCAR UNA CATEGORIA POR SU NOMBRE
 */
describe('GET /api/v1/categories?name={value}', () => {
  test('Deberia devolver un 200 con la categoria encontrada', async () => {
    await CategoryModel.create({
      _id: 1,
      name: 'Vegetales'
    })

    await CategoryModel.create({
      _id: 2,
      name: 'Carnes'
    })

    await CategoryModel.create({
      _id: 3,
      name: 'Lacteos'
    })

    await CategoryModel.create({
      _id: 4,
      name: 'Condimentos'
    })

    await CategoryModel.create({
      _id: 5,
      name: 'Insumos de mesa'
    })

    await api.get(ENDPOINT)
      .query({ name: 'vegeta' })
      .expect(200)
      .then(response => {
        const { code, data: { info } } = response.body
        expect(code).toBe(200)
        expect(info.totalDocs).toBe(1)
      })
  })
})

/**
 * BUSCAR UNA CATEGORIA POR SU ID
 */
describe('GET /api/v1/categories/:id', () => {
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

  test('Deberia devolver un 404 porque no se encontro la categoria', async () => {
    await CategoryModel.create({
      _id: 1,
      name: 'Categoria registrada'
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

  test('Deberia devolver un 404 porque se intento acceder a una categoria eliminada', async () => {
    const category = await CategoryModel.create({
      _id: 1,
      name: 'Categoria registrada'
    })

    await CategoryModel.deleteById(category._id)

    await api
      .get(ENDPOINT + '/' + category._id)
      .expect(404)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toBe(404)
        expect(errors).toBe(labels.errors.response.notFound)
      })
  })

  test('Debe devolver un 200 con la categoria correcta', async () => {
    const category = await CategoryModel.create({
      _id: 2,
      name: 'Categoria de prueba 2'
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
describe('POST /api/v1/categories', () => {
  test('Debe devolver un error 400 porque el nombre de la categoria esta vacia', async () => {
    const category = {}

    await api
      .post(ENDPOINT)
      .send(category)
      .expect(400)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toEqual(400)
        expect(errors[0]).toEqual(labels.errors.validationData.name.required)
      })
  })

  test('Debe devolver 200 una categoria creada', async () => {
    const category = {
      name: 'Categoria de prueba'
    }

    await api
      .post(ENDPOINT)
      .send(category)
      .expect(201)
      .then(response => {
        const { code, data, message } = response.body
        expect(code).toEqual(201)
        expect(data.id).toBe(1)
        expect(data.name).toBe(category.name)
        expect(data.deleted).toBe(false)
        expect(message).toEqual(labels.success.response.created)
      })
  })
})

/**
 * ACTUALIZACION DE UNA CATEGORIA
 */
describe('PATCH /api/v1/categories/:id', () => {
  test('Devuelve un 400 porque se ingreso un id invalido', async () => {
    await api
      .patch(ENDPOINT + '/someId')
      .expect(400)
      .then(response => {
        const { description, errors } = response.body
        expect(errors[0]).toBe(labels.errors.response.badId)
        expect(description).toEqual('Bad Request')
      })
  })

  test('Devuelve 400 con un mensaje porque el nombre no puede estar vacio', async () => {
    const category = await CategoryModel.create({
      _id: 1,
      name: 'Categoria nueva'
    })

    const categoryUpdated = {
      name: ''
    }

    await api
      .patch(ENDPOINT + '/' + category._id)
      .send(categoryUpdated)
      // .expect(400)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toBe(400)
        expect(errors[0]).toBe(labels.errors.validationData.name.notEmpty)
      })
  })

  test('Devuelve un 404 porque el id no esta registrado', async () => {
    const categoryUpdated = {
      name: 'Nombre actualizado'
    }
    await api
      .patch(ENDPOINT + '/1')
      .send(categoryUpdated)
      .expect(404)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toEqual(404)
        expect(errors).toEqual(labels.errors.response.notFound)
      })
  })

  test('Debe devolver un 404 porque se intento actualizar una categoria eliminada', async () => {
    const category = await CategoryModel.create({
      _id: 3,
      name: 'Categoria que se eliminara'
    })

    await CategoryModel.deleteById(category._id)

    await api
      .patch(ENDPOINT + '/' + category._id)
      .send({ name: 'Categoria intentando actualizar' })
      .expect(404)
      .then(response => {
        const { errors, code } = response.body
        expect(code).toBe(404)
        expect(errors).toEqual(labels.errors.response.notFound)
      })
  })

  test('Debe devolver un 200 con la categoria actualizada', async () => {
    const category = await CategoryModel.create({
      _id: 1,
      name: 'Categoria nueva'
    })

    const categoryUpdated = {
      name: 'Nombre de categoria actualizada'
    }

    await api
      .patch(ENDPOINT + '/' + category._id)
      .send(categoryUpdated)
      .expect(200)
      .then(async response => {
        const { code, message, data } = response.body
        expect(code).toEqual(200)
        expect(data.id).toBe(category._id)
        expect(data.name).toBe(categoryUpdated.name)
        expect(message).toEqual(labels.success.response.updated)

        const newCategory = await CategoryModel.findOne({ _id: data.id })
        expect(newCategory.name).toBe(categoryUpdated.name)
        expect(newCategory.deleted).toBe(false)
      })
  })
})

/**
 * ELIMINACION DE UNA CATEGORIA
 */
describe('DELETE /api/v1/categories/:id', () => {
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

  test('Se elimino la categoria correctamente', async () => {
    const category = await CategoryModel.create({
      _id: 1,
      name: 'Categoria a eliminar'
    })

    await api
      .delete(ENDPOINT + '/' + category._id)
      .expect(200)
      .then(async (response) => {
        const { code, message } = response.body
        expect(code).toEqual(200)
        expect(message).toEqual(labels.success.response.deleted)

        const r = await CategoryModel.findOne({ _id: category._id })
        expect(r).toBeFalsy()
      })
  })

  test('Se elimino la categoria y las subcategorias que dependan de el se reiniciaran a la categoria por defecto "sin categoria"', async () => {
    const defaultCategory = await CategoryModel.create({
      _id: 1,
      name: 'Sin Categoria'
    })

    const someCategory = await CategoryModel.create({
      _id: 2,
      name: 'Frutas'
    })

    await SubcategoryModel.create({
      _id: 1,
      name: 'Sin subcategoria',
      category: 1
    })

    await SubcategoryModel.create({
      _id: 2,
      name: 'Fruto seco',
      category: 2
    })

    await SubcategoryModel.create({
      _id: 3,
      name: 'Citricos',
      category: 2
    })

    await api.delete(ENDPOINT + '/' + someCategory._id)
      .expect(200)
      .then(async response => {
        const { code, message } = response.body
        expect(code).toBe(200)
        expect(message).toBe(labels.success.response.deleted)

        const subcategoriesWihtoutCategory = await SubcategoryModel.find({ category: 1 })

        expect(subcategoriesWihtoutCategory.length).toBe(3)
        expect(subcategoriesWihtoutCategory[2].category).toBe(1)
      })
  })
})
