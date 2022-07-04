// @ts-check
import faker from '@faker-js/faker'
import 'types/index'
/**
 * Crear una categoría Fake
 * @param {number} id - id autoincremental
 * @param {number} idCategory - id categoria
 *
 * @return {Subcategory}
 */
function createSubcategory(id, idCategory) {
  return {
    _id: id,
    name: faker.commerce.productAdjective(),
    category: idCategory
  }
}

/**
 * Crear una lista de categorías Fake
 * @param {number} totalDocuments - número total de documentos
 * @param {number} totalCategories - número total de categorias
 * @returns {Subcategory[]}
 */

function createSubcategoryList(totalDocuments, totalCategories) {
  /**
   * @type {Subcategory[]}
   */
  const subcategories = [
    {
      _id: 1,
      name: 'Sin subcategoría',
      category: 1
    }
  ]

  for (let index = 0; index < totalDocuments; index++) {
    const id = index + 2
    const categoryId = faker.datatype.number({ min: 1, max: totalCategories })
    subcategories.push(createSubcategory(id, categoryId))
  }

  return subcategories
}

export default {
  createSubcategory,
  createSubcategoryList
}
