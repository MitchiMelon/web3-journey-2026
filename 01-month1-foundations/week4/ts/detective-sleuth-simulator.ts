function useMagnifyingGlass(): string {
  return 'I will use my magnifying glass.';
}


function determineCulprit(): number {
  return Math.floor(Math.random() * 2 + 1);
}


function doSleuthing(
  numberOfClues: number,
  clue1: string,
  clue2: string,
  suspect1: string,
  suspect2: string
): string {
  console.log('I am a famous detective and I will solve the crime.');
  const magnifyingGlassMessage = useMagnifyingGlass();
  console.log(magnifyingGlassMessage);


  console.log('Now I consider the first clue: ', clue1);
  console.log('Now I consider the second clue: ', clue2);


  const culpritNumber: number = determineCulprit();
  if (culpritNumber === 1) {
    return suspect1;
  } else if (culpritNumber === 2) {
    return suspect2;
  }
  return "I couldn't figure out who drank the priceless milk. :( :(";
}


let answer: string = doSleuthing(
  2,
  'The parrot heard everything!',
  'All the doors and windows were shut from the INSIDE.',
  'Burglar Bob',
  'Saint Sam'
);


console.log('The culprit was none other than ', answer, '!');
