import { Types } from 'mongoose'

export type Province = {
  _id: String
  departmentId: String
  name: String
}

export { CustomResponse as Response } from '../../helpers/types'