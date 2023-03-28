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
        `<div id="beer${beer.id}">
        <h1>${beer.name}</h1>
        <h2>${beer.brewery}</h2>
        <p class="detailsType">Style: ${beer.type}</p>
        <p class="detailsAbv">ABV: ${beer.abv}%</p>
        <p class="detailsPrice">Price: ${beer.price}€</p>
        <p class="detailsAllergens">Allergens: ${await displayAllergensNames(beer)}</p>
        <button class="buttonClass" id="beerButtonID${beer.id}">Click to order!</button>
        <input class="inputClass" id="beerInputID${beer.id}" type="number" placeholder="Amount..."></input>
        </div>`
    )
  );
  rootE.insertAdjacentHTML("beforeend", beersInHTMLStructure.join(""));
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



function main() {
  displayBeers();
}

main();
