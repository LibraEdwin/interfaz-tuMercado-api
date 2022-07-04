// @ts-check
import { Router } from 'express'
import * as ProvinceController from './controller'

const router = Router()

router.get('/', ProvinceController.index)
router.get('/:id', ProvinceController.getById)

export default router
