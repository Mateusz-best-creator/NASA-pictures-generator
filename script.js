const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

// NASA API
const count = 5;
const apiKey = 'w9K3Koj3YJTdofmhTxp89fIYCTTzg5HtTmoV4zLv';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
    // Change nav bar name
    if (page == 'favorites') {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    } else {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    })
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    currentArray = page === 'favorites' ? Object.values(favorites) : resultsArray;
    currentArray.forEach((result) => {
        // Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the day';
        // image.loading = 'lazy'; => better user experience
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card title
        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.textContent = result.title;
        // Save text
        const addFavorites = document.createElement('p');
        addFavorites.classList.add('clickable');
        if (page === 'results') {
            addFavorites.textContent = 'Add Favorites';
            addFavorites.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            addFavorites.textContent = 'Remove Favorite';
            addFavorites.setAttribute('onclick', `removeFavorite('${result.url}')`);
        }
        // Card Text
        const text = document.createElement('p');
        text.classList.add('card-text');
        text.textContent = result.explanation;
        // small element
        const smallElement = document.createElement('small');
        smallElement.classList.add('text-muted');
        // Strong and span
        const strongElement = document.createElement('strong');
        strongElement.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = `${copyrightResult}`;

        // Append everything
        link.appendChild(image);
        smallElement.append(strongElement, copyright);
        cardBody.append(title, addFavorites, text, smallElement);
        // adding to images-container
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDom(page) {
    // Get Favorities from localStorage
    if (localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 images from api
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDom('results');
    } catch (error) {
        console.log("Error! : ", error);
    }
}

// Add result to Favorites
function saveFavorite(itemUrl) {
    // Loop through Results Array
    resultsArray.forEach((item) => {
        // !favorites[itemUrl] => we don't want to run code if we have arleady added that element to our list
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
            favorites[itemUrl] = item;
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
            // Show save confirmation
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000)
        }
    })
}

// Remove item from favorites
function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        // Update local storage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDom('favorites');
    }
}

// On Load
getNasaPictures();