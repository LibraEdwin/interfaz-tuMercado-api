// @ts-check
import { model, Schema } from 'mongoose'

const ZoneSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
)

const UserModel = model('Zone', ZoneSchema)

export default UserModel
