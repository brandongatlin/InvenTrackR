//global variables
var mysql = require("mysql");
var inquirer = require("inquirer");

// var Table = require('cli-table');

// instantiate
// var table = new Table({
//   head: ['ID', 'Product', 'Department', 'Price', 'In Stock'],
//   colWidths: [100, 200, 200, 100, 100]
// });
//
// // table is an Array, so you can `push`, `unshift`, `splice`
// // and friends
// table.push(
//   ['id', 'id'], ['First value', 'Second value']
// );
//
// console.log(table.toString());

var item;
var price;
var id;
var stockQuantity;
var chosenQuantity;
var total = (price * chosenQuantity);

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



      // console.log("loop stockQuantity: ", stockQuantity);

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

      for (var i = 0; i < results.length; i++) {

        if (answer.item_choice == results[i].item_id) {
          item = results[i].product_name;
          price = results[i].price;
          stockQuantity = results[i].stock_quantity;
        }
      }

      var currentId = answer.item_choice;

      console.log(item);
      console.log("# in Stock:", stockQuantity);
      console.log("price:", price);


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
        chosenQuantity = parseInt(answer.quantity_choice);

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
          updateQuantity(stockQuantity - chosenQuantity, currentId);

          total = (price * chosenQuantity);

          console.log("Your total is: $" + total);

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

        }
      });
    });
  });
} // end display function

//update function
function updateQuantity(quantity, id) {

  connection.query("UPDATE products SET ? WHERE ?", [{
    "stock_quantity": quantity
  }, {
    "item_id": id
  }], function(err, results) {
    if (err) throw err;
  });

}