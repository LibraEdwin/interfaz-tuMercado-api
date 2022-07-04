// @ts-check
import { Router } from 'express'
import * as DepartamentController from './controller'

const router = Router()

router.get('/', DepartamentController.index)
router.get('/:id', DepartamentController.getById)

export default router
