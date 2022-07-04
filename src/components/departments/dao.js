// @ts-check
import DepartamentModel from './model'

export async function getAllDepartments () {
  return await DepartamentModel.find()
}

/**
 * Obtener un departamento
 * @param {string} codigo
 */
export async function getDepartament (codigo) {
  return await DepartamentModel.findOne({ _id: codigo })
}
