const objectToSend = {
  id: "",
  beers: [
  ],
  date: {
    year: 2022,
    month: 6,
    day: 7,
    hour: 18,
    minute: 47,
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
        <input class="inputClass" id="beerInputID${beer.id}" type="number" placeholder="Amount..."></input>
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
  <p id="greetings">Welcome on CEFRE Shop!<p>
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
      let numberInnput = document.getElementById(`beerInputID${index + 1}`).value
      if(numberInnput.toString()[0] !== "0") {

      }
      objectToSend.beers.push({ id: index + 1, amount: numberInnput }); //add to global object
      showAndHideOrder()
      makeHTMLElementsFromOrder()
      console.log(objectToSend);
    });
  });
}

function addOrderForm() {
    document.getElementById("root").insertAdjacentHTML("beforeend", `<div id="orderForm"><h3 id="orderTitle">Your Order</h3></div>`)
    document.getElementById("orderForm").style.visibility = "hidden"
    createOrderButton();
}

function showAndHideOrder() {
  if (objectToSend.beers.length) { //add cart to webpage
    document.getElementById("orderForm").style.visibility = "visible"
  } else {
    document.getElementById("orderForm").style.visibility = "hidden"
  }
}


async function makeHTMLElementsFromOrder() {
  if (document.getElementById("orders")) {
    document.getElementById("orders").remove()
  }
  const data = await fetchBeers()
  const elements = objectToSend.beers.map(order => {  //add HTML to cart
    const sameBeer = data.beers.find((beer) => beer.id === order.id)
    return `<div id="orderedProduct${sameBeer.id}">
    <span class="orderedProduct">Prdoduct: ${sameBeer.name} Amount: ${order.amount}</span>
    <button class="removeButtonClass" id="removeButton${sameBeer.id}">x</button>
    </div><br>`
  })
  document.getElementById("orderTitle").insertAdjacentHTML("afterend", `<div id="orders">${elements.join("")}</div>`)
  await removeFromCart()

}


async function removeFromCart() {
  objectToSend.beers.map(order => {
    console.log(order.id);
    document.getElementById(`removeButton${order.id}`).addEventListener("click", () => {
      document.getElementById(`orderedProduct${order.id}`).remove()
      const index = order
      objectToSend.beers.splice(objectToSend.beers.indexOf(order), 1)
      console.log(objectToSend);
      showAndHideOrder()

    })
  })
}


//-------------------------------------------------------------------------------

function createOrderButton (){
  document.getElementById("orderForm").insertAdjacentHTML("beforeend", `<button id="orderButton">Send Order!!!!!!</button>`)
}

async function orderButtonHandler(){
  document.getElementById("orderButton").addEventListener("click", async function () {
   const url = "/api/order/";
   const options = {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(objectToSend)
   }
   const response = await fetch(url, options);
   const data = await response.json();
  })
};

function main() {
  console.log(document.baseURI.endsWith("/beers/list"));
  if (document.baseURI.endsWith("/beers/list")) {
    displayBeers();
    addOrderForm();
    orderButtonHandler()
  } else {
    displayHomePage();
    homeButtonHandler();
  }
}

main();
