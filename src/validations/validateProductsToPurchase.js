import { ERROR_MESSAGES } from '../constants/constants.js';
import extractProductsToPurchase from '../utils/extractProductsToPurchase.js';

const validateArrayFormat = (productsToPurchase) => {
  const formatRegex = /^\[([^\[\]-]+)-(\d+)\]$/;

  productsToPurchase.forEach((productInfo) => {
    if (!formatRegex.test(productInfo)) throw new Error(ERROR_MESSAGES.INPUT_FORM);
  });
};

const validateDuplicateProductsName = (productsInfo) => {
  const productNames = new Set();

  productsInfo.forEach(({ name }) => {
    if (productNames.has(name)) throw new Error(ERROR_MESSAGES.OTHER_ERRORS);
    productNames.add(name);
  })
}

const validateQuantityFormat = (quantity) => {
  if (quantity <= 0) throw new Error(ERROR_MESSAGES.OTHER_ERRORS);
}

const validateProductExistence = (name, stock) => {
  if (!stock.checkProductExistence(name)) throw new Error(ERROR_MESSAGES.NOT_EXIST);
}

const validateStockQuantity = (name, quantity, productManagementService) => {
  if (!productManagementService.hasSufficientStock(name, quantity)) {
    throw new Error(ERROR_MESSAGES.QUANTITY_IS_OVER_STOCK);
  }
}

const validateProductsToPurchase = (productsToPurchase, stock, productManagementService) => {
  validateArrayFormat(productsToPurchase);
  const productsInfo = extractProductsToPurchase(productsToPurchase);
  validateDuplicateProductsName(productsInfo);

  productsInfo.forEach(({ name, quantity }) => {
    validateQuantityFormat(quantity);
    validateProductExistence(name, stock);
    validateStockQuantity(name, quantity, productManagementService);
  });
  return productsInfo;
}

export default validateProductsToPurchase;
