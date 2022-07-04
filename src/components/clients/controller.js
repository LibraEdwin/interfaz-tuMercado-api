// @ts-check
import * as ClientDao from './dao'
import * as DistrictDao from '../districts/dao'
import * as ZonesDao from '../zones/dao'
import ClientDto from './dto'

/**
 * Crear un cliente
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function create (req, res) {
  const bodyClient = req.body

  // Validar si dni y email se encuentran registrados //
  const existDni = await ClientDao.clientExist(bodyClient.dni)
  const existEmail = await ClientDao.emailExist(bodyClient.email)
  const existDistrict = await DistrictDao.districtExist(bodyClient.districtId)
  const existZone = await ZonesDao.zoneExist(bodyClient.zoneId)

  if (existDni) {
    return res.failNotFound({ errors: 'El dni del cliente ya se encuentra registrado' })
  }
  if (existEmail) {
    return res.failNotFound({ errors: 'El email ya se encuentra registrado' })
  }
  if (!existDistrict) {
    return res.failNotFound({ errors: 'El codigo de ubigeo no existe' })
  }
  if (!existZone) {
    return res.failNotFound({ errors: 'La zona ingresada es incorrecta' })
  }

  // Crear cliente //
  const clientCreated = await ClientDao.createClient(bodyClient)
  return res.respondCreated({ data: ClientDto.single(clientCreated) })
}

/**
 * Listar clientes
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function index(req, res) {
  const { limit, page } = req.query
  const allClients = await ClientDao.getAllClients(Number(limit), Number(page))
  res.respond({ data: ClientDto.multiple(allClients) })
}

/**
 * Obtener un cliente
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function getById (req, res) {
  const { id } = req.params
  const result = await ClientDao.getClient(id)

  if (!result) {
    return res.failNotFound({ errors: 'El cliente no se encuentra registrado' })
  }
  return res.respond({ data: ClientDto.single(result) })
}

/**
 * Actualizar cliente por id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function updateById (req, res) {
  const id = Number(req.params.id)
  const client = req.body

  // Validar si el distrito y la zona a actualizar existen
  const district = req.body.districtId
  const districtExist = await DistrictDao.districtExist(district)
  if (!districtExist) {
    return res.failNotFound({ errors: 'El distrito ingresado no existe' })
  }

  const zone = req.body.zoneId
  const zoneExist = await ZonesDao.zoneExist(zone)
  if (!zoneExist) {
    return res.failNotFound({ errors: 'La zona ingresada es incorrecta' })
  }

  // Actualizar cliente
  const clientUpdated = await ClientDao.updateClient(id, client)
  if (!clientUpdated) {
    return res.failNotFound({ errors: 'No se pudieron actualizar los datos' })
  }
  return res.respondUpdated({ data: ClientDto.single(clientUpdated) })
}

/**
 * Remover cliente por id
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function removeById (req, res) {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    return res.failValidationError({ errors: 'No es un id válido' })
  }

  const isDeleted = await ClientDao.removeClient(id)

  if (!isDeleted) {
    return res.failNotFound({ errors: `Upss! parece que el id ${id} no está registrado` })
  }
  return res.respondDeleted({ message: 'El cliente fue eliminado' })
}

/**
 * Buscar cliente
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export async function searchClient (req, res) {
  const query = req.query
  const find = await ClientDao.search(query)
  return res.respond({ data: ClientDto.multiple(find, query) })
}
