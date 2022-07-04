// @ts-check
import config from 'config'
import { getBaseUriApi, uriWithQuery } from 'helpers/utils'
import 'types/index'

const URL_UPLOADS = config.get('DOMAIN_IMAGES')
const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
const ENDPOINT_PRODUCTS = getBaseUriApi('products')

/**
 * @param {Product} product
 */
export const single = (product) => {
  return {
    id: product._id,
    name: product.name,
    description: product.description,
    unitMeasurement: product.unitMeasurement,
    unitKG: product.unitKG,
    subcategory: {
      id: product.subcategory?._id,
      name: product.subcategory?.name,
      deleted: ENVIRONMENT !== 'production' && product.subcategory?.deleted,
      category: {
        id: product.subcategory?.category?._id,
        name: product.subcategory?.category?.name,
        deleted: ENVIRONMENT !== 'production' && product.subcategory?.category?.deleted
      }
    },
    purchasePrice: {
      retail: parseFloat(product.purchasePrice.retail),
      wholesale: parseFloat(product.purchasePrice.wholesale)
    },
    salePrice: {
      retail: parseFloat(product.salePrice.retail),
      wholesale: parseFloat(product.salePrice.wholesale)
    },
    image: URL_UPLOADS + product.image,
    deleted: ENVIRONMENT !== 'production' && product.deleted,
    refs: {
      subcategory: getBaseUriApi(`subcategories/${product.subcategory?._id}`),
      category: getBaseUriApi(`categories/${product.subcategory?.category?._id}`)

    }
  }
}

export const multiple = (data, query, path) => {
  const {
    docs,
    totalDocs,
    limit,
    totalPages,
    page,
    // pagingCounter,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage
  } = data

  return {
    info: {
      totalDocs,
      totalPages,
      prevPage,
      nextPage,
      page,
      limit
    },
    links: {
      prev: hasPrevPage ? uriWithQuery(`${ENDPOINT_PRODUCTS}${path ?? ''}`, { limit, page: prevPage, ...query }) : null,
      current: uriWithQuery(`${ENDPOINT_PRODUCTS}${path ?? ''}`, { limit, page, ...query }),
      next: hasNextPage ? uriWithQuery(`${ENDPOINT_PRODUCTS}${path ?? ''}`, { limit, page: nextPage, ...query }) : null
    },
    products: docs.map(product => single(product))
  }
}

export default {
  single,
  multiple
}
