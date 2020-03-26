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

        $(divCard).click( event => {
            createModal();
            let index = event.target.closest('div.card').id;
            displayUserInfo(index);
        });
    }
}

function createModal(){
    let divModalContainer = document.createElement('div');
    divModalContainer.classList.add("modal-container");
    divModalContainer.innerHTML =
        `<div class="modal">
           <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        </div>`;
    document.body.appendChild(divModalContainer);

    $("#modal-close-btn").click(event => $(".modal-container").remove());
}

function displayUserInfo(index){
    var userObj = usersArr[index];
    console.log(userObj);
    let divModalInfoContainer = document.createElement('div');
    divModalInfoContainer.classList.add("modal-info-container");
    let dateOfBirth = userObj.dob.date;
    let dobRegExp = /^(\d{4})-(\d{2})-(\d{2}).+/;
    let match = dateOfBirth.replace(dobRegExp, "$3/$2/$1");
    console.log(match);
    divModalInfoContainer.innerHTML =
        `<img class="modal-img" src=${userObj.picture.large} alt="profile picture">
        <h3 id="name" class="modal-name cap">${userObj.name.first} ${userObj.name.last}</h3>
        <p class="modal-text">${userObj.email}</p>
        <p class="modal-text cap">${userObj.location.city}</p>
        <hr>
        <p class="modal-text">${userObj.phone}</p>
        <p class="modal-text">${userObj.location.street.number} ${userObj.location.street.name}, ${userObj.location.city}, ${userObj.location.state} ${userObj.location.postcode}</p>
        <p class="modal-text">Birthday: ${match}</p>`;
    $('.modal').append(divModalInfoContainer);
}
