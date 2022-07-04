// @ts-check
import { model, Schema } from 'mongoose'
import MongooseDelete from 'mongoose-delete'
import MongoosePaginate from 'mongoose-paginate-v2'

const DocumentTypeSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'name is required']
    }
  },
  { timestamps: true, versionKey: false }
)

DocumentTypeSchema.plugin(MongooseDelete, {
  overrideMethods: true
})

DocumentTypeSchema.plugin(MongoosePaginate)

const DocumentTypeModel = model('DocumentType', DocumentTypeSchema)

export default DocumentTypeModel
