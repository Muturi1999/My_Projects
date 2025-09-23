// import { useState } from "react";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

// const average = (arr) =>
//   arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// function NavBar(){
//   const [query, setQuery] = useState("");

//   return  <nav className="nav-bar">
//         < Logo/>
//         <Search/>
//         <NumResult/>
//       </nav>
// }
// function Logo(){
//   return (
//            <div className="logo">
//           <span role="img">🍿</span>
//           <h1>usePopcorn</h1>
//         </div>
//   )
// }

// function Search(){
//   const [query, setQuery] = useState("");

//   return (
//           <input
//           className="search"
//           type="text"
//           placeholder="Search movies..."
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//         />
//   )
// }

// function NumResult(){
//   return (
//           <p className="num-results">
//           Found <strong>X</strong> results
//         </p>
//   )
// }
// function Main(){

//   return (
//       <main className="main">

//       <ListBox/>
//       <WatchedBox/>
//       </main>
//   )
// }

// export default function App() {


//   return (
//     <>
//       <NavBar/>
//       <Main/>
//     </>
//   );
// }


// function ListBox(){
//   const [isOpen1, setIsOpen1] = useState(true);
//   return (
//             <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen1((open) => !open)}
//           >
//             {isOpen1 ? "–" : "+"}
//           </button>
//           {isOpen1 && (
//             <MovieList/>
//           )}
//         </div>
//   )
// }
// function MovieList(){
//     const [movies, setMovies] = useState(tempMovieData);

//   return (
//                <ul className="list">
//               {movies?.map((movie) => (
//                 <Movie movie={movie} key={movie.imdbID}/>
//               ))}
//             </ul>
//   )
// }
// function Movie({movie}){
//   return (
//            <li key={movie.imdbID}>
//                   <img src={movie.Poster} alt={`${movie.Title} poster`} />
//                   <h3>{movie.Title}</h3>
//                   <div>
//                     <p>
//                       <span>🗓</span>
//                       <span>{movie.Year}</span>
//                     </p>
//                   </div>
//                 </li>
//   )
// }
// function WatchedBox(){

//   const [watched, setWatched] = useState(tempWatchedData);
//   const [isOpen2, setIsOpen2] = useState(true);

//   const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
//   const avgUserRating = average(watched.map((movie) => movie.userRating));
//   const avgRuntime = average(watched.map((movie) => movie.runtime));
//   return (
//            <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//           >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//             <>
//               <div className="summary">
//                 <h2>Movies you watched</h2>
//                 <div>
//                   <p>
//                     <span>#️⃣</span>
//                     <span>{watched.length} movies</span>
//                   </p>
//                   <p>
//                     <span>⭐️</span>
//                     <span>{avgImdbRating}</span>
//                   </p>
//                   <p>
//                     <span>🌟</span>
//                     <span>{avgUserRating}</span>
//                   </p>
//                   <p>
//                     <span>⏳</span>
//                     <span>{avgRuntime} min</span>
//                   </p>
//                 </div>
//               </div>

//               <ul className="list">
//                 {watched.map((movie) => (
//                   <li key={movie.imdbID}>
//                     <img src={movie.Poster} alt={`${movie.Title} poster`} />
//                     <h3>{movie.Title}</h3>
//                     <div>
//                       <p>
//                         <span>⭐️</span>
//                         <span>{movie.imdbRating}</span>
//                       </p>
//                       <p>
//                         <span>🌟</span>
//                         <span>{movie.userRating}</span>
//                       </p>
//                       <p>
//                         <span>⏳</span>
//                         <span>{movie.runtime} min</span>
//                       </p>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </div>
//   )
// }

import { useState } from "react";

// Sample data
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

// Utility
const average = (arr) => arr.reduce((acc, cur) => acc + cur, 0) / arr.length || 0;

// ---------- Components ----------
function NavBar({ query, setQuery, resultsCount }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} setQuery={setQuery} />
      <NumResults count={resultsCount} />
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img" aria-label="popcorn">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ count }) {
  return (
    <p className="num-results">
      Found <strong>{count}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

// Reusable collapsible box
function Box({ title, isOpen, setIsOpen, children }) {
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && (
        <>
          {title && <h2>{title}</h2>}
          {children}
        </>
      )}
    </div>
  );
}

function MovieList({ movies }) {
  return (
    <ul className="list">
      {movies.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <p>
            <span>🗓</span> {movie.Year}
          </p>
        </li>
      ))}
    </ul>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((m) => m.imdbRating));
  const avgUserRating = average(watched.map((m) => m.userRating));
  const avgRuntime = average(watched.map((m) => m.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <p><span>#️⃣</span> {watched.length} movies</p>
      <p><span>⭐️</span> {avgImdbRating.toFixed(1)}</p>
      <p><span>🌟</span> {avgUserRating.toFixed(1)}</p>
      <p><span>⏳</span> {avgRuntime.toFixed(0)} min</p>
    </div>
  );
}

function WatchedList({ watched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <li key={movie.imdbID}>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <p><span>⭐️</span> {movie.imdbRating}</p>
          <p><span>🌟</span> {movie.userRating}</p>
          <p><span>⏳</span> {movie.runtime} min</p>
        </li>
      ))}
    </ul>
  );
}

// ---------- Main App ----------
export default function App() {
  const [query, setQuery] = useState("");
  const [movies] = useState(tempMovieData);
  const [watched] = useState(tempWatchedData);
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <>
      <NavBar query={query} setQuery={setQuery} resultsCount={movies.length} />
      <Main>
        <Box isOpen={isOpen1} setIsOpen={setIsOpen1}>
          <MovieList movies={movies} />
        </Box>

        <Box isOpen={isOpen2} setIsOpen={setIsOpen2}>
          <WatchedSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box>
      </Main>
    </>
  );
}
