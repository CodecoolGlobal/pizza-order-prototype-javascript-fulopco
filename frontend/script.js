const objectToSend =
{
  id: "",
  beers: [
    //{id: 1, amount: 2}
  ],
  date: {
    year: 2022,
    month: 6,
    day: 7,
    hour: 18,
    minute: 47
  },
  customer: {
    name: "",
    email: "",
    address: {
      city: "",
      street: ""
    }
  }
}


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
    data.beers.map( async (beer) =>
        `<div id="beer${beer.id}" class="beer">

    <div class="picDiv">
    <img src="https://madscientist.hu/wp-content/uploads/2019/04/IMG_20200225_102220-e1666270711222.jpg
    ">
    </div>
    
    <div class="beerDiv">
        <h1>${beer.name}</h1>
        <p><span>by </span><span id="detailsBrew">${beer.brewery}</span></p>
        <p class="detailsType">Style: <span>${beer.type}</span></p>
        <p class="detailsAbv">ABV: <span>${beer.abv}%</span></p>
        <p class="detailsPrice">Price: <span>${beer.price}€</span></p>
        <p class="detailsAllergens">Allergens: <span>${await displayAllergensNames(beer)}</span></p>
    </div>
        <button class="buttonClass" id="beerButtonID${beer.id}">Click to order!</button>
        <input class="inputClass" id="beerInputID${beer.id}" type="number" placeholder="Amount..."></input>
        </div>`
    )
  );
  rootE.insertAdjacentHTML("beforeend", `<div id="beers">${beersInHTMLStructure.join("")}</div>`);
  //await addOrderForm();
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

function homeButtonHandler() {
  document.getElementById("homeButton").addEventListener("click", function () {
    location.assign("http://127.0.0.1:9000/beers/list");
  });
  await amountInputHandler()
}

async function amountInputHandler() {
   document.querySelectorAll(".inputClass").forEach((element, index) => {
    element.addEventListener("blur", () => {
    
    objectToSend.beers.push({ id: index +1, amount: element.value })
    console.log(objectToSend);
  })
  })
}



// ezt a plusz div-es dolgot nem tudom megoldani, lehet egy új page kellene
// ami behozza az inputot meg a kosarat
function addOrderForm() {
  document
    .getElementById("root")
    .insertAdjacentHTML("beforeend", '<div id="orderForm">Your Order</div>');
}
//-------------------------------------------------------------------------------
function main() {
  console.log(document.baseURI.endsWith("/beers/list"));
  if (document.baseURI.endsWith("/beers/list")) {
    displayBeers();
    addOrderForm();
  } else {
    displayHomePage();
    homeButtonHandler();
  }
}

main();
