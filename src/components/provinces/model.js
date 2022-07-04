// @ts-check
import { model, Schema } from 'mongoose'

const ProvinceSchema = new Schema(
  {
    _id: String,
    departmentId: {
      type: String,
      ref: 'Department'
    },
    name: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
)

const ProvinceModel = model('Province', ProvinceSchema)

export default ProvinceModel
