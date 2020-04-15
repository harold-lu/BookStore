//Create express app
const express = require('express');
let app = express();

//Database variables
let initOptions;
let pgp;
let db;

//admin information
let admin;
let adminpwd;

//logged in user information, mimicks session
let user; //*remove default value after
let usercart = [];
let gpid = 400000001; 
let guid = 500000001; 
let gtid = 600000000001; 

//View engine
app.set("view engine", "pug");

//Set up the routes
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());

//homepage
app.get('/', index);

//user login/logout
app.get('/login', login);
app.get('/logout', logout);
app.post('/login', postlogin);

//user registration
app.get('/register', register);
app.post('/register', postregister);

//user browsing
app.get('/browse', browse);
app.post('/browse', postbrowse);
app.get('/browse/:isbn', viewbook);
//implement, also add to viewbook page
app.get('/author/:aid', viewauthor);
app.get('/publisher/:pubname', viewpub);
app.get('/browse/author/:aid', searchauthor);
app.get('/browse/publisher/:pub', searchpub);
app.get('/browse/genre/:genre', searchgenre);

//cart pages
app.get('/cart', cart);
app.post('/addcart', addcart);
app.post('/checkout', checkout);
app.post('/purchase', purchase);
//app.get('/confirmation', confirmation);
app.get('/purchase', allpurchase);
app.get('/purchase/:pid', viewpurchase);
app.post('/tracking/:tid', tracking);

//admin paths
app.get('/admin', adminlogin);
app.post('/adminlogin', postadminlogin);
app.get('/adminlogout', adminlogout);
app.get('/adminhome', adminhome);
app.get('/addbook', addbookpage);
app.post('/addbook', addbook);
app.get('/deletebook', deletebookpage);
app.post('/deletebook', deletebook);
app.get('/reports', reportpage);
app.post('/reports', reports);

//------------------------------------------------------------- HOMEPAGE -----------------------------------------------------------------

function index(req, res, next){
  res.render('pages/index', {user:user});
}

//------------------------------------------------------------- USER LOGIN / LOGOUT -----------------------------------------------------------------

function login(req, res, next){
  res.render('pages/login', {user:user});
}

async function postlogin(req, res, next){
  //get id for username, get id for password
  //if the two ids are the same, then successful login
  //change global variable name as
  console.log(req.body);
  logging = req.body.username;
  console.log(logging);
  let q = await db.query("select username, password from registered_user where username='"+logging+"';");
  console.log(q);
  if(q.length == 0){
    res.render('pages/login', {user:user})
  }
  else{
    user = q[0].username;
    res.render('pages/browse', {user:user})
  }
}

function logout(req, res, next){
  user = null;
  usercart = [];
  res.render('pages/index', {user:user});
}

//------------------------------------------------------------- USER REGISTRATION -----------------------------------------------------------------

function register(req, res, next){
  res.render('pages/register', {user:user});
}

async function postregister(req, res, next){
  //get information from user input
  //insert into registered user table
  //user table will do the checking, return message indicating if insertion was successful
  register = req.body;
  console.log(register);
  let s = "insert into registered_user values('"+guid+"', '" + register.username +"', '"+ register.password+"', '"+ register.email + "', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);";
  console.log(s);
  let q = await db.query("insert into registered_user values('"+guid+"', '" + register.username +"', '"+ register.password+"', '"+ register.email + "', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);");
  user = register.username;
  guid = guid + 1;
  res.render('pages/browse', {user:user})
}

//------------------------------------------------------------ USER BROWISING ---------------------------------------------------------------------

function browse(req, res, next){
  res.render('pages/browse', {postbrowse: false, user:user});
}

async function postbrowse(req, res, next){
  //get selected item from list
  //get input the textbox
  //query the tables, an if/else for each of the list options
  //then, res.render('pages/browse', with parameters for the books that were returned)
  let q;
  let searchOption = req.body.searchOption;
  let search = req.body.search;
  console.log(req.body);

  if(searchOption == 'Title' && search != ''){
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and title like '%" + search+"%';");
  }
  else if(searchOption == 'Author' && search != ''){
    //q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and name='" + search+"';");
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and name like '%" + search+"%';");
  }
  else if(searchOption == 'ISBN' && search != ''){
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and isbn='" + search+"';");
  }
  else if(searchOption == 'Genre' && search != ''){
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and genre like '%" + search+"%';");
  }
  else if(searchOption == 'Publisher' && search != ''){
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and publisher like '%" + search+"%';");
  }
  else if(searchOption == 'Rating' && search != ''){
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and rating >= '" + search+"';");
  }
  else if(searchOption == 'Max Price' && search != ''){
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and price <= '" + search+"';");
  }
  else if(searchOption == 'Min Price' && search != ''){
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and price >= '" + search+"';");
  }
  else if(searchOption == 'Max No. of Pages' && search != ''){
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and num_pages <='" + search+"';");
  }
  else{
    let x = []
    q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid;");
    for(let i = 0; i<10; i++){
      x.push(q[Math.floor(Math.random() * q.length)]);
    }
    q = x;
  }
  res.render('pages/browse', {postbrowse:true, searchTitle:[req.body.searchOption, req.body.search], user:user, q:q});
}

