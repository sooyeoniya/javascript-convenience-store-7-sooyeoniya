import { DELIMITER } from '../constants/constants.js';

export const splitEachProduct = (productsToPurchase, delimiter = DELIMITER) => {
  return productsToPurchase.split(delimiter).map((product) => product.trim());
}

export const formatItemName = (itemName) => {
  const ITEM_NAME_TAB_LENGTH = 4;
  if (itemName.length < ITEM_NAME_TAB_LENGTH) return `${itemName}\t`;
  return itemName;
}

export const formatPrice = (price) => {
  return price.toLocaleString('ko-KR');
}
