// report.js

import { readFile } from 'fs';

import * as sfm from '../src/sfmovie.mjs';


const makeArray = (words) => {

    const fsplit = words.slice(0, words.indexOf("\n")).split(",");

    const ssplit = words.slice(words.indexOf("\n") + 1).split("\n");
  
    const ord = ssplit.map(function (row) {

    const comp = row.split(/,(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))/);

    const en = fsplit.reduce(function (object, header, index) {

      object[header] = comp[index];

      return object;

    }, {});

    return en;

    });

    return ord;

  }

  const test = (intm, fname, callback)=>{

    readFile(fname, 'utf8', function(e, info){

      if(e){

        throw(e);

      }

      intm = makeArray(info); 

      callback(intm); 

    });

  }


const final = (info) => {

    const lff = sfm.longestFunFact(info);

    const gm = sfm.getMovies2021(info);

    const gpc = sfm.getProductionCompany(info);

    const actors = sfm.mostPopularActors(info);

    console.log("* The movie", lff['Title'], "has the longest fun facts, it was filmed in", lff['Release Year']);

    console.log("* The movies filmed in 2021 are: ", gm.toString());

    console.log("* Three of the production companies are: ", gpc[0] + ",", gpc[1]+",", gpc[2]);

    }

function main(){

    const firstarg = '';

    const secondarg = process.argv[2];

    if (typeof (secondarg) !== 'undefined') {

        test(firstarg, secondarg, final);

    }
    
}
main();

