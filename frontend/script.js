







function displayBeers(beers) {
  const rootE = document.getElementById("root")
  const beersInHTMLStructure = beers.map(beer =>
    `<div id=beer${beer.id}>
    <h1>${beer.name}</h1>
    <h2>${beer.brewery}</h2>
    <p class ="detailsType>${beer.type}</p>
    <p class ="detailsAbv>${beer.abv}</p>
    <p class ="detailsPrice>${beer.price}</p>
    <p class ="detailsAllergens>${beer.allergens}</p>
    </div>` )
  rootE.insertAdjacentHTML("beforeend", beersInHTMLStructure.join(""))
}

function main() {
  fetchBeers()
}

main()