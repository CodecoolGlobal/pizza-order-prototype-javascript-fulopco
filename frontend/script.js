function fetchBeers() {
  fetch("/api/beers")
    .then((res) => res.json())
    .then((data) => {
      displayBeers(data);
    });
}
