// @ts-check
import { Router } from 'express'
import ProductController from './controller'
import ProductService from './services'

const router = Router()

router.post('/',
  ProductService.validateImage, // multer validation
  ProductService.validateCreate, // express validator
  ProductController.create // crear producto
)

router.get('/', ProductController.index)

router.get('/categoria/:id',
  ProductService.validateId,
  ProductService.hasErrors,
  ProductController.getByCategoryId
)

router.get('/:id',
  ProductService.validateId,
  ProductService.hasErrors,
  ProductController.getById
)

router.patch('/:id',
  ProductService.validateImage, // multer validation
  ProductService.validateId,
  ProductService.hasErrors,
  ProductService.validateUpdate,
  ProductController.updateById
)

router.delete('/:id',
  ProductService.validateId,
  ProductService.hasErrors,
  ProductController.removeById
)

export default router
