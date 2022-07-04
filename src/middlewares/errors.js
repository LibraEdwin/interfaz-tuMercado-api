import createError from 'http-errors'

export function error404 (_req, res, next) {
  next(createError(404, 'La ruta no existe'))
}

export function generalErrorHandler (err, req, res, next) {
  res.locals.message = err.message

  res.status(err.status || 500)
  res.json({
    code: err.status,
    message: err.message
  })
}
