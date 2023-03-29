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

// 1) Sörök meghívása
async function fetchBeers() {
  const response = await fetch("/api/beers");
  const beers = await response.json();
  return beers;
}

// 2) Allergének meghívása
async function fetchAllergens() {
  const response = await fetch("/api/allergens");
  const data = await response.json();
  return data;
}

async function displayAllergensNames(beer) {
  const allergens = await fetchAllergens();

  const allergensNames = beer.allergens.map((allergen) => {
    const sameAllergen = allergens.allergens.find((all) => all.id === allergen);
    return sameAllergen.name;
  });
  return allergensNames.join(", ");
}

// 3) Megjelenít az oldalon
async function displayBeers() {
  const data = await fetchBeers();
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
        <p class="detailsType">Style: <span>${beer.type}</span></p>
        <p class="detailsAbv">ABV: <span>${beer.abv}%</span></p>
        <p class="detailsPrice">Price: <span>${beer.price}€</span></p>
        <p class="detailsAllergens">Allergens: <span>${await displayAllergensNames(beer)}</span></p>
    </div>
        <input class="inputClass" id="beerInputID${
          beer.id
        }" type="number" placeholder="Amount..."></input>
        <button class="buttonClass" id="beerButtonID${beer.id}">Click to order!</button>
        </div>`
    )
  );
  rootE.insertAdjacentHTML("beforeend", `<div id="beers">${beersInHTMLStructure.join("")}</div>`);
  //await homeButtonHandler();
  await amountInputHandler();
}

// Part of STYLING---------------------------------------------------------------------

function displayHomePage() {
  //const root = document.getElementById("root");
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
//--------------------------------------------------------------------------------------

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
      if (numberInput.toString()[0] !== "0") {
        objectToSend.beers.push({ id: index + 1, amount: numberInput }); //add to global object
        showAndHideOrder();
        makeHTMLElementsFromOrder();
        console.log(objectToSend);
        document.getElementById(`beerInputID${index + 1}`).value = "";
      } else {
        alert("You can't order zero.");
        document.getElementById(`beerInputID${index + 1}`).value = "";
      }
      showTotalPrice()
    });
  });
}

async function showTotalPrice() {
  let sum = 0
  const data = await fetchBeers()
  if (document.getElementById("totalPrice")) {
    document.getElementById("totalPrice").remove()
  }
  objectToSend.beers.map((eachOrder) => {
   sum += (data.beers[eachOrder.id-1].price * eachOrder.amount)
  })
  document.getElementById("inputsDiv").insertAdjacentHTML("beforebegin", `<div id="totalPrice">${sum.toFixed(2)}€</>`)
}


function addOrderForm() {
  document
    .getElementById("root")
    .insertAdjacentHTML(
      "beforeend",
      `<div id="orderForm"><h3 id="orderTitle">Your Order</h3></div>`
    );
  document.getElementById("orderForm").style.visibility = "hidden";
  createOrderButton();
  addInputFieldsForCostumer();
}

function showAndHideOrder() {
  if (objectToSend.beers.length) {//add cart to webpage
    document.getElementById("orderForm").style.visibility = "visible";
  } else {
    document.getElementById("orderForm").style.visibility = "hidden";
  }
}

async function makeHTMLElementsFromOrder() {
  if (document.getElementById("orders")) {
    document.getElementById("orders").remove();
  }
  const data = await fetchBeers();
  const elements = objectToSend.beers.map((order) => { //add HTML to cart
    const sameBeer = data.beers.find((beer) => beer.id === order.id);
    return `<div id="orderedProduct${sameBeer.id}">
    <span class="orderedProduct">Product: ${sameBeer.name} Amount: ${order.amount}</span>
    <button class="removeButtonClass" id="removeButton${sameBeer.id}">x</button>
    </div><br>`;
  });
  document.getElementById("orderTitle").insertAdjacentHTML("afterend", `<div id="orders">${elements.join("")}</div>`);
  await removeFromCart()
}

async function removeFromCart() {  //remove from global obj + cart
  objectToSend.beers.map((order) => {
    document.getElementById(`removeButton${order.id}`).addEventListener("click", async () => {
      document.getElementById(`orderedProduct${order.id}`).remove();
      const index = order;
      objectToSend.beers.splice(objectToSend.beers.indexOf(order), 1);
      showTotalPrice()
      showAndHideOrder();
      console.log(objectToSend);
    });
  });
}

//-------------------------------------------------------------------------------

function createOrderButton() {
  document
    .getElementById("orderForm")
    .insertAdjacentHTML("beforeend", `<button id="orderButton">Send Order!!!!!!</button>`);
}

// csak akkor lehessen elküldeni, ha az összes adat ki van töltve
async function orderButtonHandler() {
  document.getElementById("orderButton").addEventListener("click", async function () {
    const url = "/api/order/";
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objectToSend),
    };
    const response = await fetch(url, options);
    const data = await response.json();
  });
}

function addInputFieldsForCostumer() {
  document.getElementById("orderButton").insertAdjacentHTML(
    "beforebegin",
    `
  <div id="inputsDiv">
  <h3>Personal Informations</h3>
  <div id="nameInputDiv"><span>Your Name: </span><input id="nameInput" class="costumerInput" placeholder="John Smith"></input></div>
  <div id="emailInputDiv"><span>Your Email: </span><input id="emailInput" class="costumerInput" placeholder="JS@example.com"></input></div>
  <div id="cityInputDiv"><span>City: </span><input id="cityInput" class="costumerInput" placeholder="London"></input></div>
  <div id="streetInputDiv"><span>Street: </span><input id="streetInput" class="costumerInput" placeholder="Abbey Road 3"></input></div>
  </div>
  `
  );
}

function costumerInputsHandler(inputID, character, key1, key2) {
  document.getElementById(inputID).addEventListener("blur", function () {
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

function main() {
  console.log(document.baseURI.endsWith("/beers/list"));
  if (document.baseURI.endsWith("/beers/list")) {
    displayBeers();
    addOrderForm();
    orderButtonHandler();
    costumerInputsHandler("nameInput", " ", "name");
    costumerInputsHandler("emailInput", "@", "email");
    costumerInputsHandler("cityInput", "", "address", "city");
    costumerInputsHandler("streetInput", " ", "address", "street");
  } else {
    displayHomePage();
    homeButtonHandler();
  }
}

main();
