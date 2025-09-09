// // import { useState } from "react";
// import { useState } from "react";
// import { Fragment } from "react/jsx-runtime";
// // import { type MouseEvent } from "react";
// // import { Handler } from "leaflet";

// function ListGroup(){

//     const items = [
//         'New York',
//         'San Francisco',
//         'Tokyo',
//         'London',
//         'Paris'
//     ]
//     // let selectedIndex = 0;
//     const [selectedIndex, setSelectedIndex] = useState(-1)
//     // const arr = useState(-1);
//     // arr[0]
//     // arr[1]

//     // items = []

//     // if (items.length === 0)
//     //     return (
//     //         <>
//     //         <h1>List</h1>
//     //         <p>No item found</p>
//     //         </>
//     //     )

//     // // const message = items.length === 0? <p>No item found </p> : null;
//     // const getMessage = () => {
//     //     return items.length === 0? <p>No item found </p> : null
//     // }

//     // event Handler

// //    const handleClick = (event: MouseEvent) => console.log(event)
// return ( 
//     <Fragment>
//         {/* fragments can also be served with div or empty angle brackets */}

//         <h1>List</h1>
//             {items.length === 0? <p>No item found </p> : null}
//         {/* { getMessage()} */}
        
//         <ul className="list-group">
//             {
//                   items.map((item, index) => (
//                   <li className={ selectedIndex === index ? 'list-group-item active' : 'list-group-item' }  key ={item} 
//                     // onClick= { () => console.log(item, index)} 
//                 //  onClick={handleClick}
//                 onClick={() => selectedIndex = index}
//                     > {item}</li>
//                 )
//             )}
//         </ul>
//     </Fragment>
// );
// }

// export default ListGroup;


import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
// import { type MouseEvent } from "react";
// import { Handler } from "leaflet";

function ListGroup(){

    const items = [
        'New York',
        'San Francisco',
        'Tokyo',
        'London',
        'Paris'
    ]

    // let selectedIndex = 0;  ❌ don't use this
    const [selectedIndex, setSelectedIndex] = useState(-1)
    // const arr = useState(-1);
    // arr[0]
    // arr[1]

    // items = []

    // if (items.length === 0)
    //     return (
    //         <>
    //         <h1>List</h1>
    //         <p>No item found</p>
    //         </>
    //     )

    // // const message = items.length === 0? <p>No item found </p> : null;
    // const getMessage = () => {
    //     return items.length === 0? <p>No item found </p> : null
    // }

    // event Handler
    // const handleClick = (event: MouseEvent) => console.log(event)

    return ( 
        <Fragment>
            {/* fragments can also be served with div or empty angle brackets */}

            <h1>List</h1>
                {items.length === 0? <p>No item found </p> : null}
            {/* { getMessage()} */}
            
            <ul className="list-group">
                {
                    items.map((item, index) => (
                        <li 
                            className={ selectedIndex === index ? 'list-group-item active' : 'list-group-item' }  
                            key={item}
                            // onClick={() => console.log(item, index)} 
                            // onClick={handleClick}
                            onClick={() => setSelectedIndex(index)}
                        > 
                            {item}
                        </li>
                    ))
                }
            </ul>
        </Fragment>
    );
}

export default ListGroup;
