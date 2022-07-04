// @ts-check
import { model, Schema } from 'mongoose'

const DepartamentSchema = new Schema(
  {
    _id: String,
    name: String
  },
  { timestamps: true, versionKey: false }
)

const DepartamentModel = model('Department', DepartamentSchema)

export default DepartamentModel
