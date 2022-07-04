// @ts-check
import config from 'config'
import 'types/index'
import { getBaseUriApi, uriWithQuery } from 'helpers/utils'

const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
const ENDPOINT_CATEGORIES = getBaseUriApi('categories')

/**
 *
 * @param {Category} category
 * @returns
 */
const single = (category) => {
  return {
    id: category._id,
    name: category.name,
    deleted: ENVIRONMENT !== 'production' && category.deleted
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
      prev: hasPrevPage ? uriWithQuery(`${ENDPOINT_CATEGORIES}${path ?? ''}`, { limit, page: prevPage, ...query }) : null,
      current: uriWithQuery(`${ENDPOINT_CATEGORIES}${path ?? ''}`, { limit, page, ...query }),
      next: hasNextPage ? uriWithQuery(`${ENDPOINT_CATEGORIES}${path ?? ''}`, { limit, page: nextPage, ...query }) : null
    },
    categories: docs.map(category => single(category))
  }
}

export default {
  single,
  multiple
}
