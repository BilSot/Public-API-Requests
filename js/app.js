/******************************************
 Treehouse Techdegree:
 FSJS project 5 - Public API Requests
 ******************************************/
const apiURL = "https://randomuser.me/api/?results=";
const users = 12;
const nationalities = ['gb', 'us'];
var userDataArray = [];
var filteredArray = [];

window.onload = function () {
    document.querySelector('div.gallery').innerHTML =
        `<h2>Loading...</h2>`;
    fetchData(apiURL + users + "&nat=" + nationalities)
        .then(data => {
            document.querySelector('div.gallery').innerHTML = '';
            userDataArray = data.results;
            generateCards(userDataArray);
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
    if(users.length == 0){
        document.querySelector('div.gallery').innerHTML = `<h2>No employees found</h2>`;
    }else {
        filteredArray = users;
        document.querySelector('div.gallery').innerHTML = '';

        for (let i = 0; i < filteredArray.length; i++) {
            let divCard = document.createElement('div');
            divCard.classList.add("card");
            divCard.id = i;

            let divImgContainer = document.createElement('div');
            divImgContainer.classList.add("card-img-container");
            divImgContainer.innerHTML = `<img class="card-img" src=${filteredArray[i].picture.large} alt="profile picture">`;

            let divInfoContainer = document.createElement('div');
            divInfoContainer.classList.add("card-info-container");
            divInfoContainer.innerHTML =
                `<h3 id="name-${i}" class="card-name cap">${filteredArray[i].name.first} ${filteredArray[i].name.last}</h3>
                <p class="card-text">${filteredArray[i].email}</p>
                <p class="card-text cap">${filteredArray[i].location.city}, ${filteredArray[i].location.state}</p>`;

            divCard.appendChild(divImgContainer);
            divCard.appendChild(divInfoContainer);
            document.querySelector('div.gallery').appendChild(divCard);

            $(divCard).click(event => {
                let userDataIndex = event.target.closest('div.card').id;
                createModal();
                addBrowsingButtons(userDataIndex);
                displayUserInfo(userDataIndex);
            });
        }
    }
}

function createModal() {
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
    document.querySelector('div.modal').classList.add( 'zoomIn',  'animated');

    $("#modal-close-btn").click(event => {
        $('.modal').attr('class', 'modal  zoomOut  animated');
        $('.modal-btn-container').attr('class', 'modal-btn-container  zoomOut  animated');
        setTimeout(function(){
            $(".modal-container").remove();
        }, 500);
    });
}

function displayUserInfo(userDataIndex) {
    let userObj = filteredArray[userDataIndex];
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

function addBrowsingButtons(userDataIndex) {
    let divModalButtons = document.createElement('div');
    divModalButtons.classList.add("modal-btn-container");
    divModalButtons.innerHTML =
        `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
         <button type="button" id="modal-next" class="modal-next btn">Next</button>`;
    document.querySelector('div.modal-container').appendChild(divModalButtons);
    divModalButtons.classList.add( 'zoomIn',  'animated');

    $('#modal-prev').click(event => {
        if (userDataIndex == 0) {
            userDataIndex = filteredArray.length - 1;
        } else {
            --userDataIndex;
        }
        $('.modal-info-container').html("");
        displayUserInfo(userDataIndex);
    });

    $('#modal-next').click(event => {
        if (userDataIndex == filteredArray.length - 1) {
            userDataIndex = 0;
        } else {
            ++userDataIndex;
        }
        $('.modal-info-container').html("");
        displayUserInfo(userDataIndex);
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
    if(searchTerm === ""){
        generateCards(userDataArray);
        return;
    }
    searchTerm = searchTerm.toLowerCase();
    let searchResults = [];
    userDataArray.forEach(user => {
        let userFirstName = user.name.first.toLowerCase();
        let userLastName = user.name.last.toLowerCase();
        if (userFirstName.indexOf(searchTerm) > -1 || userLastName.indexOf(searchTerm) > -1) {
            searchResults.push(user);
        }
    });

    generateCards(searchResults);
}
