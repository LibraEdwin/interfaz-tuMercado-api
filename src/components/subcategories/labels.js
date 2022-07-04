export default {
  errors: {
    validationData: {
      name: {
        required: 'El nombre de la subcategoria es requerida',
        notEmpty: 'El nombre de la subcategoria no puede ser vacia'
      },
      category: {
        required: 'El id de la categoria es requerida',
        notFound: 'No se encontró el id de la categoría'
      }
    },
    response: {
      badId: 'El id es incorrecto, por favor verifique que sea un número',
      notFound: 'No se encontró la subcategoria, vuelva a intentarlo'
    }
  },
  success: {
    response: {
      created: 'La subcategoria se creó correctamente',
      updated: 'La subcategoria se actualizó correctamente',
      deleted: 'Se eliminó la subcategoria satisfactoriamente'
    }
  }
}
