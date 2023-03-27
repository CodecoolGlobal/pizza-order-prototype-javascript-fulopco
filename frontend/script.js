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
        ${await buttonHandler(beer.id)}
        ${await amountInputHandler(beer.id)}
        </div>`
    )
  );
  rootE.insertAdjacentHTML("beforeend", beersInHTMLStructure.join(""));
}

async function buttonHandler(IDs) {
  document.getElementById(`beer${IDs}`)
  .insertAdjacentHTML("beforeend", `<button id="beerButtonID${IDs}">Click to order!</button>`)
}

async function amountInputHandler(IDs) {
  document.getElementById(`beer${IDs}`)
  .insertAdjacentHTML("beforeend",`<input id="beerInputID${IDs}" type="number" placeholder="Amount..."></input>`)

}

async function fuck (IDs) {
  document.getElementById(`beerInputID${IDs}`).addEventListener("blur", () => {
    let valueOfInput = document.getElementById(`beerInputID${IDs}`).value
    objectToSend.beers.push({ id: IDs, amount: valueOfInput })
    console.log(objectToSend);
  })
}




function main() {
  displayBeers();
}

main();
