import { ERROR_MESSAGES } from '../constants/constants.js';
import Stock from '../domains/Stock.js';
import ProductsManagementService from '../services/ProductsManagementService.js';
import parser from '../utils/parser.js';

/**
 * 입력이 올바른 형식인지 확인
 * @param {Array<string>} productsDetails 
 */
const validateInputForm = (productsDetails) => {
  const regex = /^\[([^\[\]\-]+)-(\d+)\]$/;
  productsDetails.forEach((productInfo) => {
    if (!regex.test(productInfo)) {
      throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
    }
  });
}

/**
 * 존재하는 상품인지 확인
 * @param {string} name
 * @param {Stock} stockInstance
 */
const validateExistProduct = (name, stockInstance) => {
  if (!stockInstance.checkProductExists(name)) {
    throw new Error(ERROR_MESSAGES.NON_EXISTENT);
  }
}

/**
 * 수량 초과하는지 확인
 * @param {string} name
 * @param {number} quantity
 * @param {ProductsManagementService} productManager
 */
const validateExcessQuantity = (name, quantity, productManager) => {
  if (productManager.checkExcessQuantity(name, quantity)) {
    throw new Error(ERROR_MESSAGES.EXCEEDED_QUANTITY);
  }
}

/**
 * 
 * @param {string} productsDetails 
 * @param {ProductsManagementService} productManager 
 * @returns {Array<{ name: string, quantity: number }>}
 */
const validateProductsDetails = (productsDetails, stockInstance, productManager) => {
  const parsedProductsDetails = parser.parseStringToArray(productsDetails);
  validateInputForm(parsedProductsDetails);

  const productsInfo = parser.parseProductsDetails(parsedProductsDetails);
  productsInfo.forEach(({ name, quantity }) => {
    validateExistProduct(name, stockInstance);
    validateExcessQuantity(name, quantity, productManager);
  });

  return productsInfo;
}

export default validateProductsDetails;
