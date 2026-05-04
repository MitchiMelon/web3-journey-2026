const products = [
  {
    name: 'fanny pack',
    price: '30',
    preOrder: 'true',
  },
  {
    name: 'beanie',
    price: '15',
    preOrder: 'false',
  },
  {
    name: 'tote bag',
    price: '20',
    preOrder: 'false',
  },
  {
    name: 'shirt',
    price: '20',
    preOrder: 'true',
  },
  {
    name: 'hoodie',
    price: '43',
    preOrder: 'true',
  },
];


export default products;

import products from './products';


let shipping: number;
let taxPercent: number;
let taxTotal: number;
let total: number;
const shippingAddress: string = "BlackStone Street, A22, Capitol City, New York";


const productName: string = "hoodie";  


const product = products.find(p => p.name === productName);


if (!product) {
  console.log('Product not found');
} else {
  console.log(`Found: ${product.name} — $${product.price}`);


  if (product.preOrder === 'true') {
    console.log("We will send you a message when your product is on its way.");
  }


  if (Number(product.price) >= 25) {
    shipping = 0;
    console.log("We provide free shipping for this product");
  } else {
    shipping = 5;
  }


  if (shippingAddress.match("New York")) {
    taxPercent = 0.1;
  } else {
    taxPercent = 0.05;
  }


  taxTotal = Number(product.price) * taxPercent;
  total = Number(product.price) + taxTotal + shipping;


  console.log(`
Product:  ${product.name}
Address:  ${shippingAddress}
Price:    $${Number(product.price).toFixed(2)}
Tax:      $${taxTotal.toFixed(2)}
Shipping: $${shipping.toFixed(2)}
Total:    $${total.toFixed(2)}
`);
}