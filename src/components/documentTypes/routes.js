// @ts-check
import { Router } from 'express'
import { check } from 'express-validator'
import { create, getById, index, removeById, updateById } from './controller'
import { validateFields } from './services'
import labels from './labels'

const router = Router()

router.get('/', index)
router.get('/:id', getById)
router.post('/', [
  check('name', labels.errors.validation.notEmpty.name).notEmpty(),
  validateFields
], create)
router.patch('/:id', [
  check('name', labels.errors.validation.notEmpty.name).notEmpty(),
  validateFields
], updateById)
router.delete('/:id', removeById)

export default router
