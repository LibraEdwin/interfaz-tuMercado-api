// @ts-check
/**
 * @fileoverview Archivo principal de manejo de rutas de toda la app
 * @version     1.0
 * @author      Interfaz
 *
 */

// @ts-ignore
import pkjConfig from '../../package.json'
import { Router } from 'express'
import routesUsers from 'components/users/routes'
import routesCategories from 'components/categories/routes'
import routesSubcategories from 'components/subcategories/routes'
import routesProducts from 'components/products/routes'
import routesZones from 'components/zones/routes'
import routesDepartments from 'components/departments/routes'
import routesProvinces from 'components/provinces/routes'
import routesDistricts from 'components/districts/routes'
import routesClients from 'components/clients/routes'
import routesSupplier from 'components/supplier/routes'
import routesDocumentTypes from 'components/documentTypes/routes'
import routesMeasurementUnits from 'components/measurementUnits/routes'

/**
 *
 * @param {import('express').Application} app
 */
function router(app) {
  const routerMain = Router()

  routerMain.get('/', (req, res) => {
    return res.json({
      version: '1.1.0',
      info: {
        name: pkjConfig.name,
        description: pkjConfig.description,
        author: pkjConfig.author
      }
    })
  })

  routerMain.use('/users', routesUsers)
  routerMain.use('/categories', routesCategories)
  routerMain.use('/subcategories', routesSubcategories)
  routerMain.use('/products', routesProducts)
  routerMain.use('/zones', routesZones)
  routerMain.use('/departments', routesDepartments)
  routerMain.use('/provinces', routesProvinces)
  routerMain.use('/districts', routesDistricts)
  routerMain.use('/clients', routesClients)
  routerMain.use('/suppliers', routesSupplier)
  routerMain.use('/document-types', routesDocumentTypes)
  routerMain.use('/measurement-units', routesMeasurementUnits)

  app.use('/api/v1', routerMain)
}

export default router
