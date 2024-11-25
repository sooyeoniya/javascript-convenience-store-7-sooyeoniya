import Stock from '../domains/Stock.js';
import Promotion from '../domains/Promotion.js';
import getUserConfirm from '../utils/getUserConfirm.js';

class ReceiptService {
  /** @type {Stock} */ #stock;
  /** @type {Promotion} */ #promotion;
  /**
  * @type {{ 
  *  productsInfo: Array<{ name: string, quantity: number, giftQuantity: number, totalPrice: number }>,
  *  totalQuantity: number,
  *  totalProductsAmount: number, 
  *  promotionDiscount: number,
  *  membershipDiscount: number,
  *  totalPaymentAmount: number,
  *  }}
  */
  #receiptInfo = [];

  constructor(productsInfo, stock, promotion) {
    this.#stock = stock;
    this.#promotion = promotion;
    this.#receiptInfo = {
      productsInfo: productsInfo, // 각 상품별 총 금액 추가
      totalQuantity: 0, // 총 구매 수량
      totalProductsAmount: 0, // 총 구매액
      promotionDiscount: 0, // 프로모션 할인 금액
      membershipDiscount: 0, // 멤버십 할인 금액
      totalPaymentAmount: 0, // 총 결제 금액
    }
  }

  getReceiptInfo() {
    return this.#receiptInfo;
  }

  async calculateReceipt() {
    this.#setReceiptDetails();
    await this.#setMembershipDiscount();
    this.#setTotalPaymentAmount();
  }

  #setReceiptDetails() {
    this.#receiptInfo.productsInfo.forEach((product) => {
      const productPrice = this.#stock.getProductPrice(product.name);
      product.totalPrice = productPrice * product.quantity;
      this.#receiptInfo.totalProductsAmount += product.totalPrice;
      this.#receiptInfo.totalQuantity += product.quantity;
      this.#receiptInfo.promotionDiscount += product.giftQuantity * productPrice;
    });
  }

  async #setMembershipDiscount() {
    const userConfirm = await getUserConfirm('\n멤버십 할인을 받으시겠습니까? (Y/N)\n');
    if (userConfirm === 'Y') {
      const promotionAmount = this.#getPromotionAmount();
      const membershipAmount = this.#receiptInfo.totalProductsAmount - promotionAmount;
      this.#receiptInfo.membershipDiscount = Math.min(membershipAmount * 0.3, 8_000);
    }
  }
  
  #getPromotionAmount() {
    let promotionAmount = 0;
    this.#receiptInfo.productsInfo.forEach(({ name, giftQuantity }) => {
      if (giftQuantity <= 0) return;
      const productPrice = this.#stock.getProductPrice(name);
      const promotionName = this.#stock.getPromotionName(name);
      const buyPlusGet = this.#promotion.getPromotionBuyPlusGet(promotionName);
      promotionAmount += giftQuantity * buyPlusGet * productPrice;
    });
    return promotionAmount;
  }

  #setTotalPaymentAmount() {
    this.#receiptInfo.totalPaymentAmount = this.#receiptInfo.totalProductsAmount 
    - (this.#receiptInfo.promotionDiscount + this.#receiptInfo.membershipDiscount);
  }
}

export default ReceiptService;
