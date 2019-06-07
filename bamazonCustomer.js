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
    displayItems();
});


function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        console.log("List of items to buy: ");
        for (var i = 0; i < res.length; i++) {
           
            console.log( res[i].item_id + " - " + res[i].product_name + " | " + res[i].department_name + " | " + "Price: " + res[i].price + "$" );
        }
        console.log("-------------------------------");
        pickTheItem();
    });
}

function pickTheItem() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "pickID",
                    type: "input",
                    message: "The ID of the product you would like to buy?"
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "How many units of the product you would like to buy?"
                }
            ])
            .then(function (answer) {

                for (var f = 0; f < res.length; f++) {
                    var chosenItem;
                    if (res[f].item_id == answer.pickID) {
                        chosenItem = res[f];
                        // console.log(chosenItem);
                    }
                }
                if (chosenItem.stock_quantity < parseInt(answer.quantity)) {
                    console.log('Sorry, Insufficient quantity!')
                    nextStep();
                } else {
                    console.log("OK!")
                    //updated quantity of the product on the stock
                    var updatedQuantity = chosenItem.stock_quantity - answer.quantity;
                    var productSales = chosenItem.product_sales;
                    var totalcost = parseInt(answer.quantity) * chosenItem.price;
                    //updates product sales of shoosen item ( add total cost to prodact_sales)
                    var updatesProductSales = productSales + totalcost;
                    
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updatedQuantity,
                                product_sales: updatesProductSales
                            },
                            {
                                item_id: chosenItem.item_id
                            }
                        ]
                    )
                   
                    // console.log( updatesProductSales);
                    // console.log(updatedQuantity);
                    console.log("You total cost will be: " + totalcost + "$" + "  Thank you for your purchase! Hope to see you again!");
                    nextStep();
                    
                }
      
            });
    });
}
function nextStep() {
    inquirer.prompt({
        name: "next",
        type: "list",
        message: "Would do you like to continue?",
        choices: ["YES", "NO"]
    })
        .then(function (answer) {
            if (answer.next === "YES") {
                displayItems();
            }
            else {
                connection.end();
            }
        })
}