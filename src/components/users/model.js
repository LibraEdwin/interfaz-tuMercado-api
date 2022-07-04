// @ts-check
import { model, Schema } from 'mongoose'
import Paginate from 'mongoose-paginate-v2'
import MongooseDelete from 'mongoose-delete'

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, 'email required']
    },
    password: {
      type: String,
      required: [true, 'password required']
    }
  },
  { timestamps: true, versionKey: false }
)

UserSchema.plugin(Paginate)
UserSchema.plugin(MongooseDelete)

const UserModel = model('Users', UserSchema)

export default UserModel
