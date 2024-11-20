import Stock from '../domains/Stock.js';
import Promotion from '../domains/Promotion.js';

class ProductsManagementService {
  /** @type {Stock} */ #stock;
  /** @type {Promotion} */ #promotion;

  constructor(stock, promotion) {
    this.#stock = stock;
    this.#promotion = promotion;
  }

  
}

export default ProductsManagementService;
