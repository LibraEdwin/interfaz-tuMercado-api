// @ts-check
import { model, Schema } from 'mongoose'
import Paginate from 'mongoose-paginate-v2'
import MongooseDelete from 'mongoose-delete'

const clientTypeEnum = ['Residencial', 'Empresa']

const ClientSchema = new Schema(
  {
    _id: Number,
    dni: {
      type: String,
      unique: true,
      required: [true, 'DNI is required']
    },
    name: {
      type: String,
      required: [true, 'name is required']
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is required']
    },
    countryCode: {
      type: String,
      default: '+51',
      required: [true, 'country code is required']
    },
    phone: {
      type: String,
      required: [true, 'phone is required']
    },
    direction: {
      type: String,
      required: [true, 'direction is required']
    },
    clientType: {
      type: String,
      enum: clientTypeEnum
    },
    districtId: {
      type: String,
      ref: 'District'
    },
    zoneId: {
      type: String,
      ref: 'Zone'
    },
    contactName: {
      type: String,
      required: [true, 'contact name is required']
    },
    contactCountryCode: {
      type: String,
      default: '+51',
      required: [true, 'contact country code is required']
    },
    contactNumber: {
      type: String,
      required: [true, 'contact number is required']
    },
    contactEmail: {
      type: String,
      unique: true,
      required: [true, 'contact email is required']
    }
  },
  { timestamps: true, versionKey: false }
)

ClientSchema.plugin(MongooseDelete, {
  overrideMethods: true
})

ClientSchema.plugin(Paginate)

const ClientModel = model('Client', ClientSchema)

export default ClientModel
