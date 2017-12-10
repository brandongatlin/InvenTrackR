//global variables
var mysql = require("mysql");
var inquirer = require("inquirer");

var item;
var price;
var id;

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

    for (var i = 0; i < results.length; i++) {
      id = results[i].item_id;
      item = results[i].product_name;
      price = results[i].price;

      console.log("id:" + id + ",", item, "$" + price);
    }




    // once you have the items, prompt the user for which they'd like to bid on
    inquirer.prompt([{
      name: "item_choice",
      type: "input",
      message: "Which item would you like to purchase?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }]).then(function(answer) {
      console.log(answer);
      inquirer.prompt([{
        name: "quantity_choice",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }]);
    });
  });
} // end display function