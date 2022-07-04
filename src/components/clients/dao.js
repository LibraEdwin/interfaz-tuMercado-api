// @ts-check
import ClientModel from './model'
import { customAlphabet } from 'nanoid'

const nanoId = customAlphabet('123456789', 8)

/**
 * Crear un nuevo usuario
 * @param {import('./types').Client} client
 *
 * @return {Promise<import('./types').Client>}
 */
export async function createClient (client) {
  const _id = parseInt(nanoId())
  const newClient = new ClientModel({
    _id,
    ...client
  })

  return await newClient.save()
}

/**
 * Listar clientes
 * @param {number} limit
 * @param {number} page
 */
export async function getAllClients (limit, page) {
  const options = {
    page: page || 1,
    limit: limit || 10,
    sort: { createdAt: 'desc' }
  }

  return await ClientModel.paginate(ClientModel.find(), options)
}

/**
 * Obtener un cliente
 * @param {string} id
 */
export async function getClient (id) {
  return await ClientModel.findOne({ _id: id })
    .populate('districtId')
    .populate('zoneId')
}

/**
 * Actualizar el cliente
 * @param {number} id
 * @param {import('./types').Client} client
 *
 * @returns {Promise<import('./types').Client>}
 */
export async function updateClient (id, client) {
  const clientUpdated = await ClientModel.findOneAndUpdate(
    { _id: id },
    client,
    {
      new: true,
      runValidation: true
    }
  )

  if (!clientUpdated) {
    return null
  }
  return clientUpdated
}

export async function removeClient (id) {
  const result = await ClientModel.deleteById(id)
  return result.matchedCount
}

/**
 * Verificar si existe un cliente por el dni
 * @param {String} dni
 *
 * @return {Promise<any>}
 */
export async function clientExist (dni) {
  return await ClientModel.exists({ dni: dni })
}

/**
 * Verificar si existe un cliente por el email
 * @param {String} mail
 *
 * @return {Promise<any>}
 */
export async function emailExist (mail) {
  return await ClientModel.exists({ email: mail })
}

export async function search (query) {
  const options = {
    page: query.page || 1,
    limit: query.limit || 10,
    sort: { createdAt: 'desc' }
  }

  const { name } = query
  let currentQuery = {}

  // Buscar por nombre
  if (name) {
    currentQuery = {
      ...currentQuery,
      name: {
        $regex: name,
        $options: 'i'
      }
    }
  }

  return await ClientModel.paginate(
    ClientModel.find(currentQuery)
      .populate('districtId')
      .populate('zoneId')
    , options)
}
