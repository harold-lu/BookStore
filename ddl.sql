create table author
	(aid		varchar(9), 
	 name		varchar(75),
	 birth_city	varchar(20),
	 birth_country  varchar(20),
	 primary key (id)
	);

create table book  
	(isbn 		varchar(13),
	 title		varchar(325),
	 publisher 	varchar(30),
	 subtitle	varchar(212),
	 genre		varchar(30),
	 description 	varchar(5800),
	 rating		numeric(3,2),
	 num_pages	numeric(4,0),
	 lang		varchar(5),
	 price		numeric(7,2),
	 percent_pub	numeric(4,2),
	 stock		numeric(4,0),
	 primary key (isbn)
	);

create table bank
	(bid		varchar(10),
	 name 		varchar(50),
	 city	 	varchar(15),
	 country 	varchar(15),
	 primary key (bid)
	);

create table publisher
	(pubid		varchar(9),
	 name		varchar(30),
	 address	varchar(30),
	 city 		varchar(15), 
	 country 	varchar(15),	
	 email		varchar(40),
	 phone 		numeric(11,0),
	 primary key (id)
	);

create table registered_user
	(uid		  varchar(9),
	 username	  varchar(20),
	 password	  varchar(20),
	 email		  varchar(30),
	 address	  varchar(35),
	 city 		  varchar(20), 
	 country 	  varchar(20),
	 postal_code	  varchar(8),
	 card_number	  numeric(16,0),
	 ccv 		  numeric(3,0),
 	 cardholdername   varchar(30),
	 exp_month	  varchar(3),
	 exp_year	  numeric(4,0),
	 bill_address	  varchar(35),
	 bill_city        varchar(20), 
	 bill_country 	  varchar(20),
	 primary key (uid, username) 
	);
	
create table purchases
	(pid		varchar(9),
	 date		varchar(11),
	 time		varchar(8),
	 cost		numeric(7,2),
	 primary key (pid)
	);


create table order_tracking
	(tid		 varchar(12),
	 depart_time	 varchar(8),
	 depart_date	 varchar(11),
	 eta_time	 varchar(8),
	 eta_date 	 varchar(11),
	 current_city	 varchar(15),
	 current_country varchar(15),
	 dest_address	 varchar(35),
	 dest_city	 varchar(20), 
	 dest_country	 varchar(20), 
	 dest_postalcode varchar(8),
	 primary key (tid)
	);
	

create table written_by
	(isbn 		varchar(13), 
	 aid		varchar(9),
	 primary key (isbn, aid),
	 foreign key (isbn) references book,
	 foreign key (aid) references author
	);

create table published_by
	(isbn		varchar(13),
	 pubid		varchar(9),
	 primary key (isbn, pubid),
	 foreign key (isbn) references book,
	 foreign key (pubid) references publisher
	);


create table publisher_bank
	(bid		varchar(10),
	 pub_id		varchar(9),
	 funds		numeric(12,2),
	 primary key (bid, pubid),
	 foreign key (bid) references bank,
	 foreign key (pubid) references publisher
	);
	 
create table books_purchased
	(pid		varchar(9),
	 isbn		varchar(13),
	 title		varchar(325),
	 author		varchar(75),
	 primary key (pid, isbn),
	 foreign key (pid) references purchases,
	 foreign key (isbn) references book
	);

create table user_purchases
	(pid		varchar(9),
	 uid		varchar(9),
	 primary key (pid, uid)
	 foreign key (pid) references purchases,
	 foreign key (uid) references registered_user
	);


create table orders
	(pid 		varchar(9),
	 tid		varchar(12),
	 primary key (pid, tid),
	 foreign key (pid) references purchases, 
	 foreign key (tid) references order_tracking
	);
	 
	
