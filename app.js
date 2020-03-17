const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express();
var cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//create connection
const db = mysql.createConnection({
  host: '203.154.83.241',
  user: 'root',
  password: '1234',
  database: 'ProjectSA'
});
function gennumber(num) {
  var n = 0;
  var string = "" + num;
  var pad = "0000";
  n = pad.substring(0, pad.length - string.length) + string;
  num++;
  return n;
}
//Connect
db.connect((err) => {
  if (err) {
    throw err
  }
  var time = '20/12/2020'
  console.log(time.substring(0, 2));
  console.log(time.substring(3, 5));
  console.log(time.substring(6, 10));
  console.log('Mysql Connect...');
})
//Get Data
app.post('/getdata', (req, res) => {
  let data = req.body
  let username = data.username
  let password = data.password
  console.log(data.username);
  let sql = 'SELECT * FROM user WHERE username = ? and password = ?'
  console.log(sql)
  let query = db.query(sql, [username, password], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({ Message: 'ERROR' })
    } else {
      console.log(result.length)
      res.send({ result, Message: 'OK' })
    }
  })
})

// ค้นหาบิล
app.post('/searchbill', (req, res) => {
  let data = req.body
  let sql = 'SELECT * FROM bill WHERE idbill = ?'
  console.log(sql)
  let query = db.query(sql, [data.idbill], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({ Message: 'ERROR' })
    } else {
      console.log(result.length)
      res.send({ result, Message: 'OK' })
    }
  })
})
// ค้นหาบิลเคลม
app.post('/searchbillclaim', (req, res) => {
  let data = req.body
  let sql = 'SELECT * FROM billclaim WHERE billid = ?'
  console.log(data)
  let query = db.query(sql, [data.idbill], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      let checkwarranty = 'SELECT warranty,date FROM bill WHERE idbill = ?'
      let query = db.query(checkwarranty, [data.idbill], (err, result) => {
        console.log(result);

        res.send({ result, Message: 'OK' })
        // res.send({ Message: 'OK' })
      })
    } else {
      res.send({ Message: 'ERROR' })
    }
  })
})


//check warranty
app.post('/checkwarranty', (req, res) => {
  let data = req.body
  let sql = 'SELECT warranty FROM bill WHERE idbill = ?'
  console.log(sql)
  let query = db.query(sql, [data.idbill], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({ Message: 'OK' })
    } else {
      console.log(result.length)
      res.send({ Message: 'ERROR' })
    }
  })
})

//Insert Data
app.post('/add', (req, res) => {
  let data = req.body
  console.log(data)
  let sql = 'INSERT INTO user SET ?'
  let query = db.query(sql, data, (err, result) => {
    if (err) throw err;
    console.log(result)
    res.send('Add  Auto Data...')
  })
})

//Insert Bill
app.post('/addbill', (req, res) => {
  let count = 'SELECT  idbill FROM bill'
  let querycount = db.query(count, (err, result) => {
    if (err) throw err;
    let data = req.body
    data.idbill = `A${gennumber(result.length + 1)}`
    let sql = 'INSERT INTO bill SET ?'
    let query = db.query(sql, data, (err, result) => {
      if (err) throw err;
      console.log(result)
      res.send({ message: 'OK' })
    })
  })
})

//Insert BillClaim
app.post('/addclaim', (req, res) => {
  let count = 'SELECT  id FROM billclaim'
  let querycount = db.query(count, (err, result) => {
    if (err) throw err;
    let data = req.body
    data.idbill = `C${gennumber(result.length + 1)}`
    let sql = 'INSERT INTO billclaim SET ?'
    let query = db.query(sql, data, (err, result) => {
      if (err) throw err;
      console.log(result)
      res.send({ message: 'OK' })
    })
  })
})

//getCheckStatus for User
app.post('/cheack', (req, res) => {
  let data = req.body
  let sql = 'SELECT * FROM billclaim WHERE fristname = ?'
  console.log(sql)
  let query = db.query(sql, [data.fristname], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({ Message: 'ERROR' })
    } else {
      res.send({ result, Message: 'OK' })
    }
  })
})

//getCheckStatus for admin
app.get('/admin', (req, res) => {
  let sql = 'SELECT * FROM billclaim'
  console.log(sql)
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({ Message: 'ERROR' })
    } else {
      res.send({ result, Message: 'OK' })
    }
  })
})

//Insert UpDateStatus for show
app.post('/updatestatus', (req, res) => {
  let data = req.body
  console.log(data);

  let sql = 'UPDATE billclaim SET status=? WHERE idbill=?'
  let query = db.query(sql, [data.status, data.idbill], (err, result) => {
    if (err) throw err;
    console.log(result)
    if (result.length === 0) {
      res.send({ Message: 'ERROR' })
    } else {
      res.send({ result, Message: 'OK' })
    }
  })
})

//Insert UpDateStock
app.post('/updatestock', (req, res) => {
  let data = req.body
  data.stock = data.stock - 1
  console.log(data)
  let sql = 'UPDATE product SET stock=? WHERE idproduct=?'
  let query = db.query(sql, [data.stock, data.idproduct], (err, result) => {
    if (err) throw err;
    console.log(result)
    res.send('Add  Auto Data...')
  })
})

//getBrandProduct
app.get('/getbrand', (req, res) => {
  let sql = 'SELECT DISTINCT brand,stock FROM product'
  console.log(sql)
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({ Message: 'ERROR' })
    } else {
      console.log(result.length)
      var data = []
      for (let index = 0; index < result.length; index++) {
        data.push(result[index].brand)
      }
      res.send({ data, Message: 'OK' })
    }
  })
})

//getIDProduct
app.post('/getidproduct', (req, res) => {
  let data = req.body
  let sql = 'SELECT * FROM product WHERE brand = ?'
  console.log(sql)
  let query = db.query(sql, [data.brand], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({ Message: 'ERROR' })
    } else {
      console.log(result.length)
      var data = []
      for (let index = 0; index < result.length; index++) {
        if (result[index].stock !== 0) {
          data.push(result[index].idproduct)
        }
      }
      res.send({ result, data, Message: 'OK' })
    }
  })
})

//ShowProduct
app.get('/getshowproduct', (req, res) => {
  let sql = 'SELECT * FROM bill'
  console.log(sql)
  let query = db.query(sql, (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      res.send({ Message: 'ERROR' })
    } else {
      res.send({ result, Message: 'OK' })
    }
  })
})

app.listen('3000', () => {
  console.log('Server started on port 3000')
})