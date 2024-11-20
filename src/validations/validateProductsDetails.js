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
      throw new Error('[ERROR] 올바르지 않은 형식으로 입력했습니다. 다시 입력해 주세요.');
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
    throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
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
    throw new Error('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.');
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
