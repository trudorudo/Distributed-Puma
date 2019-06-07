var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("conneted as id " + connection.threadId);
    credentials();
});
function credentials() {
    inquirer.prompt([
        {
            name: "login",
            type: "input",
            message: "Login"
        },
        {
            name: "password",
            type: "password",
            message: "Password",
            mask: function (input) {
                return '█' + new Array(String(input).length).join('█')
            }
        }
    ])
        .then(function (answer) {
            if (answer.login === "manager" && answer.password === "password") {
                options();
            }
            else {
                console.log("Incorrect! Try again");
                credentials();
            }
        })
}

function options() {
    inquirer
        .prompt({
            name: "options_list",
            type: "list",
            message: "Please, choose what would you like to do ",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            if (answer.options_list === "View Products for Sale") {
                viewProductsForSale();
            }
            else if (answer.options_list === "View Low Inventory") {
                viewLowInventory();
            }
            else if (answer.options_list === "Add to Inventory") {
                addToInventory();
            }
            else if (answer.options_list === "Add New Product") {
                addNewProduct();
            }
            else {
                connection.end();
            }
        });
}

function viewProductsForSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("Available items: ");
        console.log("____________________");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " -  " + res[i].product_name + " | " + "price: " + res[i].price + " | " + "stock quantity: " + res[i].stock_quantity);
            console.log("---------------------------------");
            
        }
        nextStep();
    })
}



function viewLowInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("Items with an inventory: ");
        console.log("____________________");
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(res[i].item_id + " -  " + res[i].product_name + " | " + "price: " + res[i].price + " | " + "stock quantity: " + res[i].stock_quantity);
                console.log("---------------------------------");
                nextStep();
            };
        }

    })
    
   
}

function addToInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("List of itmes: ");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " -  " + res[i].product_name + " | " + "price: " + res[i].price + " | " + "stock quantity: " + res[i].stock_quantity);
        }
        question();
    });
}
function question() {
    inquirer.prompt({
        name: "updates",
        type: "list",
        message: "Would you like to update quantity of any product?",
        choices: ["YES", "NO"]
    })
        .then(function (answer) {
            if (answer.updates === "YES") {
                itemToUpdate();
            }
            else {
                console.log("No Items should be updated!")
                connection.end();
            }
        })
}
function itemToUpdate() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "pickID",
                    type: "input",
                    message: "ID of item that should be updated "
                },
                {
                    name: "quantityToAdd",
                    type: "input",
                    message: "How many items will be added? "
                }
            ])
            .then(function (answer) {
                for (var i = 0; i < res.length; i++) {
                    var chosenItem;
                    if (res[i].item_id == answer.pickID) {
                        chosenItem = res[i];
                        // console.log(chosenItem);
                    }
                }
                var updatedQuantity = parseInt(answer.quantityToAdd) + chosenItem.stock_quantity;
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: updatedQuantity
                        },
                        {
                            item_id: answer.pickID
                        }
                    ]
                )
                console.log("Quantuty of  item: '  " + chosenItem.product_name + " ' " + " was updated on the stock!");
                nextStep();

            })
    })
}
function addNewProduct() {
    inquirer.prompt([
        {
            name: "newItemName",
            type: "input",
            message: "Name of new item: "
        },
        {
            name: "department",
            type: "input",
            message: "Department new product will be placed in: "
        },
        {
            name: "price",
            type: "input",
            message: "Price of new product: "
        },
        {
            name: "quantityInStock",
            type: "input",
            message: "Stock quantity of new product: "
        }
    ])
    .then(function(answer){
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.newItemName,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.quantityInStock
            },
            function(err, res){
                console.log("New product " + answer.newItemName + " has been added!");
                nextStep();
            }
        )
    })
}

function nextStep(){
    inquirer.prompt({
        name: "updates",
        type: "list",
        message: "Anything else?",
        choices: ["YES", "NO"]
    })
    .then(function(answer){
        if (answer.updates === "YES"){
            options();
        }
        else{
            console.log("Have a good day!");
            connection.end();
        }
    })
}