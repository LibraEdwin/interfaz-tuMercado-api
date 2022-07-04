// @ts-check
import path from 'path'
import fs from 'fs'
import XLSX from 'xlsx'
import { DIR_UPLOAD_PUBLIC } from 'helpers/uploads'
import DistrictModel from 'components/districts/model'
import ProvinceModel from 'components/provinces/model'
import DepartmentModel from 'components/departments/model'

export default async () => {
  const ubigeoFile = fs.readFileSync(path.join(DIR_UPLOAD_PUBLIC, 'Ubigeos_2022.xlsx'))
  const workbook = XLSX.read(ubigeoFile, { type: 'buffer' })
  const finalObject = {}

  workbook.SheetNames.forEach(sheetName => {
    const rowObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])
    finalObject[sheetName] = rowObject
  })

  const { departments, provinces, districts } = finalObject

  /**
   * Cargar departamentos
   */
  if (await DepartmentModel.countDocuments() === 0) {
    for (let index = 0; index < departments.length; index++) {
      await DepartmentModel.create(departments[index])
    }
  }

  /**
   * Cargar provincias
   */
  if (await ProvinceModel.countDocuments() === 0) {
    for (let index = 0; index < provinces.length; index++) {
      const { departmentId, _id, name } = provinces[index]
      await ProvinceModel.create(
        {
          _id: departmentId + _id,
          name,
          departmentId
        }
      )
    }
  }

  /**
   * Cargar distritos
   */
  if (await DistrictModel.countDocuments() === 0) {
    for (let index = 0; index < districts.length; index++) {
      const { departmentId, provinceId, _id, name } = districts[index]
      await DistrictModel.create(
        {
          _id: departmentId + provinceId + _id,
          name,
          provinceId: departmentId + provinceId,
          departmentId
        }
      )
    }
  }
}
