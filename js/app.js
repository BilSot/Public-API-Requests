/******************************************
 Treehouse Techdegree:
 FSJS project 5 - Public API Requests
 ******************************************/
const apiURL = "https://randomuser.me/api/?results=";
const users = 12;
const nationalities = ['gb', 'us'];
var userDataArray = [];
var filteredArray = [];

/**
 * Once the page loads, a call to the Random Users API is performed
 * If data are retrieved successfully, the users are displayed on the DOM
 * A search form is added on the page
 */
window.onload = function () {
    document.querySelector('div.gallery').innerHTML =
        `<h2>Loading...</h2>`;
    fetchData(apiURL + users + "&nat=" + nationalities)
        .then(data => {
            document.querySelector('div.gallery').innerHTML = '';
            userDataArray = data.results;
            generateCards(userDataArray);
            createSearchForm();
        })
        .catch(err => {
            document.querySelector('div.gallery').innerHTML = `<h2>Please try again later. Some issue in the network</h2>`;
            console.error(err);
        })
};

/**
 * Performs the call to the API and calls checkStatus.
 * If the Promise was resolved, the response is returned in JSON format;
 * if the Promise was rejected, the error that occurred is printed in the console
 * @param {String} url
 * @return {Promise}
 */
function fetchData(url) {
    return fetch(url)
        .then(checkStatus)
        .then(response => response.json())
        .catch(err => console.error("Error while fetching data", err))
}

/**
 * Checks for the status of the Response. If OK, resolves the Promise, otherwise it rejects it
 * @param {Response} response
 * @return {Promise}
 */
function checkStatus(response) {
    console.log(response);
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

/**
 * Creates the container elements (cards) with the users' info and appends them to the `gallery` div element.
 * Attaches the click event on each of the containers.
 * Creates a modal pop-up with additional information about the selected user.
 * Appends two buttons on the modal, previous and next, for toggling between the users
 * @param {Array} users
 */
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
                addBrowsingButtons();
                attachEventsOnModalButtons(userDataIndex);
                displayUserInfo(userDataIndex);
            });
        }
    }
}

/**
 * Creates the modal pop-up and attaches it to the body of the page.
 * Adds animations to the modal, on open and close action
 */
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

/**
 * Retrieves the user's object, on the userDataIndex, in the userDataArray and populates the content of the modal pop-up with the user's info.
 * Transforms the date of birth to the format dd/mm/yy, using a reg exp
 * @param {Number} userDataIndex
 */
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

/**
 * Creates the buttons on the modal pop-up, for showing the previous or the next user
 */
function addBrowsingButtons() {
    let divModalButtons = document.createElement('div');
    divModalButtons.classList.add("modal-btn-container");
    divModalButtons.innerHTML =
        `<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
         <button type="button" id="modal-next" class="modal-next btn">Next</button>`;
    document.querySelector('div.modal-container').appendChild(divModalButtons);
    divModalButtons.classList.add( 'zoomIn',  'animated');
}

/**
 * Attaches the click event on the `previous` and `next` button and displays the info for the according user.
 * If checks for the corner cases - if the 1st user is shown and the prev button pressed, it shows the last user;
 * if the last user is shown and the next button pressed, it shows the 1st user
 * @param {Number} userDataIndex
 */
function attachEventsOnModalButtons(userDataIndex) {
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

/**
 * Adds a search text field and search button on the page for filtering of the displayed users.
 * Attaches the events performed on the text field and the button - input and click
 */
function createSearchForm() {
    let divSearchContainer = document.querySelector('div.search-container');

    divSearchContainer.innerHTML += `
                        <form action="#" method="get">
                            <input type="search" id="search-input" class="search-input" placeholder="Search...">
                            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
                        </form> `;

    document.querySelector('.search-input').addEventListener('input', handleOnSearchFieldInput);
    document.querySelector('.search-submit').addEventListener('click', handleSearchButtonClick);
}

/**
 * When the user presses the magnifier icon, it triggers the filtering against the given input in the search text field
 * @param {Event} event
 */
function handleSearchButtonClick(event) {
    event.preventDefault();
    let term = document.querySelector('input#search-input').value;
    searchTerm(term);
}

/**
 * When the content changes in the search text field, it triggers the filtering against the given input
 * @param {Event} event
 */
function handleOnSearchFieldInput(event){
    searchTerm(event.target.value);
}

/**
 * Filters the users with the given search term and updates the DOM with the results.
 * Filtering is plain text and NOT case sensitive.
 * @param {String} searchTerm
 */
function searchTerm(searchTerm) {
    if(searchTerm === ""){
        generateCards(userDataArray);
        return;
    }
    searchTerm = searchTerm.toLowerCase().trim();
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
