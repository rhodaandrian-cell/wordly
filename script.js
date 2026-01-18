const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const word = input.value.trim();

  if (word === "") {
    showError("Please enter a word.");
    return;
  }

  fetchWord(word);
});

function fetchWord(word) {
  results.innerHTML = "<p>Loading...</p>";

  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })
    .then(data => displayWord(data[0]))
    .catch(() => showError("Word not found. Please try another word."));
}

function displayWord(data) {
  const word = data.word;
  const meaning = data.meanings[0];
  const definition = meaning.definitions[0].definition;
  const partOfSpeech = meaning.partOfSpeech;
  const example = meaning.definitions[0].example || "No example available.";

  let audioHTML = "";
  if (data.phonetics && data.phonetics[0]?.audio) {
    audioHTML = `
      <audio controls>
        <source src="${data.phonetics[0].audio}" type="audio/mpeg">
      </audio>
    `;
  }

  results.innerHTML = `
    <div class="word">${word}</div>
    <div class="part-of-speech">${partOfSpeech}</div>
    <p class="definition"><strong>Definition:</strong> ${definition}</p>
    <p><strong>Example:</strong> ${example}</p>
    ${audioHTML}
  `;
}

function showError(message) {
  results.innerHTML = `<p class="error">${message}</p>`;
}
