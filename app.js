/*
Chuck norris IO calls;
Fetch one random quote:
(GET) https://api.chucknorris.io/jokes/random 

Fetch one random quote from a category:
(GET) https://api.chucknorris.io/jokes/random?category={category}

Fetch all categories:
(GET) https://api.chucknorris.io/jokes/categories

Chuck norris categories:
animal, career, celebrity,
dev, explicit, fashion,
food, history, money,
movie, music, political,
religion, science, sport,
travel.

Text search for quotes:
(GET) https://api.chucknorris.io/jokes/search?query={query}

Useless facts API:
https://uselessfacts.jsph.pl

Get today's useless fact;
(GET) https://uselessfacts.jsph.pl/api/v2/facts/today

Get a random useless fact;
(GET) https://uselessfacts.jsph.pl/api/v2/facts/random
*/

const chucknorris_category_options = document.getElementById(
  "chuck-norris-category"
);
const chuckNorrisOptionValue = chucknorris_category_options.value;
const fetchContainer = document.getElementById("fetch-container");
const useless_category_options = document.getElementById(
  "useless-facts-category"
);

const chuckBtn = document.getElementById("get-chuck");
const factBtn = document.getElementById("get-fact");

const CHUCK_NORRIS_URL = "https://api.chucknorris.io/jokes";
const USELESS_FACTS_URL = "https://uselessfacts.jsph.pl/api/v2/facts";

// for populating the select dropdown with code.
const chucknorris_category_array = [
  "animal",
  "career",
  "celebrity",
  "dev",
  "explicit",
  "fashion",
  "food",
  "history",
  "money",
  "movie",
  "music",
  "political",
  "religion",
  "science",
  "sport",
  "travel",
];

chuckBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  chuckBtn.disabled = true;
  chuckBtn.textContent = "Please wait...";
  fetchContainer.append(await makeCard("chuck"));
  setTimeout(() => {
    chuckBtn.disabled = false;
    chuckBtn.textContent = "Get a Chuck Norris Joke";
  }, 1000);
});

factBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  factBtn.disabled = true;
  factBtn.textContent = "Please wait...";
  fetchContainer.append(await makeCard("useless"));
  setTimeout(() => {
    factBtn.disabled = false;
    factBtn.textContent = "Get a Useless Fact";
  }, 1000);
});

window.onload = async () => {
  // populate the chuck norris select form
  chucknorris_category_array.forEach((category) => {
    const formOption = document.createElement("option");
    formOption.value = category;
    formOption.textContent = category[0].toUpperCase() + category.slice(1);
    chucknorris_category_options.append(formOption);
  });

  // add in Today's useless fact by default
  useless_category_options.value = "today"; // Making sure it fetches from today's random fact
  fetchContainer.append(await makeCard("useless"));
  useless_category_options.value = "random"; // Set it to random afterwards so the user doesn't have to select it from the dropdown menu to get more facts.
};

const makeCard = async (type) => {
  const cardContainer = document.createElement("article");
  cardContainer.classList.add("card");

  const subtitleText = document.createElement("p");
  subtitleText.classList.add("italic");

  switch (type) {
    case "chuck":
      const [fetchedJoke, fetchedChuckSource] = await fetchChuckNorris();
      subtitleText.textContent = `A ${chuckNorrisOptionValue} Chuck Norris Joke`;

      const jokeText = document.createElement("p");
      jokeText.classList.add("bold");
      jokeText.textContent = fetchedJoke;

      const chuckSource = document.createElement("a");
      chuckSource.href = fetchedChuckSource;
      chuckSource.setAttribute("target", "_blank");
      chuckSource.textContent = "Source to the joke";
      if (!fetchedChuckSource) chuckSource.style.display = "none"; // No need to display it if there is no url

      cardContainer.append(subtitleText, jokeText, chuckSource);
      break;

    case "useless":
      const [fetchedText, fetchedUselessSource] = await fetchUselessFact();
      subtitleText.textContent = `${
        useless_category_options.value === "today" ? "Today's" : "A Random"
      } Useless Fact`;

      const factText = document.createElement("p");
      factText.classList.add("bold");
      factText.textContent = fetchedText;

      const sourceText = document.createElement("a");
      sourceText.href = fetchedUselessSource;
      sourceText.setAttribute("target", "_blank");
      sourceText.textContent = "Source to the fact";
      if (!fetchedUselessSource) sourceText.style.display = "none";

      cardContainer.append(subtitleText, factText, sourceText);
      break;
  }
  fetchContainer.replaceChildren(); // replace children here before returning to make it so the card doesn't disappear while we are fetching a new one.
  return cardContainer;
};

const fetchChuckNorris = async () => {
  try {
    const response = await fetch(
      `${CHUCK_NORRIS_URL}/random${
        chuckNorrisOptionValue === "random"
          ? ""
          : `?category=${chuckNorrisOptionValue}`
      }`
    );
    const resultBody = await response.json();
    return [resultBody.value, resultBody.url]; // could probably use map here, but just as easy to go with an array with dot notation due to just 2 values.
  } catch (err) {
    console.log(err);
    return [
      "Something went wrong when trying to fetch a joke - Sorry about that",
    ];
  }
};

const fetchUselessFact = async () => {
  try {
    const response = await fetch(
      `${USELESS_FACTS_URL}/${useless_category_options.value}`
    );
    const resultBody = await response.json();
    return [resultBody.text, resultBody.source_url];
  } catch (err) {
    console.log(err);
    return [
      "Something went wrong when trying to fetch a fact - Sorry about that",
    ];
  }
};
