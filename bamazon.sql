DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(50) null,
department_name VARCHAR(50) null,
price DECIMAL(10,2) null,
stock_quantity INTEGER(10) null,
PRIMARY KEY (item_id)
);
SELECT * FROM products;

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("document frame", "home decor", 25, 50);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("alarm clock", "home decor", 50, 75);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("cookware", "kitchen", 10, 36);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("coffee maker", "kitchen", 73.3, 89);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("voice assistant", "smart home", 125, 15);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("rings", "jewelry", 225, 5);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("backpack", "luggage", 48, 37);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Anthony Bourdain Remembered", "books", 15, 89);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Liitle Fires Everywhere", "books", 42, 87);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Bohemian Rhapsody", "movies", 7.99, 150);

SELECT * FROM products;

CREATE TABLE departments(
id INTEGER(10) AUTO_INCREMENT NOT NULL,
name varchar(50) null,
over_head_costs decimal(10,2) null,
PRIMARY KEY(id)
);
SELECT * FROM departments;

INSERT INTO departments( name, over_head_costs)
VALUES ( "home decor",  150000);

INSERT INTO departments( name, over_head_costs)
VALUES ( "jewelry",  80000);
SELECT * FROM departments;

INSERT INTO departments( name, over_head_costs)
VALUES ( "kitchen",  80000);
SELECT * FROM departments;

INSERT INTO departments( name, over_head_costs)
VALUES ( "smart home",  80000);
SELECT * FROM departments;

INSERT INTO departments( name, over_head_costs)
VALUES ( "books",  80000);
SELECT * FROM departments;

INSERT INTO departments( name, over_head_costs)
VALUES ( "movies",  80000);
SELECT * FROM departments;

INSERT INTO departments( name, over_head_costs)
VALUES ( "movies",  80000);
SELECT * FROM departments;

select  id, name, over_head_costs, product_sales, over_head_costs - product_sales AS total_profit
FROM products
INNER JOIN departments ON departments.name = products.department_name

 


-- join tabel
SELECT * FROM departments a
inner join 
( select sum(price),department_name from products group by department_name ) as b
on a.name = b.department_name