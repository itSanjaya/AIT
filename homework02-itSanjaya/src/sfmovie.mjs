// sfmovie.js

const longestFunFact = (data) =>{

    let idx = 0;

    let m = 0;

     for(let i = 0; i < data.length;i++){

      const ffa = data[i]['Fun Facts'];


      if(ffa !== undefined && ffa.length > m){

        m = ffa.length;

        idx = i;

      }

     }

     return(data[idx]);

}

const getMovies2021 = (data) =>{

  const obj = []; 

  let ctr=0;

   for(let i = 0; i < data.length; i++){

    const ry = data[i]["Release Year"];

     if (ry == 2021 && !(obj.includes(data[i]['Title']))){

      obj[ctr] = data[i]['Title'];

      ctr++;

    }

  }
  return obj;
}

const getProductionCompany = (data)=>{

    let ctr = 0;

    const obj = [];

    for(let i =0; i<data.length;i++){

      const pc = data[i]['Production Company'];

      if(pc !== undefined && !obj.includes(pc)){

        obj[ctr] = pc;

        ctr = ctr+1;
      }
    }
    return obj;
  }

  const mostPopularActors = (data) => {

    const obj = {};

    for(let i=0; i<data.length; i++){

      const fActor = data[i]['Actor 1'];

      const sActor = data[i]['Actor 2'];

      const tActor = data[i]['Actor 3'];
  
      
      if((fActor !== undefined && fActor.length>0) && !(fActor in obj)){

        obj[fActor] = 1;

      }
      else if (fActor in obj){

        obj[fActor]++;

      }
  
      if((sActor!==undefined && sActor.length > 0) && !(sActor in obj)){

        obj[sActor] = 1;

      }
      else if (sActor in obj){

        obj[sActor]++;

      }
  
      if((tActor!==undefined && tActor.length>0) && !(tActor in obj)){

        obj[tActor] = 1;

      }
      else if (tActor in obj){

        obj[tActor]++;

      }

    }

    const arranged = Object.keys(obj).sort(function(x,y){return obj[y]-obj[x];});

    return([[arranged[0], obj[arranged[0]]], [arranged[1], obj[arranged[1]]], [arranged[2], obj[arranged[2]]]]);
  }


  export{

    longestFunFact,

    getMovies2021,

    getProductionCompany,

    mostPopularActors

};