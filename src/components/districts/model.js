// @ts-check
import { model, Schema } from 'mongoose'

const DistrictSchema = new Schema(
  {
    _id: String,
    provinceId: {
      type: String,
      ref: 'Province'
    },
    departmentId: {
      type: String,
      ref: 'Department'
    },
    name: String

  },
  { timestamps: true, versionKey: false }
)

const DistrictModel = model('District', DistrictSchema)

export default DistrictModel
