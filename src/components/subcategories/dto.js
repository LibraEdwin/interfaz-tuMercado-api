// @ts-check
import config from 'config'
import { getBaseUriApi, uriWithQuery } from 'helpers/utils'

const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
const ENDPOINT_SUBCATEGORIES = `${getBaseUriApi('subcategories')}`

const single = (subcategory) => {
  return {
    id: subcategory._id,
    name: subcategory.name,
    category: subcategory.category,
    deleted: ENVIRONMENT !== 'production' && subcategory.deleted
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
      links: {
        prev: hasPrevPage ? uriWithQuery(`${ENDPOINT_SUBCATEGORIES}${path ?? ''}`, { limit, page: prevPage, ...query }) : null,
        current: uriWithQuery(`${ENDPOINT_SUBCATEGORIES}${path ?? ''}`, { limit, page, ...query }),
        next: hasNextPage ? uriWithQuery(`${ENDPOINT_SUBCATEGORIES}${path ?? ''}`, { limit, page: nextPage, ...query }) : null
      }
    },
    subcategories: docs.map(subcategory => single(subcategory))
  }
}

export default {
  single,
  multiple
}
