let specTime = new Date();

const objectToSend = {
  id: "",
  beers: [],
  date: {
    year: specTime.getFullYear(),
    month: specTime.getMonth() + 1,
    day: specTime.getDate(),
    hour: specTime.getHours(),
    minute: specTime.getMinutes(),
  },
  customer: {
    name: "",
    email: "",
    address: {
      city: "",
      street: "",
    },
  },
};

async function fetchDetails(path) {
  const response = await fetch(path);
  const data = await response.json();
  return data;
}

function displayHomePage() {
  const innerHTML = `<div id="home">
  <p id="greetings">Welcome to CEFRE Shop!<p>
  <button id="homeButton"> BEERS </button><br>
  <p id="enjoy">🍺 Enjoy your beer! 🍺</p>
  </div>`;
  document.getElementById("root").insertAdjacentHTML("beforeend", innerHTML);
}

async function homeButtonHandler() {
  document.getElementById("homeButton").addEventListener("click", function () {
    location.assign("http://127.0.0.1:9000/beers/list");
  });
}

async function displayBeers() {
  const data = await fetchDetails("/api/beers");
  const rootE = document.getElementById("root");

  const beersInHTMLStructure = await Promise.all(
    data.beers.map(
      async (beer) =>
        `<div id="beer${beer.id}" class="beer">

        <div class="picDiv">
          <img src="${beer.src}">
         </div>
    
        <div class="beerDiv">
          <h1>${beer.name}</h1>
          <p><span>by </span><span id="detailsBrew">${beer.brewery}</span></p>
          <p class="detailsType">Style: <span class="boldSpan">${beer.type}</span></p>
          <p class="detailsAbv">ABV: <span class="boldSpan">${beer.abv}%</span></p>
          <p class="detailsPrice">Price: <span class="boldSpan">${beer.price}€</span></p>
          <p class="detailsAllergens">Allergens: <span class="boldSpan">${await displayAllergensNames(
            beer
          )}</span></p>
        </div>

        <input class="inputClass" id="beerInputID${beer.id}" type="number" placeholder="Amount...">
        </input>
        
        <button class="buttonClass" id="beerButtonID${beer.id}">Click to order!</button>
      </div>`
    )
  );
  rootE.insertAdjacentHTML("beforeend", `<div id="beers">${beersInHTMLStructure.join("")}</div>`);
  await amountInputHandler();
}

async function displayAllergensNames(beer) {
  const allergens = await fetchDetails("/api/allergens");
  const allergensNames = beer.allergens.map((allergen) => {
    const sameAllergen = allergens.allergens.find((all) => all.id === allergen);
    return sameAllergen.name;
  });
  return allergensNames.join(", ");
}

async function amountInputHandler() {
  document.querySelectorAll(".buttonClass").forEach((element, index) => {
    element.addEventListener("click", async () => {
      objectToSend.beers.map((orderElement) => {
        if (orderElement.id === index + 1) {
          const indexOfdelete = objectToSend.beers.indexOf(orderElement);
          objectToSend.beers.splice(indexOfdelete, 1);
        }
      });
      let numberInput = document.getElementById(`beerInputID${index + 1}`).value;
      if (numberInput[0] > 0) {
        objectToSend.beers.push({ id: index + 1, amount: numberInput });
        showAndHideOrder();
        makeHTMLElementsFromOrder();
        document.getElementById(`beerInputID${index + 1}`).value = "";
      } else {
        alert("You can't order zero or less...");
        document.getElementById(`beerInputID${index + 1}`).value = "";
      }
      showTotalPrice();
    });
  });
}

async function makeHTMLElementsFromOrder() {
  if (document.getElementById("orders")) {
    document.getElementById("orders").remove();
  }
  const data = await fetchDetails("/api/beers");
  const elements = objectToSend.beers.map((order) => {
    const sameBeer = data.beers.find((beer) => beer.id === order.id);
    return `<div id="orderedProduct${sameBeer.id}" class="ordered">
    <span class="orderedProduct"><span class="boldSpan">${sameBeer.name}</span> Amount: <span class="boldSpan">${order.amount}</span></span>
    <button class="removeButtonClass" id="removeButton${sameBeer.id}">x</button>
    </div>`;
  });
  document
    .getElementById("orderTitleUnderLine")
    .insertAdjacentHTML("afterend", `<div id="orders">${elements.join("")}</div>`);
  await removeFromCart();
}

