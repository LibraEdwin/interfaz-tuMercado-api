export default {
  errors: {
    validation: {
      name: {
        required: 'El nombre del producto es requerido'
      },
      subcategory: {
        notNumber: 'El codigo de la subcategoria no es un numero',
        notFound: 'El codigo de la subcategoria no se encontro en la base de datos'
      },
      unitMeasurement: {
        required: 'El codigo de unidad de medida es requerida',
        notNumber: 'El codigo de unidad de medida no es un numero',
        notFound: 'El codigo de unidad de medida no se encontro en la base de datos'
      },
      image: {
        required: 'La imagen del producto es requerida',
        limitFileSize: 'La imagen del producto excede el limite maximo permitido de 2mb'
      },
      purchasePrice: {
        retail: {
          required: 'El precio de compra minorista es requerida',
          notNumber: 'El precio de compra minorista no es un numero'
        },
        wholesale: {
          required: 'El precio de compra mayorista es requerida',
          notNumber: 'El precio de compra mayorista no es un numero',
          notValid: 'El precio de compra mayorista no puede ser menor al precio de compra minorista'
        }
      },
      salePrice: {
        notEmpty: 'El precio de venta minorista y mayorista son requeridos',
        retail: {
          required: 'El precio de venta minorista es requerida',
          notNumber: 'El precio de venta minorista es incorrecto'
        },
        wholesale: {
          required: 'El precio de venta mayorista es requerida',
          notNumber: 'El precio de venta mayorista es incorrecto',
          notValid: 'El precio de venta mayorista no puede ser menor al precio de compra minorista'
        }
      }
    },
    response: {
      badId: 'El id es incorrecto, por favor verifique que sea un número',
      notFound: 'No se encontró el producto, vuelva a intentarlo'
    }
  },
  success: {
    response: {
      created: 'El producto se creó correctamente',
      updated: 'El producto se actualizó correctamente',
      deleted: 'Se eliminó el producto satisfactoriamente'
    }
  }
}
