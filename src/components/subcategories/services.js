// @ts-check
import { checkSchema, param, validationResult } from 'express-validator'
import labels from './labels'

const validateIdParam = param('id')
  .isNumeric()
  .withMessage(labels.errors.response.badId)
  .customSanitizer(value => {
    return Math.abs(Number(value))
  })

const validateNewSubcategory = checkSchema({
  name: {
    notEmpty: {
      errorMessage: labels.errors.validationData.name.required
    }
  }
})

const validateEditedSubcategory = checkSchema({
  name: {
    not: true,
    isEmpty: {
      errorMessage: labels.errors.validationData.name.notEmpty
    }
  }
})

const hasErrors = async (req, res, next) => {
  const myValidationResult = validationResult.withDefaults({
    formatter: error => {
      return error.msg
    }
  })
  const errors = myValidationResult(req).array()

  if (errors.length > 0) {
    return res.failValidationError({ errors })
  }

  next()
}

export default {
  validateIdParam,
  validateNewSubcategory,
  validateEditedSubcategory,
  hasErrors
}
