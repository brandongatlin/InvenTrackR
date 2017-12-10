//global variables
var mysql = require("mysql");
var inquirer = require("inquirer");

//sql login info
var connectObject = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
};

var connection = mysql.createConnection(connectObject);

connection.connect(function(error) {

  if (error) {
    throw error;

  }
  display(); //run display function on startup

  console.log(`Connect as ID: ${connection.threadId}`);

});

//function to display all items in store
function display() {

  connection.query("SELECT item_id, product_name, price FROM products", function(err, results) {
    if (err) throw err;

    console.log(results);

    // once you have the items, prompt the user for which they'd like to bid on
    inquirer
      .prompt([{
        name: "choice",
        type: "input",
        message: "Which item would you like to purchase?"

      }]);
  });
} // end display function