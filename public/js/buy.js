"use strict";

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classificationBuyList");
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = "/buy/getInventory/" + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log("There was a problem: ", error.message);
    });
});

// Build inventory items into HTML table components and inject into DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryBuyDisplay");

  // Set up the table headers
  let dataTable = `
    <thead>
      <tr>
        <th>Vehicle Name</th>
        <th>Image</th>
        <th>Miles</th>
        <th>Price</th>
        <th>Buy</th>
      </tr>
    </thead>
    <tbody>
  `;

  // Iterate over the inventory data
  data.forEach(function (element) {
    dataTable += `
      <tr>
        <td id='buyCarTitle'>${element.inv_make} ${element.inv_model}</td>
        <td id='buyImage'><img src="${element.inv_thumbnail}" alt="Image of ${element.inv_make} ${element.inv_model} on CSE Motors" width="150"/></td>
        <td>${element.inv_miles.toLocaleString()} miles</td>
        <td>$${Number(element.inv_price).toLocaleString()}</td>
        <td><a href='/buy/buyForm/${element.inv_id}' title='Click to Buy'>Buy</a></td>
      </tr>
    `;
  });

  dataTable += "</tbody>";
  inventoryDisplay.innerHTML = dataTable;
}

