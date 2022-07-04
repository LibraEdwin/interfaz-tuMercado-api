// @ts-check
import ProductFactory from './products'
import ProductModel from 'components/products/model'
import CategoryFactory from './categories'
import CategoryModel from 'components/categories/model'
import SubcategoryFactory from './subcategories'
import SubcategoryModel from 'components/subcategories/model'
import UnitMeasurementModel from 'components/measurementUnits/model'
import UnitMeasurementFactory from './measurementUnits'

export default async () => {
  const NUM_CATEGORIES = 5
  const NUM_SUBCATEGORIES = 150
  const NUM_PRODUCTS = 2000
  const NUM_MEASUREMENT_UNITS = 10

  /**
   * Crear categorías fake en la bd
   */
  await CategoryModel.deleteMany() // eliminar todas las categorías de la bd

  const categoryList = CategoryFactory.createCategoryList(NUM_CATEGORIES) // obtener lista fake de categorías

  for (let index = 0; index < categoryList.length; index++) {
    const category = categoryList[index]

    await CategoryModel.create(category) // guardar la categoría
  }

  /**
   * Crear subcategorias fake en la bd
   */
  await SubcategoryModel.deleteMany() // eliminar todas las subcategorías de la bd

  const subcategoryList = SubcategoryFactory.createSubcategoryList(NUM_SUBCATEGORIES, NUM_CATEGORIES) // obtener lista fake de subcategorías

  for (let index = 0; index < subcategoryList.length; index++) {
    const subcategory = subcategoryList[index]

    await SubcategoryModel.create(subcategory) // guardar la subcategoría
  }

  /**
   * Crear productos fake en la bd
   */
  await ProductModel.deleteMany() // eliminar todos los productos en la bd

  const productList = ProductFactory.createProductList(NUM_PRODUCTS, NUM_SUBCATEGORIES, NUM_MEASUREMENT_UNITS) // obtener lista fake de productos

  for (let index = 0; index < productList.length; index++) {
    const product = productList[index]

    await ProductModel.create(product) // guardar el producto fake
  }

  /**
   * Crear unidades de medida fake en la bd
   */
  await UnitMeasurementModel.deleteMany() // eliminar todas las unidades de medida en la bd

  const unitMeasurement = UnitMeasurementFactory.createUnitMeasurementList(NUM_MEASUREMENT_UNITS)// obtener lista fake de unidades de medida

  for (let index = 0; index < unitMeasurement.length; index++) {
    const product = unitMeasurement[index]

    await UnitMeasurementModel.create(product) // guardar la unidad de medida fake
  }
}
