// @ts-check

/**
 * @typedef Category - Categoria
 *
 * @property {number}   [_id] - Id de una categoria
 * @property {string}   name - Nombre de la categoria
 * @property {boolean}  [deleted] - Indica si esta eliminado
 */

/**
 * @typedef Subcategory - Subcategoria del subproducto
 *
 * @property {number}           [_id] - Id de la subcategoria
 * @property {string}           name - Nombre de la subcategoria
 * @property {number|Category}  [category] - Id de la categoria
 * @property {boolean}          [deleted] - Indica si esta eliminado
 */

/**
 * @typedef PurchasePrice - Precio de compra
 *
 * @property {number} retail - Precio de compra al por menor
 * @property {number} wholesale - Precio de compra al por mayor
 */

/**
 * @typedef SalePrice - Precio de venta
 *
 * @property {number} retail - Precio de venta al por menor
 * @property {number} wholesale - Precio de venta al por mayor
 */

/**
 * @typedef Product - Categoria
 *
 * @property {number}             [_id] - Id de un producto
 * @property {string}             name - Nombre de la categoria
 * @property {string}             [description] - Descripcion del producto
 * @property {string}             image - Imagen del producto
 * @property {number}             unitMeasurement - Id de la unidad de medida
 * @property {number}             unitKG - Unidades por kilogramo
 * @property {number|Subcategory} [subcategory] - Id de la subcategoria
 * @property {PurchasePrice}      purchasePrice - Precio de compra
 * @property {SalePrice}          salePrice - Precio de venta
 * @property {boolean}            [deleted] - Indica si esta eliminado
 */
