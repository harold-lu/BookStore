var fs = require("fs");

let b = fs.readFileSync("./bookdata.txt").toString('utf-8');
let p = fs.readFileSync("./pubdata.txt").toString('utf-8');
let a = fs.readFileSync("./authordata.txt").toString('utf-8');
let p_b = fs.readFileSync("./published_bydata.txt").toString('utf-8');
let a_b = fs.readFileSync("./written_bydata.txt").toString('utf-8');
let bankdata = fs.readFileSync("./bankdata.txt").toString('utf-8');
let pub_bank = fs.readFileSync("./publisher_bankdata.txt").toString('utf-8');

let book = b.split("\n");
let publisher = p.split("\n");
let author = a.split("\n");
let published_by = p_b.split("\n");
let written_by = a_b.split("\n");
let bank = bankdata.split("\n");
let publisher_bank = pub_bank.split("\n");

console.log(book[0]);
console.log(book[1]);

let initOptions;
let pgp;
let db;

initOptions = {
  connect(client, dc, useCount){
    const cp = client.connectionParameters;
    console.log('Connected to database: ' + cp.database);
  }
};
pgp = require('pg-promise')(initOptions);
db = pgp('postgres://<db_username>:<db_password>@localhost:5432/<db_name>');



for(let i = 0; i < book.length; i++){
  db.one({
    text: book[i] // can also be a QueryFile object
})
    .then(user => {
        // user found;
    })
    .catch(error => {
    });
}

for(let i = 0; i < publisher.length; i++){
  db.one({
    text: publisher[i] // can also be a QueryFile object
})
    .then(user => {
        // user found;
    })
    .catch(error => {

    });
}

for(let i = 0; i < author.length; i++){
  db.one({
    text: author[i] // can also be a QueryFile object
})
    .then(user => {
        // user found;
    })
    .catch(error => {

    });
}
//
for(let i = 0; i < published_by.length; i++){
  db.one({
    text: published_by[i] // can also be a QueryFile object
})
    .then(user => {
        // user found;
    })
    .catch(error => {

    });
}

for(let i = 0; i < written_by.length; i++){
  db.one({
    text: written_by[i] // can also be a QueryFile object
})
    .then(user => {
        // user found;
    })
    .catch(error => {

    });
}

for(let i = 0; i < bank.length; i++){
  db.one({
    text: bank[i] // can also be a QueryFile object
})
    .then(user => {
        // user found;
    })
    .catch(error => {

    });
}

for(let i = 0; i < publisher_bank.length; i++){
  db.one({
    text: publisher_bank[i] // can also be a QueryFile object
})
    .then(user => {
        // user found;
    })
    .catch(error => {

    });
}
