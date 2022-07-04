// @ts-check
import { model, Schema } from 'mongoose'
import MongooseDelete from 'mongoose-delete'
import paginate from 'mongoose-paginate-v2'

const unitMeasurementSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String
    }
  },
  { timestamps: true, versionKey: false }
)

unitMeasurementSchema.plugin(MongooseDelete, {
  overrideMethods: true
})

unitMeasurementSchema.plugin(paginate)

const UnitMeasurementModel = model('UnitMeasurement', unitMeasurementSchema)

export default UnitMeasurementModel
