const extractProductsToPurchase = (productsToPurchase) => {
  return productsToPurchase.map((productInfo) => {
    const parsedProduct = productInfo.slice(1, -1).split('-').map((item) => item.trim());
    const name = parsedProduct[0];
    const quantity = Number(parsedProduct[1]);

    return { name, quantity };
  });
}

export default extractProductsToPurchase;
