import { Types } from 'mongoose'

export type UnitMeasurement = {
  _id?: number
  name: string,
  deleted?: boolean
}

export { CustomResponse as Response } from '../../helpers/types'