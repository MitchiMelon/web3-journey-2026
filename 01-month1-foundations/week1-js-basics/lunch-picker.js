const lunches = [];


function addLunchToEnd(arr, lunchItem) {
 arr.push(lunchItem);
 console.log(`${lunchItem} added to the end of the lunch menu.`);
 return arr;
}


function addLunchToStart(arr, lunchItem) {
 arr.unshift(lunchItem);
 console.log(`${lunchItem} added to the start of the lunch menu.`);
 return arr;
}


function removeLastLunch(arr) {
 if (arr.length === 0) {
   console.log("No lunches to remove.");
 } else {
   const removed = arr.pop();
   console.log(`${removed} removed from the end of the lunch menu.`);
 }
 return arr;
}


function removeFirstLunch(arr) {
 if (arr.length === 0) {
   console.log("No lunches to remove.");
 } else {
   const removed = arr.shift();
   console.log(`${removed} removed from the start of the lunch menu.`);
 }
 return arr;
}


function getRandomLunch(arr) {
 if (arr.length === 0) {
   console.log("No lunches available.");
 } else {
   const randomItem = arr[Math.floor(Math.random() * arr.length)];
   console.log(`Randomly selected lunch: ${randomItem}`);
 }
}


function showLunchMenu(arr) {
 if (arr.length === 0) {
   console.log("The menu is empty.");
 } else {
   console.log(`Menu items: ${arr.join(", ")}`);
 }
}


console.log(showLunchMenu(["Greens", "Corns", "Beans"]));