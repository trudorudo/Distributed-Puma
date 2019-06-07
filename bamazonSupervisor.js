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
            if (answer.login === "supervisor" && answer.password === "password") {
                menu();
            }
            else {
                console.log("Incorrect! Try again");
                credentials();
            }
        })
}


function menu() {
    inquirer
        .prompt({
            name: "options",
            type: "list",
            message: "Menu:",
            choices: ["View Products Sales by Department", "Create New Department"]
        })
        .then(function (answer) {
            if (answer.options === "View Products Sales by Department") {
                viewProducts();
            }
            else {
                createNewDep();
            }
        })
}

// function to view products in tabel by departments
function viewProducts() {


    connection.query("select  id, name, over_head_costs, product_sales, over_head_costs - product_sales AS total_profit FROM products INNER JOIN departments ON departments.name = products.department_name;", function (err, res) {
        if (err) throw err;

        console.table(res);
        // console.log(res[i]); 
        nextStep();
    });
}

function createNewDep() {
    inquirer.prompt([
        {
            name: "new _department",
            type: "input",
            message: "Name of new department:"
        },
        {
            name: "over_head_costs",
            type: "input",
            message: "Over head costs: "
        }
    ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    name: answer.new_department,
                    over_head_costs: answer.over_head_costs,
                },
                function (err, res) {
                    console.log("New department has been added");
                    nextStep();
                }
            )

        })
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
                menu();
            }
            else {
                connection.end();
            }
        })
}