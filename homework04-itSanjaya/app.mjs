// app.mjs

import express from 'express';
import session from 'express-session';
import url from 'url';
import path from 'path';


const Dragon = 
[{dragonName:'Syrax', rider: 'Rhaenyra', identification: 'giant yellow-scaled dragon', house: 'Targaryen'},
{dragonName:'Caraxes', rider: 'Daemon', identification: 'large red dragon', house: 'Targaryen'},
{dragonName:'Seasmoke', rider: 'Laenor', identification: 'silver-gray dragon', house: 'Velaryon'},
{dragonName:'Meleys', rider: 'Rhaenys', identification: 'swift red and pink dragon', house: 'Targaryen'}];


const app = express();

const dirname = path.dirname(url.fileURLToPath(import.meta.url));

const sessionOptions = {
	secret: 'secrets of targaryen',
	resave: true,
	saveUninitialized: true,
    count : 0
};

app.use(session(sessionOptions));

app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: false}));

const houseDragon = () => {
    app.use(function(req, res, next){
        const variab = req.get('cookie');
        req.myCookies = {};

        if (variab !== undefined){
            const params = (variab.split(";")).map(cookie => cookie.split("="));
            params.reduce(function(obj, cookie){
                req.myCookies[cookie[0]] = cookie[1];
            }, {});
        }
        next();
    });

    app.use(function(req, res, next){
        const rbody = req.body;
        const rquery = req.query;

        if (req.get('cookie') !== undefined){
            const cook = (req.get('cookie')).split(";").map(cookie => cookie.split("="));

            console.log(`   Request Method: ${req.method}
            \n   Request Path: ${req.path};
            \n   Request Query: `, rbody, `
            \n   Request Body: `, rquery, `
            \n   Request Cookies:`, cook 
            );
        }
        next();
    });

    app.use(express.static(path.join(dirname, 'public')));

    app.get('/test-cookies', (req, res) => {
        res.append('Set-Cookie', 'bestCookie=oatmeal');
        res.append('Set-Cookie', 'bestBreakfast=ramen');
        res.send('test to make cookies');
      });

      app.use((req, res, next) => {
        if (!req.session.count) {
          req.session.count = 0;
        }
        next();
      });
      Icecream = {flavor: 'chocolate', base: 'oat'};

      app.get('/', (req, res)=>{
        const inp = req.query.inp || false;
        res.render('index', {Dragon: inp ? Dragon.filter(drgn => drgn.house === inp) : Dragon});
    });

    app.get('/stats', (req,res)=>{
        res.render('stats', {count:req.session.count});
    });

    app.get('/dragon', (req, res) =>{
        res.render('dragon');
    });

    app.post('/dragon', (req, res)=>{
        const newDragon = {dragonName: req.body.DragonName, rider: req.body.Rider, identification:req.body.Identification, house:req.body.House};
        Dragon.push(newDragon);
        req.session.count += 1;
        res.redirect('/');
    });
    app.get('/flavors', (req, res) => {
        IceCream.find((err, found) => {
          return found;
        });
      })

};


app.use(function(req, res, next){
    houseDragon();
    next();
});

app.listen(3000);