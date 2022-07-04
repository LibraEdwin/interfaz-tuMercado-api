// @ts-check
import { Router } from 'express'
import * as ClientController from './controller'

const router = Router()

router.post('/', ClientController.create)
router.get('/', ClientController.index)
router.get('/search', ClientController.searchClient)
router.patch('/:id', ClientController.updateById)
router.delete('/:id', ClientController.removeById)
router.get('/:id', ClientController.getById)

export default router
