const inventory = [];


function findProductIndex(prodName) {
    let searchName = prodName.toLowerCase();
    for (let i = 0; i < inventory.length; i++) {
        if (inventory[i].name === searchName) {
            return i;
        }
    }
    return -1;
}


function addProduct(prodObject) {
    let index = findProductIndex(prodObject.name);
    if (index !== -1) {
      inventory[index].quantity += prodObject.quantity;
      console.log(prodObject.name.toLowerCase() + " quantity updated");
    } else {
      let newProduct = {
        name: prodObject.name.toLowerCase(),
        quantity: prodObject.quantity
      };
      inventory.push(newProduct);
      console.log(newProduct.name + " added to inventory");
    }
}


function removeProduct(prodName, qty) {
    let index = findProductIndex(prodName);
    let lowerName = prodName.toLowerCase();
    if (index === -1) {
        console.log(lowerName + " not found");
        return;
    }
    let item = inventory[index];
    if (qty > item.quantity) {
        console.log("Not enough " + lowerName + " available, remaining pieces: " + item.quantity);
        return;
    }
    item.quantity -= qty;
    console.log("Remaining " + lowerName + " pieces: " + item.quantity);
    if (item.quantity === 0) {
        inventory.splice(index, 1);
    }
}


console.log(findProductIndex("Flour"));
console.log(addProduct({name: "FLOUR", quantity: 5}));
console.log(removeProduct("FLOUR", 5));