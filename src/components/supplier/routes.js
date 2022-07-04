// @ts-check
import { Router } from 'express'
import { check } from 'express-validator'
import { create, getById, getByName, index, removeById, updateById } from './controller'
import { validateFields } from './services'
import labels from './labels'

const router = Router()

router.get('/', index)
router.get('/:id', getById)
router.get('/search/:search', getByName)
router.post('/', [
  check('documentNumber', labels.errors.validation.notEmpty.numeroDocumento).notEmpty(),
  check('name', labels.errors.validation.notEmpty.nombre).notEmpty(),
  check('direction', labels.errors.validation.notEmpty.direccion).notEmpty(),
  check('districtID', labels.errors.validation.notEmpty.distritoID).notEmpty(),
  check('documentTypeID', labels.errors.validation.notEmpty.tipoDocumentoID).notEmpty(),
  validateFields
], create)
router.patch('/:id', [
  check('documentNumber', labels.errors.validation.notEmpty.numeroDocumento).notEmpty(),
  check('name', labels.errors.validation.notEmpty.nombre).notEmpty(),
  check('direction', labels.errors.validation.notEmpty.direccion).notEmpty(),
  check('districtID', labels.errors.validation.notEmpty.distritoID).notEmpty(),
  check('documentTypeID', labels.errors.validation.notEmpty.tipoDocumentoID).notEmpty(),
  validateFields
], updateById)
router.delete('/:id', removeById)

export default router
