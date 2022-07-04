// @ts-check
import faker from '@faker-js/faker'
import 'types/index'

/**
 * Crear una categoría Fake
 * @param {number} id - id autoincremental
 * @returns {Category}
 */
function createCategory(id) {
  return {
    _id: id,
    name: faker.commerce.productAdjective()
  }
}

/**
 * Crear una lista de categorías Fake
 * @param {number} totalDocuments - número total de documentos
 * @returns {Category[]}
 */

function createCategoryList(totalDocuments) {
  /**
   * @type {Category[]}
   */
  const categories = [
    {
      _id: 1,
      name: 'Sin categoría'
    }
  ]

  for (let index = 0; index < totalDocuments; index++) {
    const id = index + 2
    categories.push(createCategory(id))
  }

  return categories
}

export default {
  createCategory,
  createCategoryList
}
