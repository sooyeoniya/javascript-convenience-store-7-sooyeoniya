import { PROMPT_MESSAGES } from '../constants/constants.js';
import getUserConfirmation from '../utils/getUserConfirmation.js';

class ReceiptService {
  #stock;
  #promotion;
  #productManagementService;
  #receiptInfo;

  constructor(stock, promotion, productManagementService) {
    this.#stock = stock;
    this.#promotion = promotion;
    this.#productManagementService = productManagementService;
    this.#receiptInfo = {
      items: [],             // 각 상품 정보
      totalQuantity: 0,      // 총 구매 수량
      totalAmount: 0,        // 총 구매액
      eventDiscount: 0,      // 행사 할인
      membershipDiscount: 0, // 멤버십 할인
      finalAmount: 0         // 내실 돈
    };
  }

  async processReceipt() {
    this.#calculateReceiptDetails();
    await this.#calculateMembershipDiscount();
    this.#calculateFinalAmount();

    // TODO: 삭제할 코드
    console.log(this.#receiptInfo);

    return this.#receiptInfo;
  }

  #calculateReceiptDetails() {
    this.#receiptInfo.items = this.#productManagementService.getProductsInfo();
    this.#receiptInfo.items.forEach((item) => {
      const price = this.#stock.getProductPrice(item.name);
      item.itemTotalAmount = item.quantity * price;

      this.#receiptInfo.totalAmount += item.itemTotalAmount;
      this.#receiptInfo.totalQuantity += item.quantity;
      this.#receiptInfo.eventDiscount += item.giftCount * price;
    });
  }

  // TODO: 함수 길이 10으로 줄이기, indent depth 2로 줄이기
  async #calculateMembershipDiscount() {
    const response = await getUserConfirmation(PROMPT_MESSAGES.MEMBERSHIP_DISCOUNT);
    if (response.toUpperCase() === 'Y') {
      let nonDiscountableAmount = 0;
      this.#receiptInfo.items.forEach((item) => {
        if (item.giftCount > 0) {
          const price = this.#stock.getProductPrice(item.name);
          const promotionName = this.#stock.getPromotionName(item.name);
          const promotionValue = this.#promotion.getPromotionBuyPlusGetValue(promotionName);
          nonDiscountableAmount += price * item.giftCount * promotionValue;

          let membershipDiscount = (this.#receiptInfo.totalAmount - nonDiscountableAmount) * 0.3;
          membershipDiscount = Math.min(membershipDiscount, 8000);
      
          this.#receiptInfo.membershipDiscount = membershipDiscount;
        }
      });
    }
  }

  #calculateFinalAmount() {
    this.#receiptInfo.finalAmount = this.#receiptInfo.totalAmount - this.#receiptInfo.eventDiscount - this.#receiptInfo.membershipDiscount;
  }
}

export default ReceiptService;
