// @ts-check
import { model, Schema } from 'mongoose'
import MongooseDelete from 'mongoose-delete'
import paginate from 'mongoose-paginate-v2'

const SupplierSchema = new Schema(
  {
    _id: Number,
    documentNumber: {
      type: String
    },
    name: {
      type: String,
      unique: true,
      required: [true, 'name required']
    },
    direction: {
      type: String,
      required: [true, 'direction required']
    },
    districtID: {
      type: String,
      ref: 'District',
      required: [true, 'districtID required']
    },
    countryCode: {
      type: String,
      required: [true, 'countryCode required']
    },
    documentTypeID: {
      type: Number,
      ref: 'DocumentType',
      required: [true, 'documentTypeID required']
    },
    nameContact: {
      type: String
    },
    mobile: {
      type: String
    },
    emailContact: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
)

SupplierSchema.plugin(MongooseDelete, {
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

SupplierSchema.plugin(paginate)

const SupplierModel = model('Supplier', SupplierSchema)

export default SupplierModel
