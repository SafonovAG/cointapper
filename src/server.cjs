
const express = require('express');
const fs = require('fs')
const cors = require('cors')
const app = express();
const PORT = 3000;
let base = {};
const bodyParser = require('body-parser')
// app.use(cors());
app.use(
    cors({
        origin: ["http://localhost:3000","http://localhost:5173"],
        methods: "GET,POST,PUT,DELTE",
        credentials: true
    })
);
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

fs.promises.readFile('./src/base.json').then(res => {
try {
    base = JSON.parse(res.toString())
} catch (e) {
    console.log(e);
}
})

app.get('/get',
   cors(),
   async function (req, res) {
      const userId = req.query.userid;
       console.log(base[userId]);
       if(userId && base[userId]) {
           // res.setHeader('content-type', 'application/json');
          res.json(base[userId]);
      } else {
          res.status(401);
          res.send({error: 'пользователь не найден'});
      }
    });

app.post('/set',
    async function (req, res) {
        const userId = req.body.userId;
        const data = req.body.data;
        if(userId) {
            base[userId] = data;
            await fs.promises.writeFile('./src/base.json', JSON.stringify(base), 'utf8')
            res.send({status: true});
        } else {
            res.status(401);
            res.send({error: 'данные не записаны'});
        }
    });

app.listen(PORT,
    function (err) {
        if (err) console.log(err);
        console.log("Server listening on PORT", PORT);
    });