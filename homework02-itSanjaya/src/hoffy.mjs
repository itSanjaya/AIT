// hoffy.js

function getEvenParam(...args){

    if(args.length>0){ 

        const test = args.filter(function(element, index){

        return (index % 2 === 0);

        }); 

        return test;

    }
    else{

        return [];

    }
}


function filterWith(fn){

    return function(arr){

      const result = arr.filter(fn);

      return result;

    };
}

function repeatCall(fn, n, args){

    if (n === 0){ return;}

    fn(args);

    repeatCall(fn, n-1, args);

}

const singleRowtoObj = (headers,row) => {

    return row.reduce((obj, val, i) => {

        return {...obj, [headers[i]]: val};

    }, {});
}

const rowsToObjects = ({headers,rows}) => {

    return rows.map(row => singleRowtoObj(headers,row));

}

// const maybe = (fn) =>{

// }

// const largerFn = (fn, gn) =>{

// }

// const limitCallsDecorator = (fn, n) =>{

// }

export{

    filterWith,

    repeatCall,

    getEvenParam,

    rowsToObjects,

    // maybe,

    // largerFn,

    // limitCallsDecorator

};