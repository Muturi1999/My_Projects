// import { current } from '@reduxjs/toolkit';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';



const pizzaData = [
  {
    name: "Focaccia",
    description: "A classic Italian flatbread, perfect as a starter or side dish.",
    image: "pizzas/pizza1.png",
    price: 5.99,
    soldOut: false,
    ingredients: ["Flour", "Water", "Olive Oil", "Salt", "Yeast"],
  },
  {
    name: "Margherita Pizza",
    description: "A simple yet delicious pizza topped with fresh tomatoes, mozzarella cheese, and basil.",
    image: "pizzas/pizza2.png",
    price: 8.99,
    soldOut: false,
    ingredients: ["Tomatoes", "Mozzarella", "Basil", "Olive Oil", "Salt"],
  },
  {
    name: "Pepperoni Pizza",
    description: "A classic favorite with spicy pepperoni slices on a cheesy base.",
    image: "pizzas/pizza1.png",
    price: 9.99,
    soldOut: false,
    ingredients: ["Pepperoni", "Mozzarella", "Tomato Sauce", "Olive Oil"],
  },
  {
    name: "Vegetarian Pizza",
    description: "Loaded with fresh vegetables and topped with mozzarella cheese.",
    image: "pizzas/pizza2.png",
    price: 10.49,
    soldOut: false,
    ingredients: ["Bell Peppers", "Onions", "Mushrooms", "Olives", "Mozzarella"],
  },
  {
    name: "BBQ Chicken Pizza",
    description: "A smoky BBQ sauce base topped with grilled chicken and red onions.",
    image: "pizzas/pizza1.png",
    price: 11.49,
    soldOut: true,
    ingredients: ["BBQ Sauce", "Grilled Chicken", "Red Onions", "Mozzarella"],
  },
];

function App() {
  return (
    <div className="container">
      <Header />
      <Menu />
      <Footer />
    </div>
  );
}

function Header() {
//   const style = { color: "red", fontSize: "30px", textTransform: "uppercase" };
const style = {}
  return (
    <header className="header footer">
      <h1 style={style}>Fast React Pizza Co.</h1>
    </header>
  );
}

function Menu() {
  return (
    <main className="menu"> 
    <h2>Our Menu</h2>
    <ul className='pizzas'>   
{
pizzaData.map((pizza) => (
      <Pizza 
        key={pizza.name + pizza.price   } // Unique key for each pizza
       Pizza pizzaObj =  {pizza}

      />
    ))}
    </ul>
{/* 
      <Pizza 
      name="Pepperoni Pizza"
      description="Pepperoni, Mozzarella, Tomato Sauce, Olive Oil"
      image="pizzas/pizza1.png"
      price= {1200.99}
      />
    
    <Pizza 
      name="Vegetarian Pizza"
      description="Bell Peppers, Onions, Mushrooms, Olives, Mozzarella"
      image="pizzas/pizza2.png"
      price={ 1300.99}
    /> */}
    </main>
  );
}

function Pizza(props) {
  return (
    <li className='pizza' >
      <img src= {props.pizzaObj.image} 
      alt={props.pizzaObj.name} />
      <div>
      <h3>{props.pizzaObj.name}</h3>
      <p>{props.pizzaObj.description}</p>
      <span>{props.pizzaObj.price}</span>
    </div>
    </li>
  );
}

function Footer() {
    const hour = new Date().getHours();
    const openHour = 6;
    const closeHour = 22;
    const isOpen = hour >= openHour && hour < closeHour;
    console.log(isOpen)

    // if (hour >= openHour && hour <= closeHour) alert("We're currently open!"); 
    // else alert("Sorry, we're closed. Please come back later!");

  return  (
  <footer className='footer'> {isOpen && <div>
    <div className='order'>
      <p>We're currently open! until {closeHour}:00. Come visit us!</p>
      <button className='btn'>Order Now</button>
    </div>
    {/* <p className='footer-text'>We're happy to serve you!</p> */}
  </div> } </footer>
)

//   return  (
//   <footer className='footer'> {isOpen (
//     <div className='order'>
//       <p>We're currently open! until {closeHour}:00. Come visit us!</p>
//       <button className='btn'>Order Now</button>
//     </div>
//   )} </footer>
// )
}




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
