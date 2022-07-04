// @ts-check
import config from 'config'
import { getBaseUriApi, uriWithQuery } from 'helpers/utils'

const ENVIRONMENT = config.util.getEnv('NODE_CONFIG_ENV')
const ENDPOINT_CLIENTS = getBaseUriApi('clients')

/**
 *
 * @param {import('./types').Client} client
 * @returns
 */
export const single = (client) => {
  return {
    id: client._id,
    dni: client.dni,
    name: client.name,
    email: client.email,
    clientType: client.clientType,
    countryCode: client.countryCode,
    phone: client.phone,
    direction: client.direction,
    districtId: client.districtId,
    zoneId: client.zoneId,
    contactName: client.contactName,
    contactCountryCode: client.contactCountryCode,
    contactNumber: client.contactNumber,
    contactEmail: client.contactEmail,
    deleted: ENVIRONMENT !== 'production' && client.deleted
  }
}

export const multiple = (data, query) => {
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
      page,
      limit
    },
    links: {
      prev: hasPrevPage ? uriWithQuery(ENDPOINT_CLIENTS, { limit, page: prevPage, ...query }) : null,
      current: uriWithQuery(ENDPOINT_CLIENTS, { limit, page, ...query }),
      next: hasNextPage ? uriWithQuery(ENDPOINT_CLIENTS, { limit, page: nextPage, ...query }) : null
    },
    clients: docs.map(client => single(client))
  }
}

export default {
  single,
  multiple
}
