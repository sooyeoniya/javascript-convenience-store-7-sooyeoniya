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

const validateQuantityFormat = (productsInfo) => {
  productsInfo.forEach((product) => {
    if (product.quantity <= 0) {
      throw new Error(ERROR_MESSAGES.QUANTITY_IS_LESS_THAN_ZERO);
    }
  });
}

const validateProductsToPurchase = (productsToPurchase) => {
  validateArrayFormat(productsToPurchase);
  const productsInfo = parser.extractProductsToPurchase(productsToPurchase);
  validateQuantityFormat(productsInfo);

  return productsInfo;
}

export default validateProductsToPurchase;
