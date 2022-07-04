// @ts-check
import config from 'config'
import { getBaseUriApi, uriWithQuery } from 'helpers/utils'

const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
const ENDPOINT_MEASUREMENT_UNITS = getBaseUriApi('measurement-units')

export function single(unitMeasurement) {
  return {
    id: unitMeasurement._id,
    name: unitMeasurement.name,
    deleted: ENVIRONMENT !== 'production' && unitMeasurement.deleted
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
      prev: hasPrevPage ? uriWithQuery(ENDPOINT_MEASUREMENT_UNITS, { limit, page: prevPage, ...query }) : null,
      current: uriWithQuery(ENDPOINT_MEASUREMENT_UNITS, { limit, page, ...query }),
      next: hasNextPage ? uriWithQuery(ENDPOINT_MEASUREMENT_UNITS, { limit, page: nextPage, ...query }) : null
    },
    measurementUnits: docs.map(unitMeasurement => single(unitMeasurement))
  }
}
