export default {
  errors: {
    validationData: {
      name: {
        required: 'El nombre de la categoria es requerida',
        notEmpty: 'El nombre de la categoria no puede ser vacia'
      }
    },
    response: {
      badId: 'El id es incorrecto, por favor verifique que sea un número',
      notFound: 'No se encontró la categoria, vuelva a intentarlo'
    }
  },
  success: {
    response: {
      created: 'La categoria se creó correctamente',
      updated: 'La categoria se actualizó correctamente',
      deleted: 'Se eliminó la categoria satisfactoriamente'
    }
  }
}
