import { validationResult } from 'express-validator'

export const validateFields = (req, res, next) => {
  const errors = validationResult(req).array()
  const msg = errors[0]?.msg
  if (errors.length > 0) {
    return res.failNotFound({ errors: msg })
  }
  next()
}
