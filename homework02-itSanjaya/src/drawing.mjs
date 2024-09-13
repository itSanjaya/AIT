// drawing.js
import { writeFile } from 'node:fs';
import * as hoffy from '../src/hoffy.mjs';

let vrb = "";

//RootElement();

class RootElement {

    constructor(){

        this.name = "svg";

        this.attribute = {};

        this.children = [];

        this.attribute.xmlns = "http://www.w3.org/2000/svg";

    }

    recurrent(ctr, arra, obj, status){

        if (ctr < 1){

            return;

        }

        if (status == true){

            const vrb = arra.pop();

            this.attribute[vrb] = obj[vrb];

            this.recurrent(ctr-1,arra,obj,true);

        }

        else if (status == false){

            const vrb = arra.pop();

            delete this.attribute[vrb];

            this.recurrent(ctr-1,arra,obj,false);

        }
    }

    addAttrs(obj){

        const keyAr = Object.keys(obj);

        const sum = hoffy.filterWith(o => 
            !(Object.getOwnPropertyNames(this.attribute)).includes(o));

        const fArr = sum(keyAr);

        this.recurrent(fArr.length, fArr, obj, true);

    }

    removeAttrs(obj){

        const sum = hoffy.filterWith(o => 
            (Object.getOwnPropertyNames(this.attribute)).includes(o));

        const fArr = sum(obj);

        this.recurrent(fArr.length, fArr, obj, false);
    }

    addChild(child){

        this.children.push(child);

    }


    toString() {

        const aStr = Object.entries(this.attribute).reduce((p, atr) => {

            const [name, value] = atr;

            return name === 'content' ? `${p}`: `${p} ${name}="${value}"`;

        }, '');
  
      
        vrb = vrb + (`\n<${this.name}${aStr}>${this.name === 'text'? this.attribute.content: ''}`);

        
        Object.entries(this.children).reduce((p, atr) => {

          const [name, value] = atr;

          return `${p} ${name}="${value}"`;

        }, '');
        
        vrb = vrb + `\n</${this.name}>`;

        return vrb;
    }

    write(fname, path){

        const fl = this.toString();

        writeFile(fname, fl, (e) => {

          if (e){ throw e;}

        });

        path();

      }
}


class RectangleElement extends RootElement{

    constructor(atrx, atry, wid, hgt, fll){

        super();

        this.name = "rect";

        this.attribute = {};

        this.attribute["x"] = atrx;

        this.attribute["y"] = atry;

        this.attribute["width"] = wid;

        this.attribute["height"] = hgt;

        this.attribute["fill"] = fll;

   }
}

class TextElement extends RootElement{

    constructor(ax, ay, fs, fil ,con){

         super();   

         this.name = "text";

         this.attribute = {};

         this.attribute.x = ax;

         this.attribute.y = ay;

         this.attribute['font-size'] = fs;

         this.attribute.fill = fil;

         this.attribute.content = con;

     }
}

class GenericElement extends RootElement{

    constructor(name){

     super();

     this.name = name;

     this.attribute = {};

    }
 
    addAttr(nme, value){

     this.attribute[nme] = value;   

    }
 
    setAttr(nme, value){

     this.attribute[nme] = value;

 }
 }

 export{
    GenericElement,

    TextElement,

    RectangleElement,

    RootElement
};

// the following is used for testing
// create root element with fixed width and height
const root = new RootElement();
root.addAttrs({width: 800, height: 170, abc: 200, def: 400});
root.removeAttrs(['abc','def', 'non-existent-attribute']);

// create circle, manually adding attributes, then add to root element
const c = new GenericElement('circle');
c.addAttr('r', 75);
c.addAttr('fill', 'yellow');
c.addAttrs({'cx': 200, 'cy': 80});
root.addChild(c);

// create rectangle, add to root svg element
const r = new RectangleElement(0, 0, 200, 100, 'blue');
root.addChild(r);

// create text, add to root svg element
const t = new TextElement(50, 70, 70, 'red', 'wat is a prototype? 😬');
root.addChild(t);

// show string version, starting at root element
console.log(root.toString());

// write string version to file, starting at root element
root.write('test.svg', () => console.log('done writing!'));