const button = document.getElementById('searchBar');
const cardContainer = document.getElementById('container');
const typeSelector = document.getElementById('typeSelector');
const searchNameResult = document.getElementById('searchName');
let result = [];
let type = 'repositories';
let searchName = '';

typeSelector.addEventListener('change', (event) => {
  type = event.target.value;
  console.log(type);
});

function populateCards() {
  cardContainer.innerHTML = '';
  result.forEach(card => {
      // Crea un nuovo elemento per la card
      const cardElement = document.createElement('div');
      // Aggiungi il contenuto della card
      if(type === 'repositories') { // Modifica qui
        cardElement.innerHTML = `
            <div class="content-card">
                <img src="${card.image}" class="card-image" alt="${card.name}"> <!-- Modifica qui -->
                <div class="card-body">
                    <h5 class="card-title">${card.name}</h5>
                    <p class="card-text">${card.description}</p>
                </div>
            </div>
        `;
      } else {
        cardElement.innerHTML = `
            <div class="content-card">
                <img src="${card.image}" class="card-image" alt="${card.name}"> <!-- Modifica qui -->
                <div class="card-body">
                    <h5 class="card-title">${card.name}</h5>
                </div>
            </div>
        `;
      }
      cardContainer.appendChild(cardElement);
  });
}

const search = () => {
    result = [];
    searchName = searchNameResult.value;
    let url = ''
    if(type == 'repositories'){
      if(searchName != ''){
        url = `https://api.github.com/repos/${searchName}`;
      } else {
        url = `https://api.github.com/repositories`
      }
    } else {
      if(searchName != ''){
        url = `https://api.github.com/users/${searchName}`;
      } else {
        url = `https://api.github.com/users`;
      }
    }
    console.log(url);
    axios.get(url)
        .then(function (response) {
            console.log(response.data);
            if(type === 'repositories') {
              response.data.forEach((element) => {
                result.push({
                  name: element.name,
                  description: element.description,
                  image: element.owner.avatar_url
                });
              });
            } else {
              if(Array.isArray(response.data)){
                response.data.forEach((element) => {
                  result.push({
                    name: element.login,
                    image: element.avatar_url
                  });
                });
              } else {
                result.push({
                  name: response.data.login,
                  image: response.data.avatar_url
                });
              }
            }
            console.log(result);
            populateCards();
        })
        .catch(function (error) {
            console.error('Errore durante la richiesta:', error);
            cardContainer.innerHTML = '<div class="noResults">No results</div>';
        });
}

button.addEventListener('click', search);
