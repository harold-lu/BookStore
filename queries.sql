/*user login
the inputted username and password will be matched with records in the database for authentication*/
select username, password from registered_user where username='<username>';

/*user registration
the registered user will be added into the database. They do not fill in their shipping and billing information at this stage*/
insert into registered_user values('<uid>', '<username>', '<password>', '<email>', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

/*browsing*/
/*searching for title match*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and title like '%<title>%';
/*searching for author match*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and name like '%<author>%';
/*searching for isbn match*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and isbn='<isbn>';
/*searching for genre match*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and genre like '%<genre>%';
/*searching for publisher match*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and publisher like '%<publisher>%';
/*searching tuples with ratings higher than <rating>*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and rating >= '<rating>';
/*searching for upper bound of money willing to spend on a book*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and price <= '<max_price>';
/*searching for lower bound of money willing to spend on a book*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and price >= '<min_price>';
/*searching for maximum number of pages willing to read*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and num_pages <= '<num_pages';
/*this query returns all books and the server will pick 10 random books for the user. Useful query for when the user does not know what they want*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid;

/*Query used to return all relevant information about a book to display in single book view*/
select isbn, title, publisher,subtitle, genre, description, rating, num_pages, lang, price, stock, name, aid from book natural join written_by natural join author where written_by.aid = author.aid and isbn='<isbn>';
/*Used to return all relevant information about an author for single author view*/
select * from author where aid='<aid>';
/*User to return all relevant information about a publisher for single publisher view*/
select pubid, name, email, address, city, country from publisher where name='<publisher>';
/*Query used when clicking on the Author link, returns all books written by a specific author*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and aid='<aid>';
/*Query used when clicking on the Publisher link, returns all books published by a specific publishing company*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and publisher='<publisher>';
/*Query used when clicking on the Genre link, returns all books related to the specified genre*/
select isbn, title, name, genre from book natural join written_by natural join author where written_by.aid = author.aid and genre='<genre>';

/*cart and purchase*/
/*Returns books in usercart, used to display the books bought by user in the cart view*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and isbn='<isbn>';
/*When checking out, the uid of the user is used to load table user_purchases with the purchase that they just made*/
select distinct uid from registered_user where username='username';
/*inserts the purchase the user just made into the purchases table*/
insert into purchases values('<pid>', '<date>', '<time>', '<cost>');
/*inserts the relation between the user and the purchase into the user_purchases table*/
insert into user_purchases values('<pid>', '<uid>');
/*inserts the relation between the books purchased and the purchase id into the books_purchased table*/
insert into books_purchased values('<pid>', '<isbn>', '<title>', '<author>');
/*Query used to return the uid of the current user to display all purchases they've made*/
select distinct uid from registered_user where username='<username>';
/*returns all purchases made by current user to display on the front end*/
select pid from purchases natural join user_purchases natural join registered_user where username ='<username>';
/*fill in billing and shipping information for the purchase, updates the registered_user table*/
update registered_user set address='<bAddress>', city='<bCity>', country='<bCountry>', card_number='<cardNum>', ccv='<ccv>', cardholdername='<holderName>', exp_month='<expMonth>', exp_year='<expYear>', bill_address='<sAddress>', bill_city='<sCity>', bill_country='<sCountry>', postal_code='<postal>' where uid ='<uid>';
/*insert relevant information into the order_tracking table so that the purchase can be tracked*/
insert into order_tracking values('<tid>', '<depart_time>', '<depart_date>', '<eta_time>', '<eta_date>', '<current_location>', '<current_country>', 'dest_address', 'dest_city', 'dest_country', 'postal_code');
/*insert into the orders table for the relation between the order tracking id and the purchase id*/
insert into orders values('<pid>', '<tid>');
/*return the pids for all purchases made by the user*/
select pid from purchases natural join user_purchases natural join registered_user where username ='<username>';
/*Query used to display information about a single purchase transaction (displays all books made for that purchase)*/
select pid, tid, title, author, cost from registered_user natural join purchases natural join books_purchased natural join orders where books_purchased.pid = purchases.pid and username='<username>' and pid='<pid>';
/*Query used to return all information pertaining to specific tracking id to display all information about the package in transit*/
select distinct * from orders natural join order_tracking where tid='<tid>';

/*admin paths*/
/*return the pubid to used to fill in published_by table with the new book added*/
select pubid from publisher where name='<publisher>';
/*return aid to be used to fill in written_by table with the new book added*/
select aid from author where name='<author>';
/*insert a new book into the database*/
insert into book values('<isbn>', '<title>', '<publisher>', '<subtitle>', '<genre>', '<description>', '<rating>', '<num_pages>', '<lang>', '<price>', '<percent_pub>', '<stock>');
/*insert a new relation into the table published_by for the new book*/
insert into published_by values('<isbn>', '<pubid>');
/*insert a new relation into the table written_by for the new book*/
insert into written_by values('<isbn>', '<aid>');
/*return isbn to be used to identify and delete a book*/
select isbn from book where title='<title>';
/*delete book from relation published_by with matching isbn*/
delete from published_by where isbn='<isbn>';
/*delete from relation written_by with matching isbn*/
delete from written_by where isbn='<isbn>';
/*delete from entity set book with matching isbn*/
delete from book where isbn='<isbn>';
/*Returns sum of the cost of all purchases to show total sales*/
select sum(cost) from purchases;
/*Returns sum of the cost of all purchases for a specific month*/
select sum(cost) from purchases where date like '%<MONTH>%';