async function viewbook(req, res, next){
  //fix for multiple authors after
  let isbn = req.params.isbn;
  //console.log(isbn);
  let q = await db.query("select isbn, title, publisher,subtitle, genre, description, rating, num_pages, lang, price, stock, name, aid from book natural join written_by natural join author where written_by.aid = author.aid and isbn='" + isbn+"';");
  //console.log(q);
  res.render('pages/viewbook', {user:user, q:q});
}

async function viewauthor(req, res, next){
  let aid = req.params.aid;
  let q = await db.query("select * from author where aid='" + aid+"';");
  res.render('pages/author', {user:user, q:q});
}

async function viewpub(req, res, next){
  let pubname = req.params.pubname;
  let q = await db.query("select pubid, name, email, address, city, country from publisher where name='" + pubname+"';");
  res.render('pages/publisher', {user:user, q:q});
}


async function searchauthor(req, res, next){
  let aid = req.params.aid;
  let q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and aid='" + aid+"';");
  console.log(q[0]);
  res.render('pages/browse', {postbrowse:true, searchTitle:['Author', q[0].name], user:user, q:q});
}

async function searchpub(req, res, next){
  let pub = req.params.pub;
  console.log(pub);
  let q = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and publisher='" + pub+"';");
  res.render('pages/browse', {postbrowse:true, searchTitle:['Publisher', pub], user:user, q:q});
}

async function searchgenre(req, res, next){
  let genre = req.params.genre;
  console.log(genre);
  let q = await db.query("select isbn, title, name, genre from book natural join written_by natural join author where written_by.aid = author.aid and genre='" + genre+"';");
  res.render('pages/browse', {postbrowse:true, searchTitle:['Genre', genre], user:user, q:q});
}

//------------------------------------------------------------------ CART PAGES ---------------------------------------------------------------------

function cart(req, res, next){
  //add usercart stuff after
  res.render('pages/cart', {user:user, usercart:usercart})
}

async function addcart(req, res, next){
  isbn = req.body.isbn;
  //console.log("this is isbn: " + isbn)
  q = []
  let result;
  if(!(usercart.includes(isbn))){
    usercart.push(isbn);
  }
  //console.log(usercart.length);
  for(let i = 0; i<usercart.length; i++){
    result = await db.query("select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and isbn='" + usercart[i]+"';");
    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++")
    // console.log(result[0])
    // console.log("+++++++++++++++++++++++++++++++++++++++++++++++++")
    q.push(result[0]);
  }
  res.render('pages/cart', {user:user, q:q})
}

async function checkout(req, res, next){
  let coststring = "select sum(price) from book where";
  let cost;
  let uid = await db.query("select distinct uid from registered_user where username='"+user+"';");
  uid = uid[0].uid
  console.log(uid);
  let isbn = req.body.isbn;
  console.log(isbn);
  console.log(req.body);
  let b = req.body.book;

  let q;
  console.log(b.length);
  if(!(Array.isArray(b))){
    q = b
    insert = q.split(" by ");
    if(insert.length > 2){
      let newinsert = []
      let btitle ="";
      for(let i = 0; i<insert.length; i++){
        if(i == insert.length -2){
          btitle+=insert[i];
          break;
        }else{
          btitle+=(insert[i]+" by ");
        }
      }
      newinsert.push(btitle);
      newinsert.push(insert[1]);
      insert = newinsert;
    }
    coststring += " title='" + insert[0].replace("'","''") + "';";
    console.log(coststring);
    cost = await db.query(coststring);
    cost = cost[0].sum
    console.log(cost);
    let s = "insert into purchases values('"+gpid+"', 'APR/11/2020', '16:20:00', '" +cost + "');";
    console.log(s);
    let insertIntobooks_purchased = await db.query("insert into purchases values('"+gpid+"', 'APR/11/2020', '16:20:00', '" +cost + "');");
    s = "insert into user_purchases values('"+gpid+"', '" +uid+ "');";
    console.log(s);
    let insertIntoUserPurchase = await db.query("insert into user_purchases values('"+gpid+"', '" +uid+ "');");
    s = "insert into books_purchased values('"+gpid+"', '" +isbn+ "');";
    console.log(s);
    let query = await db.query("insert into books_purchased values('"+gpid+"', '" +isbn+ "', '" + insert[0].replace("'", "''") + "', '" + insert[1].replace("'", "''") + "');");

  }
  else{
    let arr = [];
    q = req.body.book;
    for(let i = 0; i<q.length; i++){
      insert = q[i].split(" by ");
      if(insert.length > 2){
        let newinsert = []
        let btitle ="";
        for(let i = 0; i<insert.length; i++){
          if(i == insert.length -2){
            btitle+=insert[i];
            break;
          }else{
            btitle+=(insert[i]+" by ");
          }
        }
        newinsert.push(btitle);
        newinsert.push(insert[1]);
        insert = newinsert;
      }
      arr.push(insert);
    }
    for(let i = 0; i<arr.length; i++){
      if(i == arr.length-1){
        coststring += " title='" + arr[i][0].replace("'", "''") + "'";
      }else{
        coststring += " title='" + arr[i][0].replace("'", "''") + "' or";
      }
    }
    coststring += ";";

    console.log(coststring);
    cost = await db.query(coststring);
    cost = cost[0].sum
    let insertIntobooks_purchased = await db.query("insert into purchases values('"+gpid+"', 'APR/11/2020', '16:20:00', '" +cost + "');");

    let insertIntoUserPurchase = await db.query("insert into user_purchases values('"+gpid+"', '" +uid+ "');");
    for(let i = 0; i<arr.length; i++){
      console.log(isbn[i]);
      let query = await db.query("insert into books_purchased values('"+gpid+"', '" +isbn[i]+ "', '"+arr[i][0].replace("'", "''") + "', '" + arr[i][1].replace("'", "''") +"');");
    }

  }
  usercart = [];
  res.render('pages/confirmation',{user:user, q:q});
}

