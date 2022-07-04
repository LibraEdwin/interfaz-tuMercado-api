import { Types } from 'mongoose'

export type Client = {
  _id: Number
  dni: String 
  name: String
  email: String
  clientType: String
  countryCode: String
  phone: String
  direction: String
  districtId: String
  zoneId: String
  contactName: String
  contactCountryCode: String
  contactNumber: String
  contactEmail: String
  deleted: Boolean
}

export { CustomResponse as Response } from '../../helpers/types'