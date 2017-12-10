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
    // once you have the items, prompt the user for which they'd like to bid on
    // inquirer
    //   .prompt([{
    //       name: "choice",
    //       type: "list",
    //       choices: function() {
    //         var choiceArray = [];
    //         for (var i = 0; i < results.length; i++) {
    //           choiceArray.push(results[i].item_name);
    //         }
    //         return choiceArray;
    //       },
    //       message: "What auction would you like to place a bid in?"
    //     },
    //     {
    //       name: "bid",
    //       type: "input",
    //       message: "How much would you like to bid?"
    //     }
    //   ])
    //   .then(function(answer) {
    //     // get the information of the chosen item
    //     var chosenItem;
    //     for (var i = 0; i < results.length; i++) {
    //       if (results[i].item_name === answer.choice) {
    //         chosenItem = results[i];
    //       }
    //     }
    //
    //     // determine if bid was high enough
    //     if (chosenItem.highest_bid < parseInt(answer.bid)) {
    //       // bid was high enough, so update db, let the user know, and start over
    //       connection.query(
    //         "UPDATE auctions SET ? WHERE ?", [{
    //             highest_bid: answer.bid
    //           },
    //           {
    //             id: chosenItem.id
    //           }
    //         ],
    //         function(error) {
    //           if (error) throw err;
    //           console.log("Bid placed successfully!");
    //           start();
    //         }
    //       );
    //     } else {
    //       // bid wasn't high enough, so apologize and start over
    //       console.log("Your bid was too low. Try again...");
    //     }
    //   });
  });
} // end display function