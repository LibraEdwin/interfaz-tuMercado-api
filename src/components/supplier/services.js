import { emailExists } from './dao'
import { validationResult } from 'express-validator'

export async function validateSupplier(newSupplier, id = null) {
  const { emailContact } = newSupplier
  const errors = []

  const errorEmail = await validateEmail(emailContact)
  const correoExistente = await emailExists(emailContact)

  if (errorEmail) {
    return errorEmail
  }
  if (Number(id) === correoExistente?._id) {
    return errors
  } else {
    if (correoExistente) {
      return 'correoExistente'
    }
  }

  return errors
}

export async function validateEmail(email) {
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!regexEmail.test(email)) {
    return 'correoIncorrecto'
  }
  return null
}

export const validateFields = (req, res, next) => {
  const errors = validationResult(req).array()
  const msg = errors[0]?.msg
  if (errors.length > 0) {
    return res.failNotFound({ errors: msg })
  }
  next()
}
