// @ts-check
import { model, Schema } from 'mongoose'
import MongoosePaginate from 'mongoose-paginate-v2'
import MongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'
import MongooseDelete from 'mongoose-delete'

const ProductSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
      required: [true, 'name is required']
    },
    description: {
      type: String
    },
    image: {
      type: String,
      required: [true, 'image is required']
    },
    unitMeasurement: {
      type: Number,
      ref: 'UnitMeasurement'
    },
    unitKG: {
      type: Number,
      default: 0
    },
    subcategory: {
      type: Number,
      ref: 'Subcategory',
      default: 1
    },
    purchasePrice: {
      retail: {
        type: Schema.Types.Decimal128,
        default: 0.0
      },
      wholesale: {
        type: Schema.Types.Decimal128,
        default: 0.0
      }
    },
    salePrice: {
      retail: {
        type: Schema.Types.Decimal128,
        default: 0.0
      },
      wholesale: {
        type: Schema.Types.Decimal128,
        default: 0.0
      }
    }
  },
  { timestamps: true, versionKey: false }
)

ProductSchema.plugin(MongooseDelete, {
  overrideMethods: ['find', 'findOne', 'findOneAndUpdate']
})

ProductSchema.plugin(MongoosePaginate)

ProductSchema.plugin(MongooseAggregatePaginate)

const ProductModel = model('Product', ProductSchema)

export default ProductModel
