// @ts-check
import { model, Schema } from 'mongoose'
import Paginate from 'mongoose-paginate-v2'
import MongooseDelete from 'mongoose-delete'

const CategorySchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'name is required']
    }
  },
  { timestamps: true, versionKey: false }
)

CategorySchema.plugin(MongooseDelete, {
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

CategorySchema.plugin(Paginate)

const CategoryModel = model('Category', CategorySchema)

export default CategoryModel
