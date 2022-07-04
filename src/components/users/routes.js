// @ts-check
import { Router } from 'express'
import * as UserController from './controller'

const router = Router()

router.get('/', UserController.index)
router.get('/:id', UserController.getById)
router.post('/', UserController.create)
router.patch('/:id', UserController.updateById)
router.delete('/:id', UserController.removeById)

export default router
