import DistrictModel from 'components/districts/model'
import DocumentTypeModel from 'components/documentTypes/model'
import SupplierModel from './model'
import { validateSupplier } from './services'

export async function correlativeId() {
  const totalDocuments = await SupplierModel.countDocuments()
  return totalDocuments + 1
}

export async function emailExists(email) {
  return await SupplierModel.findOne({ emailContact: email })
}

export async function findAllSupplier(limit, page) {
  const options = {
    page: page || 1,
    limit: limit || 10,
    sort: { createdAt: 'desc' }
  }

  return await SupplierModel.paginate(SupplierModel.findOne({}), options)
}

export async function findSupplierById(id) {
  const supplier = await SupplierModel.findOne({ _id: id })

  return supplier
}

export async function findSupplierByName(search) {
  const supplier = await SupplierModel.findOne({ name: search })

  return supplier
}

export async function createSupplier(supplier) {
  const {
    documentNumber, name, direction, districtID,
    countryCode, documentTypeID, nameContact, mobile, emailContact
  } = supplier
  if (typeof documentTypeID !== 'number') {
    return 'CampoNumeroTipoDocumento'
  }
  const validationDocumentTypeID = await DocumentTypeModel.findOne({ _id: documentTypeID })
  if (!validationDocumentTypeID) {
    return 'noEncontrado'
  }
  const validationDistrictID = await DistrictModel.findOne({ _id: districtID })
  if (!validationDistrictID) {
    return 'noEncontradoDistrictID'
  }
  if (!nameContact) {
    if (mobile || emailContact) {
      return 'camposImcompletos'
    }
  }
  if (!mobile) {
    if (nameContact || emailContact) {
      return 'camposImcompletos'
    }
  }
  if (!emailContact) {
    if (mobile && nameContact) {
      return 'camposImcompletos'
    }
  }
  if (emailContact) {
    const errors = await validateSupplier(supplier)
    if (errors.length > 0) {
      return errors
    }
  }
  const newProveedor = new SupplierModel({
    _id: await correlativeId(), documentNumber, name, direction, districtID, countryCode, documentTypeID, nameContact, mobile, emailContact
  })

  return await newProveedor.save()
}

export async function updateSupplier(id, supplier) {
  const { documentNumber, name, direction, districtID, countryCode, documentTypeID, nameContact, mobile, emailContact } = supplier
  if (typeof documentTypeID !== 'number') {
    return 'CampoNumeroTipoDocumento'
  }
  const validationTipoDocumentoID = await DocumentTypeModel.findOne({ _id: documentTypeID })
  if (!validationTipoDocumentoID) {
    return 'noEncontrado'
  }
  if (!nameContact) {
    if (mobile || emailContact) {
      return 'camposImcompletos'
    }
  }
  if (!mobile) {
    if (nameContact || emailContact) {
      return 'camposImcompletos'
    }
  }
  if (!emailContact) {
    if (mobile && nameContact) {
      return 'camposImcompletos'
    }
  }
  if (emailContact) {
    const errors = await validateSupplier(supplier, id)
    if (errors.length > 0) {
      return 'correoExistente'
    }
  }
  const SupplierUpdated = await SupplierModel.findOneAndUpdate(
    { _id: id },
    { documentNumber, name, direction, districtID, countryCode, documentTypeID, nameContact, mobile, emailContact },
    {
      new: true,
      runValidation: true
    }
  )

  if (!SupplierUpdated) {
    return 'idNoCreado'
  }

  return SupplierUpdated
}

export async function removeSupplier(id) {
  const result = await SupplierModel.deleteById(id)
  return result.matchedCount
}