async function removeFromCart() {
  objectToSend.beers.map((order) => {
    document.getElementById(`removeButton${order.id}`).addEventListener("click", async () => {
      document.getElementById(`orderedProduct${order.id}`).remove();
      const index = order;
      objectToSend.beers.splice(objectToSend.beers.indexOf(order), 1);
      showTotalPrice();
      showAndHideOrder();
    });
  });
}

async function showTotalPrice() {
  let sum = 0;
  const data = await fetchDetails("/api/beers");
  if (document.getElementById("totalPrice")) {
    document.getElementById("totalPrice").remove();
  }
  objectToSend.beers.map((eachOrder) => {
    sum += data.beers[eachOrder.id - 1].price * eachOrder.amount;
  });
  document
    .getElementById("inputsDiv")
    .insertAdjacentHTML("beforebegin", `<div id="totalPrice">Total Price: ${sum.toFixed(2)}€</>`);
}

function showAndHideOrder() {
  if (objectToSend.beers.length) {
    document.getElementById("orderForm").style.visibility = "visible";
  } else {
    document.getElementById("orderForm").style.visibility = "hidden";
  }
}

function addOrderForm() {
  document.getElementById("root").insertAdjacentHTML(
    "beforeend",
    `<div id="orderForm">
      <h3 id="orderTitle">Your Order</h3>
      <p id="orderTitleUnderLine" class="underLine"></p>
      </div>`
  );
  document.getElementById("orderForm").style.visibility = "hidden";
}

function createOrderButton() {
  document
    .getElementById("inputsForm")
    .insertAdjacentHTML("beforeend", `<button id="orderButton" type="submit">Send Order!</button>`);
}

async function orderFormHandler() {
  document.getElementById("orderForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const orderData = await fetchDetails("/api/order");
    objectToSend.id = orderData.orders.length + 1;
    const url = "/api/order/";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objectToSend),
    };
    const response = await fetch(url, options);
    const data = await response.json();
    location.assign("http://127.0.0.1:9000/beers/end");
  });
}

function addInputFieldsForCostumer() {
  document.getElementById("orderForm").insertAdjacentHTML(
    "beforeend",
    `
  <form id="inputsForm">
  <div id="inputsDiv">
  <h3>Personal Informations</h3>
  <p class="underLine"></p>
  <div id="nameInputDiv" class="inputF"><span class="boldSpan">Your Name: </span><input id="nameInput" class="costumerInput" type="text" placeholder="John Smith" required></input></div>
  <div id="emailInputDiv" class="inputF"><span class="boldSpan">Your Email: </span><input id="emailInput" class="costumerInput" type="email" placeholder="JS@example.com" required></input></div>
  <div id="cityInputDiv" class="inputF"><span class="boldSpan">City: </span><input id="cityInput" class="costumerInput" type="text" placeholder="London" required></input></div>
  <div id="streetInputDiv" class="inputF"><span class="boldSpan">Street: </span><input id="streetInput" class="costumerInput" type="text" placeholder="Abbey Road 3" required></input></div>
  </div><form>
  `
  );
}

function costumerInputsHandler(inputID, character, key1, key2) {
  document.getElementById(inputID).addEventListener("change", function () {
    if (document.getElementById(inputID).value.includes(character)) {
      if (key2) {
        objectToSend.customer[key1][key2] = document.getElementById(inputID).value;
      } else {
        objectToSend.customer[key1] = document.getElementById(inputID).value;
      }
    } else if (key2) {
      alert(`Please fill your ${key2} in a correct form!`);
    } else {
      alert(`Please fill your ${key1} in a correct form!`);
    }
  });
}

function endPageCreator() {
  document.getElementById("root").insertAdjacentHTML("beforeend", `<div id="endPage"></div>`);
  document
    .getElementById("endPage")
    .insertAdjacentHTML(
      "beforeend",
      `<button id="thankButton"><center>Thank you for your order!</center></button>`
    );
  document.getElementById("thankButton").addEventListener("click", function () {
    location.assign("http://127.0.0.1:9000");
  });
}

function main() {
  if (document.baseURI.endsWith("/beers/list")) {
    displayBeers();
    addOrderForm();
    orderFormHandler();
    addInputFieldsForCostumer();
    createOrderButton();
    costumerInputsHandler("nameInput", " ", "name");
    costumerInputsHandler("emailInput", "", "email");
    costumerInputsHandler("cityInput", "", "address", "city");
    costumerInputsHandler("streetInput", " ", "address", "street");
  } else if (document.baseURI.endsWith("/beers/end")) {
    endPageCreator();
  } else {
    displayHomePage();
    homeButtonHandler();
  }
}

main();
