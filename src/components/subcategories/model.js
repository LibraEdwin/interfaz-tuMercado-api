// @ts-check
import { model, Schema } from 'mongoose'
import Paginate from 'mongoose-paginate-v2'
import MongooseDelete from 'mongoose-delete'

const SubcategorySchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'name is required']
    },
    category: {
      type: Number,
      ref: 'Category'
    }
  },
  { timestamps: true, versionKey: false }
)

SubcategorySchema.plugin(MongooseDelete, {
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

SubcategorySchema.plugin(Paginate)

const SubcategoryModel = model('Subcategory', SubcategorySchema)

export default SubcategoryModel
