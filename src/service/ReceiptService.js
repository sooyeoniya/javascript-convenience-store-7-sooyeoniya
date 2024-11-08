
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

  async #calculateMembershipDiscount() {
    // 멤버십 할인
      // 멤버십 할인 적용 여부 물어보기
      // 멤버십 할인 Y 인 경우에만 해당 로직 처리
      // 멤버십 할인 N 인 경우에는 멤버십 금액 `-0`원으로 처리
      // ConvenienceStoreService의 productsInfo에서 가져오기
      // productsInfo (프로퍼티로 name, quantity, giftCount가 존재함)를 순회하며 다음 로직 처리
      // stock의 stockInfo에서 productsInfo의 name과 일치하는 name에 대한 price 가져오기

      // promotion에서 해당하는 프로모션에 대한 buy + get 값 반환 (getPromotionBuyPlusGetValue(promotionName))

      // 이때, 증정품 개수 0 초과인 것들에 대해서만 계산

      // 멤버십 미적용 금액: 각 상품별로 모두 더한 값({상품 가격} * {상품 증정품 개수} * {해당 상품 프로모션 buy + get 값})
      // 멤버십 할인 금액: ({총 구매액} - {멤버십 미적용 금액}) * 0.3
      // `8,000원` 이상인 경우 멤버십 할인 금액 `8,000원` 으로 제한
      // 출력 `멤버십할인  -${멤버십 할인 금액}` (toLocaleString적용)
  }

  #calculateFinalAmount() {
    // 내실 돈
      // `{총 구매액} - {행사 할인 금액} - {멤버십 할인 금액}`
      // 출력 `내실 돈  ${내실 돈}` (toLocaleString적용)
  }
}

export default ReceiptService;
