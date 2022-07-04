import { Types } from 'mongoose'

export type User = {
  _id: Types.ObjectId
  nikname?: string
  email: string
  password: string
  isDeleted?: boolean
}

export { CustomResponse as Response } from '../../helpers/types'