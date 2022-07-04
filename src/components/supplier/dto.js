// @ts-check
import { getBaseUriApi } from 'helpers/utils'

const ENDPOINT_USERS = `${getBaseUriApi()}/supplier`

export function single(supplier) {
  return (supplier)
}

export function multiple(resources) {
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
  } = resources
  return {
    info: {
      totalDocs,
      totalPages,
      page,
      limit
    },
    links: {
      prev: hasPrevPage ? `${ENDPOINT_USERS}?limit=${limit}&page=${prevPage}` : null,
      current: `${ENDPOINT_USERS}?limit=${limit}&page=${page}`,
      next: hasNextPage ? `${ENDPOINT_USERS}?limit=${limit}&page=${nextPage}` : null
    },
    supplier: docs.map(supplier => single(supplier))
  }
}
