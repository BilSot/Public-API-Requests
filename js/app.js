/******************************************
 Treehouse Techdegree:
 FSJS project 5 - Public API Requests
 ******************************************/
const apiURL = "https://randomuser.me/api/?results=";
const users = 12;
const nationalities = ['gb', 'us'];
var defaultUsersArr = [];
var filteredArr = [];

window.onload = function () {
    document.querySelector('div.gallery').innerHTML =
        `<h2>Loading...</h2>`;
    fetchData(apiURL + users + "&nat=" + nationalities)
        .then(data => {
            document.querySelector('div.gallery').innerHTML = '';
            defaultUsersArr = data.results;
            generateCards(defaultUsersArr);
            addSearchTextField();
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
    filteredArr = users;
    document.querySelector('div.gallery').innerHTML = '';
    console.log(users);
    for (let i = 0; i < filteredArr.length; i++) {
        let divCard = document.createElement('div');
        divCard.classList.add("card");
        divCard.id = i;

        let divImgContainer = document.createElement('div');
        divImgContainer.classList.add("card-img-container");
        divImgContainer.innerHTML = `<img class="card-img" src=${filteredArr[i].picture.large} alt="profile picture">`;

        let divInfoContainer = document.createElement('div');
        divInfoContainer.classList.add("card-info-container");
        divInfoContainer.innerHTML =
            `<h3 id="name-${i}" class="card-name cap">${filteredArr[i].name.first} ${filteredArr[i].name.last}</h3>
            <p class="card-text">${filteredArr[i].email}</p>
            <p class="card-text cap">${filteredArr[i].location.city}, ${filteredArr[i].location.state}</p>`;

        divCard.appendChild(divImgContainer);
        divCard.appendChild(divInfoContainer);
        document.querySelector('div.gallery').appendChild(divCard);

        $(divCard).click(event => {
            let index = event.target.closest('div.card').id;
            createModal(index);
        });
    }
}

function createModal(index) {
    let divModalContainer = document.createElement('div');
    divModalContainer.classList.add("modal-container");
    divModalContainer.innerHTML =
        `<div class="modal">
           <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        </div>`;
    document.body.appendChild(divModalContainer);

    let divModalInfoContainer = document.createElement('div');
    divModalInfoContainer.classList.add("modal-info-container");
    document.querySelector('div.modal').appendChild(divModalInfoContainer);

    addBrowsingButtons(index);
    displayUserInfo(index);

    $("#modal-close-btn").click(event => $(".modal-container").remove());
}

function displayUserInfo(index) {
    let userObj = filteredArr[index];
    let divModalInfoContainer = document.querySelector('div.modal-info-container');
    let dateOfBirth = userObj.dob.date;
    let dobRegExp = /^(\d{4})-(\d{2})-(\d{2}).+/;
    let match = dateOfBirth.replace(dobRegExp, "$3/$2/$1");

    divModalInfoContainer.innerHTML =
        `<img class="modal-img" src=${userObj.picture.large} alt="profile picture">
        <h3 id="name" class="modal-name cap">${userObj.name.first} ${userObj.name.last}</h3>
        <p class="modal-text">${userObj.email}</p>
        <p class="modal-text cap">${userObj.location.city}</p>
        <hr>
        <p class="modal-text">${userObj.phone}</p>
        <p class="modal-text">${userObj.location.street.number} ${userObj.location.street.name}, ${userObj.location.city}, ${userObj.location.state} ${userObj.location.postcode}</p>
        <p class="modal-text">Birthday: ${match}</p>`;
}

function addBrowsingButtons(index) {
    let divModalButtons = document.createElement('div');
    divModalButtons.classList.add("modal-btn-container");
    divModalButtons.innerHTML =
        `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
         <button type="button" id="modal-next" class="modal-next btn">Next</button>`;
    document.querySelector('div.modal-container').appendChild(divModalButtons);

    $('#modal-prev').click(event => {
        if (index == 0) {
            index = filteredArr.length - 1;
        } else {
            --index;
        }
        $('.modal-info-container').innerHTML = '';
        displayUserInfo(index);
    });

    $('#modal-next').click(event => {
        if (index == filteredArr.length - 1) {
            index = 0;
        } else {
            ++index;
        }
        $('.modal-info-container').innerHTML = '';
        displayUserInfo(index);
    });
}

function addSearchTextField() {
    let divSearchContainer = document.querySelector('div.search-container');

    divSearchContainer.innerHTML += `
                        <form action="#" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                        </form> `;
    //because of string literal, the vanilla JS addEventListener does not trigger on elements
    //for that reason jQuery will be used

    $('.search-input').keyup(event => handleKeyUp(event));
    $('.search-input').mouseup(event => handleMouseup(event));
    $('.search-submit').click(event => handleClick(event));
}

function handleKeyUp(event) {
    let term = event.target.value;
    searchTerm(term);
}

function handleClick(event) {
    event.preventDefault();
    let term = document.querySelector('input#search-input').value;
    searchTerm(term);
}

function handleMouseup(event){
    setTimeout(function(){
        let term = document.querySelector('input#search-input').value;
        if (term === ""){
            searchTerm(term);
        }
    }, 1);
}

function searchTerm(searchTerm) {
    console.log(searchTerm);
    if(searchTerm === ""){
        generateCards(defaultUsersArr);
        return;
    }
    searchTerm = searchTerm.toLowerCase();
    let searchResults = [];
    defaultUsersArr.forEach(user => {
        let userFirstName = user.name.first.toLowerCase();
        let userLastName = user.name.last.toLowerCase();
        if (userFirstName.indexOf(searchTerm) > -1 || userLastName.indexOf(searchTerm) > -1) {
            searchResults.push(user);
        }
    });

    generateCards(searchResults);
}
