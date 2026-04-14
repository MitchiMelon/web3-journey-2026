const questions = [
 {
   category: "General Knowledge",
   question: "What is the largest river by volume in the world?",
   choices: ["Amazon", "Nile", "Yangtze"],
   answer: "Amazon"
 },
 {
   category: "Astronomy",
   question: "Which of the following is considered a dwarf planet?",
   choices: ["Pluto", "Mars", "Moon"],
   answer: "Pluto"
 },
 {
   category: "Math",
   question: "What is 3/0 in JavaScript?",
   choices: ["0", "Infinity", "Undefined"],
   answer: "Infinity"
 },
 {
   category: "Geography",
   question: "Which country below has no land borders?",
   choices: ["Indonesia", "Norway", "Cuba"],
   answer: "Cuba"
 },
 {
   category: "Economy",
   question: "Which asset tends to deflate in value?",
   choices: ["US Dollar", "Bitcoin", "Gold"],
   answer: "Bitcoin"
 }
];


function getRandomQuestion(questions) {
 const randomIndex = Math.floor(Math.random() * questions.length);
 return questions[randomIndex];
}


function getRandomComputerChoice(choices) {
 const randomIndex = Math.floor(Math.random() * choices.length);
 return choices[randomIndex];
}


function getResults(question, computerChoice) {
 if (question.answer === computerChoice) {
   return "The computer's choice is correct!";
 } else {
   return `The computer's choice is wrong. The correct answer is: ${question.answer}`;
 }
}


const randomQuestion = getRandomQuestion(questions);
const computerChoice = getRandomComputerChoice(randomQuestion.choices);
const result = getResults(randomQuestion, computerChoice);


console.log("Category:", randomQuestion.category);
console.log("Question:", randomQuestion.question);
console.log("Computer's choice:", computerChoice);
console.log("Result:", result);