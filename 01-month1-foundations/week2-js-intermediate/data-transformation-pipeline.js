const inventory = [
  { name: "Apples", quantity: 50, pricePerUnit: 0.99 },
  { name: "Oranges", quantity: 30, pricePerUnit: 1.29 },
  { name: "Bananas", quantity: 100, pricePerUnit: 0.59 }
];


function createDataTransformer(transformCallback) {
    return function(itemsArray) {
        return itemsArray.map(transformCallback);
    };
}


// Test 1: Add total cost
const addTotalCost = createDataTransformer(
  (item) => ({
    ...item,
    totalCost: item.quantity * item.pricePerUnit
  })
);
console.log(addTotalCost(inventory));
// Expected: Each item has totalCost field


// Test 2: Convert to cents
const convertToCents = createDataTransformer(
  (item) => ({
    ...item,
    priceInCents: Math.round(item.pricePerUnit * 100)
  })
);
console.log(convertToCents(inventory));
// Expected: Each item has priceInCents field


// Test 3: Add stock status
const addStockStatus = createDataTransformer(
  (item) => ({
    ...item,
    stockStatus: item.quantity < 40 ? "Low" : "Adequate"
  })
);
console.log(addStockStatus(inventory));
// Expected: Oranges=Low, others=Adequate


// Test 4: Create summary
const createSummary = createDataTransformer(
  (item) => ({
    name: item.name,
    totalCost: (item.quantity * item.pricePerUnit).toFixed(2)
  })
);
console.log(createSummary(inventory));
// Expected: Only name and totalCost


// Test 5: Chain transformers
const withTotalCost = createDataTransformer(
  (item) => ({ ...item, totalCost: item.quantity * item.pricePerUnit })
);
const withStatus = createDataTransformer(
  (item) => ({ ...item, status: item.quantity > 50 ? "High stock" : "Normal" })
);
console.log(withStatus(withTotalCost(inventory)));
// Expected: Both totalCost AND status


// Test 6: Empty array
console.log(createDataTransformer((item) => ({ ...item, processed: true }))([]));
// Expected: []


// Test 7: Original not modified
const originalInventory = [
  { name: "Widget", quantity: 10, pricePerUnit: 5.00 }
];
const modifyTransform = createDataTransformer(
  (item) => ({ ...item, newField: "test" })
);
const transformed = modifyTransform(originalInventory);
console.log("Original:", originalInventory); // No newField
console.log("Transformed:", transformed);    // Has newField
