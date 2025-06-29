// Here we tell javascript that we want to use the declarative style of programming
// This means that we will use functions to describe what we want to do, rather than how
// This is a more functional style of programming, and it is more declarative than imperative
// This is a more modern style of programming, and it is more readable and maintainable
// It is also more efficient, as it allows us to use higher-order functions and other functional

import { useState } from "react";

// programming techniques to write more concise and expressive code 
 function Question(props){
    const question = props.question;;
    const [upvotes, setUpvotes] = useState(0);
    const [downvotes, setDownvotes] = useState(0);
     const upvote = setUpvotes((v) => v + 1);
     const downvote = setDownvotes((v) => v - 1);
    return (
        <div>
            <h2>{question.title}</h2>
            <p>{question.text}</p>
            <button onClick={upvote}>Upvote</button>
            <span>Upvotes: {upvotes}</span>
            <button onClick={downvote}>Downvote</button>
            <span>Downvotes: {downvotes}</span>
        </div>
    );  
 }
 
 