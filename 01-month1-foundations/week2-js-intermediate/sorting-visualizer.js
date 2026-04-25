function generateElement() {
  return Math.floor(Math.random() * 100) + 1;
}


function generateArray() {
  const arr = [];
  for (let i = 0; i < 5; i++) {
    arr.push(generateElement());
  }
  return arr;
}


function generateContainer() {
  return document.createElement("div");
}


function fillArrContainer(container, arr) {
  container.innerHTML = "";
  for (let i = 0; i < arr.length; i++) {
    const span = document.createElement("span");
    span.textContent = arr[i];
    container.appendChild(span);
  }
}


function isOrdered(a, b) {
  return a <= b;
}


function swapElements(arr, index) {
  if (!isOrdered(arr[index], arr[index + 1])) {
    const temp = arr[index];
    arr[index] = arr[index + 1];
    arr[index + 1] = temp;
  }
}


function highlightCurrentEls(container, index) {
  const children = container.children;
  if (children[index]) {
    children[index].style.border = "2px dashed red";
  }
  if (children[index + 1]) {
    children[index + 1].style.border = "2px dashed red";
  }
}


let currentArray = [];


document.getElementById("generate-btn").addEventListener("click", () => {
  currentArray = generateArray();
  const startingArray = document.getElementById("starting-array");
  fillArrContainer(startingArray, currentArray);


  const arrayContainer = document.getElementById("array-container");
  
  const children = Array.from(arrayContainer.children);
  children.forEach(child => {
    if (child.id !== "starting-array") {
      child.remove();
    }
  });
});


document.getElementById("sort-btn").addEventListener("click", () => {
  if (currentArray.length === 0) return;


  const arrayContainer = document.getElementById("array-container");
  const startingArray = document.getElementById("starting-array");


  const children = Array.from(arrayContainer.children);
  children.forEach(child => {
    if (child.id !== "starting-array") {
      child.remove();
    }
  });


  const workingArr = [...currentArray];


  fillArrContainer(startingArray, workingArr);
  highlightCurrentEls(startingArray, 0);


  let swapped;
  do {
    swapped = false;
    
    for (let j = 0; j < workingArr.length - 1; j++) {
      
      if (!isOrdered(workingArr[j], workingArr[j + 1])) {
        swapElements(workingArr, j);
        swapped = true;
      }
      
      const stepDiv = generateContainer();
      fillArrContainer(stepDiv, workingArr);


      if (j < workingArr.length - 2) {
        highlightCurrentEls(stepDiv, j + 1);
      } else if (swapped) {
        highlightCurrentEls(stepDiv, 0);
      }
      
      arrayContainer.appendChild(stepDiv);
    }
  } while (swapped);
});
