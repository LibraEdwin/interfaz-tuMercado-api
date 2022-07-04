// @ts-check
/**
 *
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export function index(req, res) {
  // return al users
  res.respond({ data: [] })
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export function getById(req, res) {
  // return user by id
  return res.respond({ data: {} })
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export function create(req, res) {
  // return user created
  return res.respondCreated({ data: {} })
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export function updateById(req, res) {
  return res.respondUpdated({ data: {} })
}

/**
 *
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 */
export function removeById(req, res) {
  return res.respondDeleted({ data: {} })
}
