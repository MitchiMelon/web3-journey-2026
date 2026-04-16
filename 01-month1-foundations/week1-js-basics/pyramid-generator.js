function pyramid(str, num, value) {
  let result = "\n";
  let totalWidth = 2 * num - 1; 
  for (let i = 0; i < num; i++) {
    let rowNumber;
    if (value === false) {
      rowNumber = i + 1;
    } else {
      rowNumber = num - i;
    }
  let charsCount = 2 * rowNumber - 1;
  let spacesCount = (totalWidth - charsCount) / 2; 
  let spaces = " ".repeat(spacesCount);
  let chars = str.repeat(charsCount);
  let row = spaces + chars;
  result += row + "\n";  
  }
  return result;
}


console.log(pyramid("o", 4, false));
console.log(pyramid("p", 5, true));

Gradebook App

function getAverage(arr) {
  let sum = 0;
  let denominator = arr.length;
  for (const num of arr) {
    sum += num / denominator;
  }
  return sum;
}


function getGrade(score) {
  let grade = "";
  if (score === 100) grade = "A+";
  else if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";
  else grade = "F";
  return grade;
}


function hasPassingGrade(score) {
  return getGrade(score) !== "F";
}


function studentMsg(totalScores, studentScore) {
  let avg = getAverage(totalScores);
  let grade = getGrade(studentScore);
  let passed = hasPassingGrade(studentScore);
  if (passed) {
        return `Class average: ${avg}. Your grade: ${grade}. You passed the course.`;
    } else {
        return `Class average: ${avg}. Your grade: ${grade}. You failed the course.`;
    }
}


console.log(studentMsg([92, 88, 12, 77, 57, 100, 67, 38, 97, 89], 37));
console.log(studentMsg([15, 25, 35, 45, 55, 60, 70, 60], 75));
console.log(studentMsg([56, 23, 89, 42, 75, 11, 68, 34, 91, 19], 100));
