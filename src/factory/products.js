// @ts-check
import faker from '@faker-js/faker'
import 'types/index'

/**
 * Crear un producto Fake
 * @param {number} id - id autoincremental
 * @param {number} unitMeasurementId - id de la unidad de medida
 * @param {number} subcategoryId - id categoría principal
 * @returns {Product}
 */
function createProduct(id, unitMeasurementId, subcategoryId) {
  return {
    _id: id,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    image: `/uploads/tu-mercado/productos/${id}/1.jpg`,
    subcategory: subcategoryId,
    unitKG: faker.datatype.number({ min: 0, max: 40 }),
    unitMeasurement: unitMeasurementId, // unidades de medidas id
    purchasePrice: {
      retail: faker.datatype.float({ min: 100, max: 350, precision: 0.01 }),
      wholesale: faker.datatype.float({ min: 340, max: 400, precision: 0.01 })
    },
    salePrice: {
      retail: faker.datatype.float({ min: 250, max: 460, precision: 0.01 }),
      wholesale: faker.datatype.float({ min: 300, max: 600, precision: 0.01 })
    }
  }
}

/**
 * Crear una lista de productos Fake
 * @param {number} totalDocuments - número total de documentos
 * @param {number} totalSubcategories - número total de categorías inscritas 5 por ejemplo
 * @param {number} totalMeasurementUnits - número total de unidades de medidas
 * @returns {Product[]}
 */

function createProductList(totalDocuments, totalSubcategories, totalMeasurementUnits) {
  const products = []

  for (let index = 0; index < totalDocuments; index++) {
    const id = index + 1
    const unitMeasurementId = faker.datatype.number({ min: 1, max: totalMeasurementUnits })
    const subcategoryId = faker.datatype.number({ min: 1, max: totalSubcategories })
    products.push(createProduct(id, unitMeasurementId, subcategoryId))
  }

  return products
}

export default {
  createProduct,
  createProductList
}
