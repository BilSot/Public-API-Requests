/******************************************
 Treehouse Techdegree:
 FSJS project 5 - Public API Requests
 ******************************************/
const apiURL = "https://randomuser.me/api/?results=";
const users = 12;
const nationalities = ['gb', 'us'];
var usersArr = [];

window.onload = function () {
    document.querySelector('div.gallery').innerHTML =
        `<h2>Loading...</h2>`;
    fetchData(apiURL + users + "&nat=" + nationalities)
        .then(data => {
            document.querySelector('div.gallery').innerHTML = '';
            usersArr = data.results;
            generateCards(usersArr);
        })
        .catch(err => {
            document.querySelector('div.gallery').innerHTML = `<h2>Please try again later. Some issue in the network</h2>`;
            console.error(err);
        })
};

function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(err => console.error("Error while fetching data", err))
}

function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

function generateCards(users) {
    //console.log(users);
    for (let i = 0; i < users.length; i++) {
        let divCard = document.createElement('div');
        divCard.classList.add("card");
        divCard.id = i;

        let divImgContainer = document.createElement('div');
        divImgContainer.classList.add("card-img-container");
        divImgContainer.innerHTML = `<img class="card-img" src=${users[i].picture.large} alt="profile picture">`;

        let divInfoContainer = document.createElement('div');
        divInfoContainer.classList.add("card-info-container");
        divInfoContainer.innerHTML =
            `<h3 id="name-${i}" class="card-name cap">${users[i].name.first} ${users[i].name.last}</h3>
            <p class="card-text">${users[i].email}</p>
            <p class="card-text cap">${users[i].location.city}, ${users[i].location.state}</p>`;

        divCard.appendChild(divImgContainer);
        divCard.appendChild(divInfoContainer);
        document.querySelector('div.gallery').appendChild(divCard);
        divCard.addEventListener('click', function(event){
            event.stopPropagation();
            console.log(event.target);
        })
    }
}
