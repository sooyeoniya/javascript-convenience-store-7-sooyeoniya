export const splitEachProduct = (productsToPurchase) => {
  return productsToPurchase.split(',').map((product) => product.trim());
}

export const extractProductsToPurchase = (productsToPurchase) => {
  return productsToPurchase.map((productInfo) => {
    const parsedProduct = productInfo.slice(1, -1).split('-').map((item) => item.trim());
    const name = parsedProduct[0];
    const quantity = Number(parsedProduct[1]);

    return { name, quantity };
  });
}

export const formatItemName = (itemName) => {
  if (itemName.length < 4) return `${itemName}\t`;
  return itemName;
}

export const formatPrice = (price) => {
  return price.toLocaleString('ko-KR');
}
