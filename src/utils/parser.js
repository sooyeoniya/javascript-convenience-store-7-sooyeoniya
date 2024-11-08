const splitEachProduct = (productsToPurchase) => {
  return productsToPurchase.split(',').map((product) => product.trim());
}

const extractProductsToPurchase = (productsToPurchase) => {
  return productsToPurchase.map((productInfo) => {
    const parsedProduct = productInfo.slice(1, -1).split('-').map((item) => item.trim());
    const name = parsedProduct[0];
    const quantity = Number(parsedProduct[1]);

    return { name, quantity };
  });
}

const parser = {
  splitEachProduct,
  extractProductsToPurchase,
}

export default parser;
