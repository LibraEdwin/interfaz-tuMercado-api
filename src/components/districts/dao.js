// @ts-check
import DistrictModel from './model'

export async function getAllDistricts () {
  return await DistrictModel.find()
}

/**
 * Obtener una provincia
 * @param {string} codigo
 */
export async function getDistrict (codigo) {
  return await DistrictModel.findOne({ _id: codigo })
    .populate('provinceId')
    .populate('departmentId')
}

/**
 * Validar si existe codigo de ubigeo
 * @param {string} codigo
 *
 * @return {Promise<any>}
 */
export async function districtExist (codigo) {
  return await DistrictModel.exists({ _id: codigo })
}
