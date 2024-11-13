import { Console } from '@woowacourse/mission-utils';
import { PROMPT_MESSAGES, RECEIPT_LABELS, RECEIPT_MESSAGES, STOCK_LABELS } from '../constants/constants.js';
import { formatPrice, formatItemName } from '../utils/parserUtils.js';

const OutputView = {
  printWelcomeGreetingAndStockInfo(stockInfo) {
    Console.print(PROMPT_MESSAGES.WELCOME_GREETING);
    stockInfo.forEach((productInfo) => this.printProductInfo(productInfo));
  },

  printProductInfo(productInfo) {
    let promotionText = productInfo.promotion;
    if (!productInfo.promotion) promotionText = '';

    let quentityText = STOCK_LABELS.NO_STOCK;
    if (productInfo.quantity > 0) quentityText = `${productInfo.quantity}개`;

    const priceText = formatPrice(productInfo.price);
    Console.print(`- ${productInfo.name} ${priceText}원 ${quentityText} ${promotionText}`);
  },

  printReceipt(receiptInfo) {
    this.printHeader();
    this.printItemDetails(receiptInfo.items);
    this.printGiftDetails(receiptInfo.items);
    this.printSummary(receiptInfo);
  },

  printHeader() {
    Console.print(RECEIPT_MESSAGES.HEADER);
  },

  printItemDetails(items) {
    items.forEach((item) => {
      Console.print(`${formatItemName(item.name)}\t${item.quantity}\t\t${formatPrice(item.itemTotalAmount)}`);
    });
  },

  printGiftDetails(items) {
    Console.print(RECEIPT_MESSAGES.GIFT_LINE);
    items
      .filter((item) => item.giftCount > 0)
      .forEach((item) => {
        Console.print(`${formatItemName(item.name)}\t${item.giftCount}`);
      });
  },

  printSummary(receiptInfo) {
    Console.print(RECEIPT_MESSAGES.TOTAL_LINE);
    Console.print(`${RECEIPT_LABELS.TOTAL_PURCHASE_AMOUNT}\t${receiptInfo.totalQuantity}\t\t${formatPrice(receiptInfo.totalAmount)}`);
    Console.print(`${RECEIPT_LABELS.EVENT_DISCOUNT}\t\t\t-${formatPrice(receiptInfo.eventDiscount)}`);
    Console.print(`${RECEIPT_LABELS.MEMBERSHIP_DISCOUNT}\t\t\t-${formatPrice(receiptInfo.membershipDiscount)}`);
    Console.print(`${RECEIPT_LABELS.FINAL_AMOUNT}\t\t\t\t${formatPrice(receiptInfo.finalAmount)}`);
  },

  printErrorMessage(errorMessage) {
    Console.print(errorMessage);
  },
}

export default OutputView;
