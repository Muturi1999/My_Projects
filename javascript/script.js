// function getBooks(){
//     return [{
//         title: "Mocking Bird",
//         author: "Mike Muturi",
//         pages: 527,
//     },
//     { title:"The Coding Book", author: "Muturi Mike", pages: 300}
// ]
// }

// // // Destructuring
// // const books = getBooks();
// // const [firstBook, secondBook, thirdBook] = books;
// // console.log(firstBook.title);
// // console.log(secondBook.author); 
// // Array Map Methond 
// const books = getBooks();
//  const x = [1,2,3,4,5].map((el) => el * 2);
//  console.log(x);

//  const titles = books.map((book) => book.title);
//  console.log(titles);

// //  Array Filter Method
// const longBooks = books.filter((book) => book.title.length > 10);
// longBooks;

// // Array reduce Method
// const pagesAllBooks = books.reduce((sum, book) => sum + book.pages, 0);
// pagesAllBooks;

// // Array Sort Method
// const arr = [3,7,9,1,6];
// const sorted = arr.slice().sort((a, b) => a - b); //a-b means ascending order , b- a means descending order
// sorted;
// arr;


// const sortedByPages = books.slice().sort((a, b) => a.pages - b.pages);
// sortedByPages;

// // working with immutable data

// const newBooks = {
//     id: 6,
//     tittle: "Harry porter",
//     author: "J.K. Rowling",
// }
// const booksAfterAdd = [...books, newBooks];
// booksAfterAdd;
// // removing an item from an array
// const booksAfterRemove = booksAfterAdd.filter((book) => book.id !== 6);
// booksAfterRemove;
// // updating an item in an array
// const booksAfterUpdate = booksAfterRemove.map((book) => {
//     if (book.id === 1) {
//         return { ...book, title: "Updated Mocking Bird" };
//     }
//     return book;
// });
// booksAfterUpdate;

// Asychronous javascript promises
fetch("https://jsonplaceholder.typicode.com/todos/1").then((response) => {  
    return response.json();
}
).then((data) => {
    console.log(data);
}
).catch((error) => {
    console.error("Error fetching data:", error);
}
).finally(() => {
    console.log("Fetch operation completed.");
}
);
// Async/Await syntax
async function fetchPosts() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        console.log("Fetch operation completed.");
    }
}
fetchPosts(); 