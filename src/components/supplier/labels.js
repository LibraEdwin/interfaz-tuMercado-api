export default {
  errors: {
    validation: {
      notEmpty: {
        numeroDocumento: 'El numero de documento es obligatorio',
        nombre: 'El nombres es obligatorio',
        direccion: 'La direccion es obligatorio',
        distritoID: 'El distrito ID es obligatorio',
        tipoDocumentoID: 'El tipo de Documento ID de Pais es obligatorio'
      },
      isNumericDistritoID: 'El campo distritoID es del tipo numero',
      isNumericTipoDocumentoID: 'El campo tipoDocumentoID es del tipo numero',
      notFoundTipoDocumentoID: 'Tipo de documento no encontrado',
      notFoundTipoDistrictID: 'El distrito no fue encontrado',
      missingFieldsContact: 'Faltan campos de contacto',
      isEmail: 'correo incorrecto',
      isEmailUnique: 'El correo esta en uso',
      idNotFoundSuplier: 'correo incorrecto'
    },
    getBy: {
      badId: 'El id es incorrecto, por favor verifique que sea un número',
      notFound: 'No se encontró el proveedor, vuelva a intentarlo'
    },
    removeById: {
      errors: 'No se encontró el ID, vuelva a intentarlo'
    }
  },
  success: {
    response: {
      created: 'El proveedor se creó correctamente',
      updated: 'El proveedor se actualizó correctamente',
      deleted: 'Se eliminó el proveedor satisfactoriamente'
    }
  }
}
