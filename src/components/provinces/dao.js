// @ts-check
import ProvinceModel from './model'

export async function getAllProvinces () {
  return await ProvinceModel.find()
}

/**
 * Obtener una provincia
 * @param {string} codigo
 */
export async function getProvince (codigo) {
  return await ProvinceModel.findOne({ _id: codigo })
    .populate('departmentId')
}
