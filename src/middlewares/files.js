import { uploadTempImage } from 'helpers/uploads'
import multer from 'multer'

export function isSingleFileValid(req, res, next) {
  const upload = uploadTempImage.single('image')

  upload(req, res, err => {
    // errores de multer
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.failValidationError({ errors: `La imagen ingresada en el campo ${err.field} excede el tamaño permitido de 1mb` })
      }
    }
    // errores personalizados
    if (err) {
      return res.failValidationError({ errors: err.message })
    }

    next()
  })
}
