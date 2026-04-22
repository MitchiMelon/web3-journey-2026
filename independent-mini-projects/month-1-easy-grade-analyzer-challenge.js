/**
 * STUDENT GRADE ANALYZER
 * 
 * You have an array of student objects with their grades.
 * Complete these tasks:
 * 
 * 1. Count how many students passed (grade >= 60)
 * 2. Count how many students failed (grade < 60)
 * 3. Find the student with the highest grade
 * 4. Find the student with the lowest grade
 * 5. Calculate the class average
 * 6. Return a summary object with all results
 */

// TODO: Write a function: analyzeGrades(studentArray)
// It should return an object like:
// {
//   passed: 5,
//   failed: 3,
//   topStudent: "Grace",
//   lowestStudent: "Eve",
//   classAverage: 72.5,
//   passPercentage: 62.5
// }

const students = [
  { name: "Alice", grade: 95 },
  { name: "Bob", grade: 55 },
  { name: "Charlie", grade: 78 },
  { name: "Diana", grade: 88 },
  { name: "Eve", grade: 42 },
  { name: "Frank", grade: 72 },
  { name: "Grace", grade: 91 },
  { name: "Henry", grade: 59 }
];

function analyzeGrades(studentArray) {
  let passed = 0;
  let failed = 0;
  let sum = 0;
  let highestGrade = -Infinity;
  let topStudent = "";
  let lowestGrade = Infinity;
  let lowestStudent = "";
  
  for (let student of studentArray) {
    let grade = student.grade;
    let name = student.name;
    if (grade >= 60) {
      passed ++;
    } else {
      failed ++;
    }
    sum += grade;
    if (grade > highestGrade) {
      highestGrade = grade;
      topStudent = name;
    }
    if (grade < lowestGrade) {
      lowestGrade = grade;
      lowestStudent = name;
    }
  }
  let total = studentArray.length;
  let average = sum / total;
  let passPct = (passed / total) * 100

  return {
    passed: passed,
    failed: failed,
    topStudent: topStudent,
    lowestStudent: lowestStudent,
    classAverage: average,
    passPercentage: passPct
  }
}

console.log(analyzeGrades(students));
