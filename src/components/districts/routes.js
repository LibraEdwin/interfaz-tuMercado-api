// @ts-check
import { Router } from 'express'
import * as DistrictController from './controller'

const router = Router()

router.get('/', DistrictController.index)
router.get('/:id', DistrictController.getById)

export default router
