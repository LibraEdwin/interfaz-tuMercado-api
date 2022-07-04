import DocumentTypeModel from './model'

export async function correlativeId() {
  const totalDocuments = await DocumentTypeModel.countDocuments()
  return totalDocuments + 1
}

export async function findAllDocumentType(limit, page) {
  const options = {
    page: page || 1,
    limit: limit || 10,
    sort: { createdAt: 'desc' }
  }

  return await DocumentTypeModel.paginate(DocumentTypeModel.findOne({}), options)
}

export async function findDocumentTypeById(id) {
  const documentType = await DocumentTypeModel.findOne({ _id: id })

  if (!documentType) {
    return null
  }

  return documentType
}

export async function createDocumentType(documentType) {
  const { name } = documentType
  const newDocumentType = new DocumentTypeModel({ _id: await correlativeId(), name })

  return await newDocumentType.save()
}

export async function updateDocumentType(id, documentType) {
  const documentTypeUpdated = await DocumentTypeModel.findOneAndUpdate(
    { _id: id },
    documentType,
    {
      new: true,
      runValidation: true
    }
  )

  if (!documentTypeUpdated) {
    return null
  }

  return documentTypeUpdated
}

export async function removeDocumentType(id) {
  const result = await DocumentTypeModel.deleteById(id)
  return result.matchedCount
}
