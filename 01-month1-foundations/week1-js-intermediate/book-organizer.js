const books = [
  {
    title: "Sapiens: A Brief History of Humankind",
    authorName: "Yuval Noah Harari",
    releaseYear: 2014
  },
  {
    title: "Thinking, Fast and Slow", 
    authorName: "Daniel Kahneman",
    releaseYear: 2011
  },
  {
    title: "How to Do Nothing: Resisting the Attention Economy",
    authorName: "Jenny Odell",
    releaseYear: 2019
  }
]


function sortByYear(book1, book2) {
  if (book1.releaseYear < book2.releaseYear) {
    return -1;
  } else if (book1.releaseYear > book2.releaseYear) {
    return 1;
  } else {
    return 0
  }
}


const filteredBooks = books.filter(book => book.releaseYear <= 2015);


filteredBooks.sort(sortByYear);
