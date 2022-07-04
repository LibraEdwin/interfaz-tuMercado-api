// @ts-check
import faker from '@faker-js/faker'

/**
 * Crear una unidad de medida Fake
 * @param {number} id - id autoincremental
 * @returns {import('../components/measurementUnits/types').UnitMeasurement}
 */
function createUnitMeasurement(id) {
  return {
    _id: id,
    name: faker.commerce.productMaterial()
  }
}

/**
 * Crear una lista de unidades de medida Fake
 * @param {number} totalDocuments - número total de documentos
 * @returns {any[]}
 */

function createUnitMeasurementList(totalDocuments) {
  /** @type {import('../components/measurementUnits/types').UnitMeasurement[]} */
  const categories = [
    {
      _id: 1,
      name: 'Kilgramo'
    }
  ]

  for (let index = 0; index < totalDocuments; index++) {
    const id = index + 2
    categories.push(createUnitMeasurement(id))
  }

  return categories
}

export default {
  createUnitMeasurement,
  createUnitMeasurementList
}
