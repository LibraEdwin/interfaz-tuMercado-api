// @ts-check
import labels from './labels'
import multer from 'multer'
import validator from 'validator'
import { param, validationResult } from 'express-validator'
import { deleteFileTemp, uploadTempImage } from 'helpers/uploads'
import * as UnitMeasurementDao from 'components/measurementUnits/dao'
import SubcategoryDao from 'components/subcategories/dao'
import ProductModel from './model'
import ProductDao from './dao'

const validateId = param('id')
  .isInt()
  .withMessage(labels.errors.response.badId)
  .customSanitizer(value => {
    return Math.abs(Number(value))
  })

/**
 * Validar formato y tamaño de la imagen destaca del producto
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 * @param {import('express').NextFunction} next
 */
const validateImage = (req, res, next) => {
  const upload = uploadTempImage.single('image')

  upload(req, res, err => {
    // errores de multer
    if (err instanceof multer.MulterError) {
      /**
       * El peso de la imagen es basica
       */
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.failValidationError({ errors: [labels.errors.validation.image.limitFileSize] })
      }
    }

    /**
     * Error customizado
     */
    if (err) {
      return res.failValidationError({ errors: err.message })
    }

    next()
  })
}

const validateRetailPrice = (retailPrice, typePrice) => {
  if (!validator.isDecimal(retailPrice)) {
    return labels.errors.validation[typePrice].retail.notNumber
  }

  return null
}

const validateWholesalePrice = (retailPrice, wholesalePrice, typePrice) => {
  if (!validator.isDecimal(wholesalePrice)) {
    return labels.errors.validation[typePrice].wholesale.notNumber
  }

  if (retailPrice > wholesalePrice) {
    return labels.errors.validation[typePrice].wholesale.notValid
  }

  return null
}

/**
 * Validar formato y tamaño de la imagen destaca del producto
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 * @param {import('express').NextFunction} next
 */
const validateCreate = async (req, res, next) => {
  /** @type {import('./types').Product} */
  const { name, unitMeasurement, unitKG, subcategory, purchasePrice, salePrice } = req.body
  const fileImage = req.file
  const errors = []

  if (!name) {
    errors.push(labels.errors.validation.name.required)
  }

  if (!fileImage) {
    errors.push(labels.errors.validation.image.required)
  }

  if (!unitMeasurement) {
    errors.push(labels.errors.validation.unitMeasurement.required)
  } else if (!await UnitMeasurementDao.existUnitMeasurementById(unitMeasurement)) {
    errors.push(labels.errors.validation.unitMeasurement.notFound)
  }

  if (subcategory && !await SubcategoryDao.existSubcategoryById(subcategory)) {
    errors.push(labels.errors.validation.subcategory.notFound)
  }

  if (!purchasePrice?.retail) {
    errors.push(labels.errors.validation.purchasePrice.retail.required)
  } else if (validateRetailPrice(purchasePrice.retail, 'purchasePrice')) {
    errors.push(validateRetailPrice(purchasePrice.retail, 'purchasePrice'))
  }

  if (!purchasePrice?.wholesale) {
    errors.push(labels.errors.validation.purchasePrice.wholesale.required)
  } else if (validateWholesalePrice(purchasePrice?.retail, purchasePrice.wholesale, 'purchasePrice')) {
    errors.push(validateWholesalePrice(purchasePrice?.retail, purchasePrice.wholesale, 'purchasePrice'))
  }

  if (!salePrice?.retail) {
    errors.push(labels.errors.validation.salePrice.retail.required)
  }

  if (!salePrice?.wholesale) {
    errors.push(labels.errors.validation.salePrice.wholesale.required)
  } else if (validateWholesalePrice(salePrice.retail, salePrice?.wholesale, 'salePrice')) {
    errors.push(validateWholesalePrice(salePrice.retail, salePrice?.wholesale, 'salePrice'))
  }

  if (errors.length > 0) {
    // eliminar la imagen si es que se ha subido alguna
    if (req.file) {
      await deleteFileTemp(req.file.filename)
    }
    return res.failValidationError({ errors })
  }

  next()
}

/**
 * Validar formato y tamaño de la imagen destaca del producto
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 * @param {import('express').NextFunction} next
 */
const validateUpdate = async (req, res, next) => {
  const id = req.params.id
  /**
   * @type {import('./types').Product}
   */
  const newProduct = req.body

  /**
   * @type {import('./types').Product}
   */
  const productFound = await ProductDao.findProductById(id)
  Object.getOwnPropertyNames(newProduct).forEach(key => { // Sanear el cuerpo de la solicitud de valores vacios
    if (newProduct[key] === '') {
      delete newProduct[key]
    }
  })
  const errors = []

  if (!productFound) {
    // eliminar la imagen si es que se ha subido alguna
    if (req.file) {
      await deleteFileTemp(req.file.filename)
    }

    return res.failNotFound({ errors: [labels.errors.response.notFound] })
  } else {
    if (newProduct.unitMeasurement && !await UnitMeasurementDao.existUnitMeasurementById(newProduct.unitMeasurement)) {
      errors.push(labels.errors.validation.unitMeasurement.notFound)
    }

    if (newProduct.subcategory && !await SubcategoryDao.existSubcategoryById(newProduct.subcategory)) {
      errors.push(labels.errors.validation.subcategory.notFound)
    }

    if (newProduct.purchasePrice?.wholesale) {
      const errorPuchasePriceWholesale = validateWholesalePrice(productFound.purchasePrice.retail, newProduct.purchasePrice.wholesale, 'purchasePrice')

      if (errorPuchasePriceWholesale) {
        errors.push(errorPuchasePriceWholesale)
      }
    }

    if (newProduct.salePrice?.wholesale) {
      const errorSalePriceWholesale = validateWholesalePrice(productFound.salePrice.retail, newProduct.salePrice.wholesale, 'salePrice')

      if (errorSalePriceWholesale) {
        errors.push(errorSalePriceWholesale)
      }
    }
  }

  if (errors.length > 0) {
    // eliminar la imagen si es que se ha subido alguna
    if (req.file) {
      await deleteFileTemp(req.file.filename)
    }
    return res.failValidationError({ errors })
  }

  next()
}

const resultsValidator = validationResult.withDefaults({
  formatter: error => {
    return error.msg
  }
})

/**
 *
 * @param {import('express').Request} req
 * @param {import('./types').Response} res
 * @param {import('express').NextFunction} next
 */
const hasErrors = async (req, res, next) => {
  const errors = resultsValidator(req).array()

  if (errors.length > 0) {
    // eliminar la imagen si es que se ha subido alguna
    if (req.file) {
      await deleteFileTemp(req.file.filename)
    }
    return res.failValidationError({ errors })
  }

  next()
}

export default {
  validateId,
  validateImage,
  validateCreate,
  validateUpdate,
  hasErrors
}
