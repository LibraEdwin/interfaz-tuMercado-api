// @ts-check
import config from 'config'
import { getBaseUriApi, uriWithQuery } from 'helpers/utils'

const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
const ENDPOINT_DOCUMENT_TYPES = `${getBaseUriApi()}/documentType`

export function single(documentType) {
  return {
    id: documentType._id,
    name: documentType.name,
    deleted: ENVIRONMENT !== 'production' && documentType.deleted
  }
}

export function multiple(resources, query) {
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
      prev: hasPrevPage ? uriWithQuery(ENDPOINT_DOCUMENT_TYPES, { limit, page: prevPage, ...query }) : null,
      current: uriWithQuery(ENDPOINT_DOCUMENT_TYPES, { limit, page, ...query }),
      next: hasNextPage ? uriWithQuery(ENDPOINT_DOCUMENT_TYPES, { limit, page: nextPage, ...query }) : null
    },
    documentTypes: docs.map(documentType => single(documentType))
  }
}
