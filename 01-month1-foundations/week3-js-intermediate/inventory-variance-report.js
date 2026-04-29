const expectedInventory = [
  { name: "Apples", quantity: 100 },
  { name: "Oranges", quantity: 50 },
  { name: "Bananas", quantity: 75 },
  { name: "Grapes", quantity: 30 }
];


const actualInventory = [
  { name: "Apples", quantity: 95 },
  { name: "Oranges", quantity: 55 },
  { name: "Bananas", quantity: 75 },
  { name: "Strawberries", quantity: 20 }
];


function generateInventoryVarianceReport(expectedInventory, actualInventory) {
  const expectedMapped = expectedInventory.map(product => product.name);
  const actualMapped = actualInventory.map(product => product.name);
  const productName = new Set([...expectedMapped, ...actualMapped]);
  
  const allNames = [...productName];
  const reportArray = allNames.map(productName => {
    const expectedObj = expectedInventory.find(item => item.name === productName);
    const expectedQty = expectedObj ? expectedObj.quantity : 0;


    const actualObj = actualInventory.find(item => item.name === productName);
    const actualQty = actualObj ? actualObj.quantity : 0;


    const variance = actualQty - expectedQty;
    let status = ""
    if (variance < 0) {
      status = "Missing"
    } else if (variance > 0) {
      status = "Overstocked"
    } else {
      status = "Accurate"
    }


    let variancePercent = expectedQty !== 0
      ? (variance / expectedQty) * 100
      : (actualQty > 0 ? Infinity : 0);
    variancePercent = Math.round(variancePercent * 100) / 100;
    
    const requiresAction = variance !== 0;


    return {
      productName: productName,
      expectedQuantity: expectedQty,
      actualQuantity: actualQty,
      variance: variance,
      variancePercent: variancePercent,
      status: status,
      requiresAction: requiresAction
    }
  })
  const sortedReport = reportArray.sort((a, b) => 
    Math.abs(b.variance) - Math.abs(a.variance)
  )
  return sortedReport;
};


// Test 1: Basic variance report
console.log("--- Test 1: Basic variance report ---");
const result1 = generateInventoryVarianceReport(expectedInventory, actualInventory);
console.log(result1);
console.log("Expected: 5 products with variance calculations");
console.log("");


// Test 2: Empty inventories
console.log("--- Test 2: Empty inventories ---");
const result2 = generateInventoryVarianceReport([], []);
console.log(result2);
console.log("Expected: Empty array []");
console.log("");


// Test 3: Perfect match (no variance)
console.log("--- Test 3: Perfect inventory match ---");
const perfectExpected = [
  { name: "Widget", quantity: 50 },
  { name: "Gadget", quantity: 30 }
];
const perfectActual = [
  { name: "Widget", quantity: 50 },
  { name: "Gadget", quantity: 30 }
];
const result3 = generateInventoryVarianceReport(perfectExpected, perfectActual);
console.log(result3);
console.log("Expected: All have 0 variance, status 'Accurate', requiresAction false");
console.log("");


// Test 4: Missing products (in expected but not in actual)
console.log("--- Test 4: Missing products ---");
const missingExpected = [
  { name: "Item1", quantity: 100 },
  { name: "Item2", quantity: 50 }
];
const missingActual = [
  { name: "Item1", quantity: 100 }
  // Item2 is missing!
];
const result4 = generateInventoryVarianceReport(missingExpected, missingActual);
console.log(result4);
console.log("Expected: Item2 shows actualQuantity 0, variance -50, status Missing");
console.log("");


// Test 5: Extra products (in actual but not in expected)
console.log("--- Test 5: Extra/unexpected products ---");
const extraExpected = [
  { name: "Item1", quantity: 100 }
];
const extraActual = [
  { name: "Item1", quantity: 100 },
  { name: "Item2", quantity: 50 }  // Not in expected!
];
const result5 = generateInventoryVarianceReport(extraExpected, extraActual);
console.log(result5);
console.log("Expected: Item2 shows expectedQuantity 0, variance 50, status Overstocked");
console.log("");


// Test 6: Overstocked items
console.log("--- Test 6: Overstocked items ---");
const overstockExpected = [
  { name: "Apple", quantity: 50 },
  { name: "Orange", quantity: 30 }
];
const overstockActual = [
  { name: "Apple", quantity: 60 },
  { name: "Orange", quantity: 30 }
];
const result6 = generateInventoryVarianceReport(overstockExpected, overstockActual);
console.log(result6);
console.log("Expected: Apple variance +10 (20%), status Overstocked");
console.log("");


// Test 7: Understocked items
console.log("--- Test 7: Understocked items ---");
const understockExpected = [
  { name: "Item1", quantity: 100 },
  { name: "Item2", quantity: 50 }
];
const understockActual = [
  { name: "Item1", quantity: 80 },
  { name: "Item2", quantity: 45 }
];
const result7 = generateInventoryVarianceReport(understockExpected, understockActual);
console.log(result7);
console.log("Expected: Item1 variance -20 (-20%), Item2 variance -5 (-10%)");
console.log("");


// Test 8: Sorting by absolute variance (largest discrepancies first)
console.log("--- Test 8: Sorted by largest variance ---");
const sortExpected = [
  { name: "Small", quantity: 100 },
  { name: "Medium", quantity: 100 },
  { name: "Large", quantity: 100 }
];
const sortActual = [
  { name: "Small", quantity: 99 },
  { name: "Medium", quantity: 90 },
  { name: "Large", quantity: 50 }
];
const result8 = generateInventoryVarianceReport(sortExpected, sortActual);
console.log(result8);
console.log("Expected: Large (-50) first, then Medium (-10), then Small (-1)");
console.log("");


// Test 9: Variance percent calculation
console.log("--- Test 9: Variance percent accuracy ---");
const percentExpected = [
  { name: "Product1", quantity: 100 },
  { name: "Product2", quantity: 50 }
];
const percentActual = [
  { name: "Product1", quantity: 50 },
  { name: "Product2", quantity: 60 }
];
const result9 = generateInventoryVarianceReport(percentExpected, percentActual);
console.log(result9);
console.log("Expected: Product1 -50%, Product2 +20%");
console.log("");


// Test 10: Division by zero handling (expected qty = 0)
console.log("--- Test 10: Division by zero handling ---");
const zeroExpected = [];
const zeroActual = [
  { name: "Surprise", quantity: 50 }
];
const result10 = generateInventoryVarianceReport(zeroExpected, zeroActual);
console.log(result10);
console.log("Expected: Variance percent = Infinity, status Overstocked");
console.log("");
