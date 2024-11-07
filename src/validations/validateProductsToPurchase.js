import { ERROR_MESSAGES } from '../constants/constants.js';
import parser from '../utils/parser.js';

const validateArrayFormat = (productsToPurchase) => {
  const formatRegex = /^\[([^\[\]-]+)-(\d+)\]$/;

  productsToPurchase.forEach((productInfo) => {
    if (!formatRegex.test(productInfo)) {
      throw new Error(ERROR_MESSAGES.INPUT_FORM);
    }
  });
};

const validateDuplicateProductsName = (productsInfo) => {
  const productNames = new Set();

  productsInfo.forEach(({ name }) => {
    if (productNames.has(name)) {
      throw new Error(ERROR_MESSAGES.DUPLICATE_PRODUCTS_NAME);
    }
    productNames.add(name);
  })
}

const validateQuantityFormat = (quantity) => {
  if (quantity <= 0) {
    throw new Error(ERROR_MESSAGES.QUANTITY_IS_LESS_THAN_ZERO);
  }
}

const validateProductsInStock = (name, quantity, stock) => {
  if (!stock.checkProductExistence(name)) {
    throw new Error(ERROR_MESSAGES.NOT_EXIST);
  }
  if (!stock.hasSufficientStock(name, quantity)) {
    throw new Error(ERROR_MESSAGES.QUANTITY_IS_OVER_STOCK);
  }
}

const validateProductsToPurchase = (productsToPurchase, stock) => {
  validateArrayFormat(productsToPurchase);
  const productsInfo = parser.extractProductsToPurchase(productsToPurchase);
  validateDuplicateProductsName(productsInfo);
  productsInfo.forEach(({ name, quantity }) => {
    validateQuantityFormat(quantity);
    validateProductsInStock(name, quantity, stock);
  });

  return productsInfo;
}

export default validateProductsToPurchase;
