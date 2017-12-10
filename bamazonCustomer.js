//global variables
var mysql = require("mysql");
var inquirer = require("inquirer");

var item;
var price;
var id;
var stockQuantity;
var chosenQuantity;

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

  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, results) {
    if (err) throw err;

    for (var i = 0; i < results.length; i++) {
      id = results[i].item_id;
      item = results[i].product_name;
      price = results[i].price;
      stockQuantity = results[i].stock_quantity;
      //when a user makes a selects a quantity, the program always compares to stock from the last item in teh loop, item 10. Therefore I need to find a way to compare to the exact item chosen?

      console.log("loop stockQuantity: ", stockQuantity);

      console.log("id:" + id + ",", item, "$" + price, "in stock: " + stockQuantity);
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
      // console.log(answer);
      inquirer.prompt([{
        name: "quantity_choice",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        } //end if statement
      }]).then(function(answer) {
        // console.log(answer);
        chosenQuantity = answer.quantity_choice;
        console.log(item);

        // console.log("chosen quantity: ", chosenQuantity);
        // console.log("store quantity: ", stockQuantity);
        if (chosenQuantity > stockQuantity) {
          console.log("oops, not enough in stock.");
          console.log("id:" + id + ",", item, "$" + price, "in stock: " + stockQuantity);

          inquirer.prompt([{
            name: "restart",
            type: "confirm",
            message: "Would you like to begin again?",
            default: "yes"
          }]).then(function(answer) {
            if (answer.restart === true) {
              display();
            } else {
              console.log("Thanks for shopping with us at Bamazon!");
            }
          });
        } else {
          console.log('yep, we got enough!');
          //subtract quantity from stock & add up total
          //updateQuantity();
          // console.log("Your total is: $" + x);

        }
      });
    });
  });
} // end display function

//update function
function updateQuantity() {

  connection.query("UPDATE products SET stockQuantity WHERE", function(err, results) {
    if (err) throw err;
  });

}