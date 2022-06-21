let myProjects = [];

function Project(title, content, done) {
  this.title = title;
  this.content = content;
  this.done = done;
}

// let p1 = new Project("lick", "tsjdfjdslkjfj woof ", false);
// console.log(myProjects.length);
// myProjects.push(p1);
// console.log(myProjects.length);

//first get button to pop up form
function openProjectForm() {
  document.getElementById("newProjectForm").style.display = "block";
}

function closeProjectForm() {
  document.getElementById("newProjectForm").style.display = "none";
}

function clearInputForm() {
  //clear title and content fields in form
  document.getElementById("new-title").value = "";
  document.getElementById("new-content").value = "";
}

//this updates html
function addNewProjectCard(title, content, position) {
  //create new card element
  let newCard = document.createElement("div");
  newCard.classList.add("card");

  let newCardTitle = document.createElement("div");
  newCardTitle.classList.add("title");
  newCardTitle.textContent = title;

  let newCardContent = document.createElement("div");
  newCardContent.classList.add("content");
  newCardContent.textContent = content;

  newCard.dataset.done = "false";
  newCard.dataset.position = position;

  //add card action buttons
  let cardAction = document
    .getElementById("card-action-sample")
    .cloneNode(true);

  newCard.appendChild(newCardTitle);
  newCard.appendChild(newCardContent);
  newCard.appendChild(cardAction);

  //add new card to cards container
  cardsContainer = document.getElementById("cards-container");
  cardsContainer.appendChild(newCard);
}

//this retrieves input fields, makes new project in array
function readNewProjectInput() {
  let newTitle = document.getElementById("new-title").value;
  let newContent = document.getElementById("new-content").value;
  //add new project to library
  let newProject = new Project(newTitle, newContent, "false");
  myProjects.push(newProject);
  console.log("added new card.");
  addNewProjectCard(newTitle, newContent, myProjects.length);
}

function deleteCard(position) {
  //remove card html
  let cardToDelete = document.querySelector(
    `div [data-position="${position}"]`
  );

  cardToDelete.remove();

  //remove card from array
  myProjects.splice(position, 1);
  console.log("delete card called for card position:", position);
  console.log("after deletion, myProj length: ", myProjects.length);
  updateIndexHTML();
}

function updateIndexHTML() {
  //get projects from array
  let allCards = document.getElementsByClassName("card");

  for (let pos = 0; pos < myProjects.length; pos++) {
    //update the position attribute for each card. html and myproject array should be same length
    allCards[pos].dataset.position = pos;
    console.log(allCards);

    //remove existing event listeners => omg this and updating in delete card fixed multiple delete issues
    allCards[pos].replaceWith(allCards[pos].cloneNode(true));

    //then add event listener to every card's button
    allCards[pos]
      .getElementsByClassName("bt-del-card")[0]
      .addEventListener("click", () => {
        deleteCard(pos);
        // then disable event listener
      });

    // allCards[pos]
    //   .getElementsByClassName("bt-mark-card")[0]
    //   .addEventListener("click", () => {
    //     markCardDone(pos);
    //   });
  }

  console.log("refresh called, myProjects length: ", myProjects.length);
}

//when new button is pressed
document
  .getElementById("newProjectButton")
  .addEventListener("click", openProjectForm);

//when create button is pressed
document.getElementById("new-create").addEventListener("click", () => {
  readNewProjectInput();
  clearInputForm();
  closeProjectForm();

  updateIndexHTML();
});

document.getElementById("new-clear").addEventListener("click", () => {
  clearInputForm();
  closeProjectForm();
});

function markCardDone(pos) {
  //update the array first
  let thisProject = myProjects[pos];
  if (thisProject.done === "true") {
    thisProject.done = "false";
  } else {
    thisProject.done = "true";
  }

  //update html card
  let cardToMark = document.querySelector(`div [data-position="${pos}"]`);
  cardToMark.dataset.done = thisProject.done;
}

//add event listeners to trash buttons
