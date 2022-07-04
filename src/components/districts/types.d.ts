import { Types } from 'mongoose'

export type District = {
  _id: String
  provinceId: String
  departmentId: String
  name: String
}

export { CustomResponse as Response } from '../../helpers/types'