// @ts-check
import { Router } from 'express'
import SubcategoryController from './controller'
import SubcategoryService from './services'

const router = Router()

router.get('/', SubcategoryController.index)

router.get('/:id',
  SubcategoryService.validateIdParam,
  SubcategoryService.hasErrors,
  SubcategoryController.getById
)

router.post('/',
  SubcategoryService.validateNewSubcategory,
  SubcategoryService.hasErrors,
  SubcategoryController.create
)

router.patch('/:id',
  SubcategoryService.validateIdParam,
  SubcategoryService.validateEditedSubcategory,
  SubcategoryService.hasErrors,
  SubcategoryController.updateById
)

router.delete('/:id',
  SubcategoryService.validateIdParam,
  SubcategoryService.hasErrors,
  SubcategoryController.deleteById
)

export default router
