import { Types } from 'mongoose'

export type Subcategory = {
  _id?: number
  name: string,
  category: number
  deleted?: boolean
}

export { CustomResponse as Response } from '../../helpers/types'