async function purchase(req, res, next){
  let uid = await db.query("select distinct uid from registered_user where username='"+user+"';");
  uid = uid[0].uid
  let q = await db.query("select pid from purchases natural join user_purchases natural join registered_user where username ='" + user+"';");
  let info = req.body;

  let query = await db.query("update registered_user set address='" + info.bAddress + "', city='" + info.bCity + "', country='" + info.bCountry + "', card_number='" +info.cardNum + "', ccv='" + info.ccv + "', cardholdername='" +info.holderName + "', exp_month='" + info.expMonth + "', exp_year='" +info.expYear + "', bill_address='"+ info.sAddress + "', bill_city='" +info.sCity + "', bill_country='"+ info.sCountry + "', postal_code='"+ info.postal + "' where uid ='"+uid+"';");
  let order_tracking = await db.query("insert into order_tracking values('"+gtid+"', '17:21:40', 'APR/11/2020', '19:56:20', 'APR/17/2020', 'Kingston', 'Canada', '" +info.sAddress+"', '" + info.sCity + "', '" + info.sCountry + "', '" + info.postal + "');");
  let orders = await db.query("insert into orders values('"+gpid+"', '" + gtid + "');");
  gpid = gpid + 1;
  gtid = gtid + 1;
  res.render('pages/purchase', {user:user, q:q})


  //let s = "update registered_user set bill_address='" + info.bAddress + "', bill_city='" + info.bCity + "', bill_country='" + info.bCountry + "', card_number='" +info.cardNum + "', ccv='" + info.ccv + "', cardholdername='" +info.holderName + "', exp_month='" + info.expMonth + "', exp_year='" +info.expYear + "', address='"+ info.sAddress + "', city='" +info.sCity + "', country='"+ info.sCountry + "', postal_code='"+ info.postal + "' where uid ='"+uid+"';";
  //s = "insert into order_tracking values('"+gtid+"', '17:21:40', 'APR/11/2020', '19:56:20', 'APR/17/2020', 'Kingston', 'Canada', '" +info.sAddress+"', '" + info.sCity + "', '" + info.sCountry + "', '" + info.postal + "');";
  //console.log(s);
  //s = "insert into orders('"+gpid+"', '" + gtid + "');";
  //console.log(s);
}

//app.get
async function allpurchase(req, res, next){
  let q = await db.query("select pid from purchases natural join user_purchases natural join registered_user where username ='" + user+"';");
  console.log(q);
  res.render('pages/purchase', {user:user, q:q})
}

async function viewpurchase(req, res, next){
  let pid = req.params.pid;
  let q = await db.query("select pid, tid, title, author, cost from registered_user natural join purchases natural join books_purchased natural join orders where books_purchased.pid = purchases.pid and username='" + user+"' and pid='" + pid +"';");
  console.log(q);
  res.render('pages/viewpurchase', {user:user, q:q});
}

async function tracking(req, res, next){
  let tid = req.body.tid;
  let q = await db.query("select distinct * from orders natural join order_tracking where tid='" + tid+"';");
  console.log(q);
  res.render('pages/tracking', {user:user, q:q});

}

