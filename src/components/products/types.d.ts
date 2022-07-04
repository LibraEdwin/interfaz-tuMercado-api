import { Decimal128, Types } from 'mongoose'

export type Product = {
  _id?: number
  name: string
  description?: string
  image: string,
  unitMeasurement: number,
  unitKG: number,
  subcategory: number | {
    _id: number
    name: string
    deleted?: boolean
    category: number | {
      _id?: number
      name?: string
      deleted?: boolean
    }
  },
  purchasePrice: {
    retail: string,
    wholesale: string
  },
  salePrice: {
    retail: string,
    wholesale: string
  },
  deleted?: boolean
}

export { CustomResponse as Response } from '../../helpers/types'