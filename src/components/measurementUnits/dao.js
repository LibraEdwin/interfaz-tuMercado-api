import { getOptionsPagination } from 'helpers/utils'
import UnitMeasurementModel from './model'

export async function correlativeId() {
  const totalDocuments = await UnitMeasurementModel.countDocuments()
  return totalDocuments + 1
}

export async function findAllUnitMeasurement(limit, page) {
  const options = getOptionsPagination(limit, page)

  return await UnitMeasurementModel.paginate(UnitMeasurementModel.findOne({}), options)
}

export async function findPUnitMeasurementById(id) {
  const unitMeasurement = await UnitMeasurementModel.findOne({ _id: id })

  if (!unitMeasurement) {
    return null
  }

  return unitMeasurement
}

export async function createUnitMeasurement(unitMeasurement) {
  const { name } = unitMeasurement
  const newUnitMeasurement = new UnitMeasurementModel({ _id: await correlativeId(), name })

  return await newUnitMeasurement.save()
}

export async function updateUnitMeasurement(id, unitMeasurement) {
  const unitMeasurementUpdate = await UnitMeasurementModel.findOneAndUpdate(
    { _id: id },
    unitMeasurement,
    {
      new: true,
      runValidation: true
    }
  )

  if (!unitMeasurementUpdate) {
    return null
  }

  return unitMeasurementUpdate
}

export async function removeUnitMeasurement(id) {
  const result = await UnitMeasurementModel.deleteById(id)
  return result.matchedCount
}

export async function existUnitMeasurementById(id) {
  return await UnitMeasurementModel.exists({ _id: id })
}