///----------------------------------------------------------------- ADMIN PATHS ------------------------------------------------------------------

function adminlogin(req, res, next){
  res.render('pages/admin', {admin:admin, adminpwd:adminpwd})
}

function postadminlogin(req, res, next){
  //get id for username, get id for password
  //if the two ids are the same, then successful login
  //change global variable name as
  console.log(req.body);
  if(req.body.username == 'admin' && req.body.password =='admin'){
    admin = 'admin';
    res.render('pages/adminhome', {admin:admin, adminpwd:adminpwd})
  }else{
    res.render('pages/admin', {admin:admin, adminpwd:adminpwd})
  }
}

function adminhome(req, res, next){
  res.render('pages/adminhome', {admin:admin, adminpwd:adminpwd})
}

function adminlogout(req, res, next){
  admin = null;
  adminpwd = null;
  res.render('pages/admin', {admin:admin, adminpwd:adminpwd});
}

function addbookpage(req, res, next){
  res.render('pages/addbook', {admin:admin, adminpwd:adminpwd});
}

async function addbook(req, res, next){
  console.log(req.body);
  let info = req.body;
  let pubid = await db.query("select pubid from publisher where name='"+info.publisher+"';");
  let aid = await db.query("select aid from author where name='"+info.author+"';");
  console.log(pubid);
  console.log(aid);

  let s = "insert into book values('"+info.isbn+"', '" +info.title+"', '" + info.publisher + "', '" + info.subtitle + "', '" +info.genre+"', '" +info.description+"', '" +info.rating+"', '" +info.num_pages+"', '" +info.lang+"', '" +info.price+"', '" +info.percent_pub+"', '" + info.stock + "');";
  console.log(s);
  s = "insert into published_by values('"+info.isbn+"', '" + pubid[0].pubid + "');";
  console.log(s);
  s="insert into written_by values('"+info.isbn+"', '" + aid[0].aid + "');";
  console.log(s);
  let insertIntoBook = await db.query("insert into book values('"+info.isbn+"', '" +(info.title).replace("'","''")+"', '" + info.publisher + "', '" + (info.subtitle).replace("'","''") + "', '" +(info.genre).replace("'","''")+"', '" +(info.description).replace("'","''")+"', '" +info.rating+"', '" +info.num_pages+"', '" +info.lang+"', '" +info.price+"', '" +info.percent_pub+"', '" + info.stock + "');");
  let insertIntoPublished = await db.query("insert into published_by values('"+info.isbn+"', '" + pubid[0].pubid + "');");
  let insertIntoWritten = await db.query("insert into written_by values('"+info.isbn+"', '" + aid[0].aid + "');");
  res.render('pages/addbook', {admin:admin, adminpwd:adminpwd});
}

function deletebookpage(req, res, next){
  res.render('pages/deletebook', {admin:admin, adminpwd:adminpwd});
}

async function deletebook(req, res, next){
  let info = req.body;
  let q;
  if(info.title){
    s = "select isbn from book where title='"+info.title+"');";
    console.log(s);
    q = await db.query("select isbn from book where title='"+(info.title).replace("'", "''")+"';");
    q=q[0].isbn;
  }
  else{
    q=info.isbn;
  }
  console.log(q);
  let deleteFromPublished = await db.query("delete from published_by where isbn='"+q+"';");
  let deleteFromWritten = await db.query("delete from written_by where isbn='"+q+"';");
  let deleteFromBook = await db.query("delete from book where isbn='"+q+"';");
  res.render('pages/deletebook', {admin:admin, adminpwd:adminpwd});
}

async function reportpage(req, res, next){
  let q = await db.query("select sum(cost) from purchases;");
  console.log(q);
  let m = [{sum:'null'}];
  res.render('pages/report', {admin:admin, adminpwd:adminpwd, q:q, m:m});
}

async function reports(req, res, next){
  let q = await db.query("select sum(cost) from purchases;");
  let info=req.body;
  console.log(info);
  console.log(q);
  let m = await db.query("select sum(cost) from purchases where date like '%" + info.month+"%';");
  if(m[0].sum == null){
    m=[{sum:'null'}];
  }
  console.log(m);
  res.render('pages/report', {admin:admin, adminpwd:adminpwd, q:q, m:m, month:info.month});
}
///----------------------------------------------------------------- POSTGRESQL DB INITIALIZER ------------------------------------------------------------------

app.listen(3000, function(){
  initOptions = {
    connect(client, dc, useCount){
      const cp = client.connectionParameters;
      console.log('Connected to database: ' + cp.database);
    }
  };
  pgp = require('pg-promise')(initOptions);
  db = pgp('postgres://<db_username>:<db_password>@localhost:5432/<db_name>');
  console.log("Listening on port 3000");
});
