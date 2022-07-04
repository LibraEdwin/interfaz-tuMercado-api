// @ts-check
import { Router } from 'express'
import * as ZoneController from './controller'

const router = Router()

router.get('/', ZoneController.index)
router.get('/:id', ZoneController.getById)

export default router
