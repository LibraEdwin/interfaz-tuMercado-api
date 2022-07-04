// @ts-check
import { Router } from 'express'
import CategoryController from './controller'
import CategoryService from './services'

const router = Router()

router.get('/', CategoryController.index)

router.get('/correlative-id', CategoryController.getCorrelativeId)

router.get('/:id',
  CategoryService.validateIdParam,
  CategoryService.hasErrors,
  CategoryController.getById
)

router.post('/',
  CategoryService.validateNewCategory,
  CategoryService.hasErrors,
  CategoryController.create
)

router.patch('/:id',
  CategoryService.validateIdParam,
  CategoryService.validateEditedCategory,
  CategoryService.hasErrors,
  CategoryController.updateById
)

router.delete('/:id',
  CategoryService.validateIdParam,
  CategoryService.hasErrors,
  CategoryController.deleteById
)

export default router
