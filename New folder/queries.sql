/*user login*/
select username, password from registered_user where username='<username>';

/*user registration*/
insert into registered_user values('<uid>', '<username>', '<password>', '<email>', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

/*browsing*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and title like '%<title>%';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and name like '%<author>%';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and isbn='<isbn>';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and genre like '%<genre>%';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and publisher like '%<publisher>%';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and rating >= '<rating>';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and price <= '<max_price>';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and price >= '<min_price>';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and num_pages <= '<num_pages';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid;

select isbn, title, publisher,subtitle, genre, description, rating, num_pages, lang, price, stock, name, aid from book natural join written_by natural join author where written_by.aid = author.aid and isbn='<isbn>';
select * from author where aid='<aid>';
select pubid, name, email, address, city, country from publisher where name='<publisher>';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and aid='<aid>';
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and publisher='<publisher>';
select isbn, title, name, genre from book natural join written_by natural join author where written_by.aid = author.aid and genre='<genre>';

/*cart and purchase*/
select isbn, title, name from book natural join written_by natural join author where written_by.aid = author.aid and isbn='<isbn>';
select distinct uid from registered_user where username='username';
insert into purchases values('<pid>', '<date>', '<time>', '<cost>');
insert into user_purchases values('<pid>', '<uid>');
insert into books_purchased values('<pid>', '<isbn>', '<title>', '<author>');
select distinct uid from registered_user where username='<username>';
select pid from purchases natural join user_purchases natural join registered_user where username ='<username>';
update registered_user set address='<bAddress>', city='<bCity>', country='<bCountry>', card_number='<cardNum>', ccv='<ccv>', cardholdername='<holderName>', exp_month='<expMonth>', exp_year='<expYear>', bill_address='<sAddress>', bill_city='<sCity>', bill_country='<sCountry>', postal_code='<postal>' where uid ='<uid>';
insert into order_tracking values('<tid>', '<depart_time>', '<depart_date>', '<eta_time>', '<eta_date>', '<current_location>', '<current_country>', 'dest_address', 'dest_city', 'dest_country', 'postal_code');
insert into orders values('<pid>', '<tid>');
select pid from purchases natural join user_purchases natural join registered_user where username ='<username>';
select pid, tid, title, author, cost from registered_user natural join purchases natural join books_purchased natural join orders where books_purchased.pid = purchases.pid and username='<username>' and pid='<pid>';
select distinct * from orders natural join order_tracking where tid='<tid>';

/*admin paths*/
select pubid from publisher where name='<publisher>';
select aid from author where name='<author>';
insert into book values('<isbn>', '<title>', '<publisher>', '<subtitle>', '<genre>', '<description>', '<rating>', '<num_pages>', '<lang>', '<price>', '<percent_pub>', '<stock>');
insert into published_by values('<isbn>', '<pubid>');
insert into written_by values('<isbn>', '<aid>');
select isbn from book where title='<title>';
delete from published_by where isbn='<isbn>';
delete from written_by where isbn='<isbn>';
delete from book where isbn='<isbn>';
select sum(cost) from purchases;
select sum(cost) from purchases where date like '%<MONTH>%';
