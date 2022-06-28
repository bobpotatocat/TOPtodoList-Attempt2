class Project {
  constructor(title, content, order) {
    this.title = title;
    this.content = content;
    this.order = order;
    this.done = false;
    this.tasks = [];
  }
  setTitle(newTitle) {
    this.title = newTitle;
  }
  getTitle() {
    return this.title;
  }
  setContent(newContent) {
    this.content = newContent;
  }
  getContent() {
    return this.content;
  }
  setOrder(newOrder) {
    this.order = newOrder;
  }
  getOrder() {
    return this.order;
  }
  viewDoneStatus() {
    return this.done;
  }
  flipDoneStatus() {
    this.done = !this.done;
  }
  addTask(task) {
    this.tasks.push(task);
  }
  getAllTasks() {
    return this.tasks;
  }
  removeTask(position) {
    this.tasks.splice(position, 1);
  }
  checkHasTask(task) {
    //todo
  }
}

class Task {
  constructor(title, content, position) {
    this.title = title;
    this.content = content;
    this.done = false;
    this.position = position;
  }
  setTitle(newTitle) {
    this.title = newTitle;
  }
  getTitle() {
    return this.title;
  }
  setPosition(position) {
    this.position = position;
  }
  getPosition() {
    return this.position;
  }
  setContent(newContent) {
    this.content = newContent;
  }
  getContent() {
    return this.content;
  }
  viewDoneStatus() {
    return this.done;
  }
  flipDoneStatus() {
    this.done = !this.done;
  }
}

let myProjects = [];
let activeProject;

//first get button to pop up form

function closeAllPopUpForms() {
  //close all other popup forms
  let allPopUpForms = document.getElementsByClassName("popup-form");
  allPopUpForms = Array.from(allPopUpForms);
  allPopUpForms.forEach((form) => {
    form.style.display = "none";
  });
}
function openProjectForm() {
  closeAllPopUpForms();
  document.getElementById("newProjectForm").style.display = "block";
}

function openTaskForm() {
  closeAllPopUpForms();
  document.getElementById("newTaskForm").style.display = "block";
  console.log("opening task form");
}

function closeProjectForm() {
  document.getElementById("newProjectForm").style.display = "none";
}

function closeTaskForm() {
  document.getElementById("newTaskForm").style.display = "none";
}

function clearInputForm() {
  //clear title and content fields in form
  document.getElementById("new-title").value = "";
  document.getElementById("new-content").value = "";
  document.getElementById("new-task-title").value = "";
  document.getElementById("new-task-content").value = "";
}

// //this updates html
// function addNewProjectCard(title, content, position) {
//   //create new card element
//   let newCard = document.createElement("div");
//   newCard.classList.add("card");

//   let newCardTitle = document.createElement("div");
//   newCardTitle.classList.add("title");
//   newCardTitle.textContent = title;

//   let newCardContent = document.createElement("div");
//   newCardContent.classList.add("content");
//   newCardContent.textContent = content;

//   newCard.dataset.done = "false";
//   newCard.dataset.position = position;

//   //add card action buttons
//   let cardAction = document
//     .getElementById("card-action-sample")
//     .cloneNode(true);

//   newCard.appendChild(newCardTitle);
//   newCard.appendChild(newCardContent);
//   newCard.appendChild(cardAction);

//   //add new card to cards container
//   cardsContainer = document.getElementById("cards-container");
//   cardsContainer.appendChild(newCard);
// }

//this retrieves input fields, makes new project in array
function readNewProjectInput() {
  let newTitle = document.getElementById("new-title").value;

  let newContent = document.getElementById("new-content").value;
  //add new project to library
  let newProject = new Project(newTitle, newContent, myProjects.length);
  myProjects.push(newProject);
  console.log("added new project.");
  addNewProjectTab(newProject, myProjects.length);
  activeProject = newProject;
  console.log("set active proj to be: ", activeProject.getTitle());
}

function addNewProjectTab(project, order) {
  let projectsList = document.getElementById("projects-list");
  let newTab = document.createElement("li");
  newTab.dataset.order = order;
  newTab.textContent = project.getTitle();
  newTab.classList.add("project");
  projectsList.appendChild(newTab);
}

function deleteCard(activeProject, position) {
  console.log("to del card of pos: ", position);
  //remove card html
  let cardToDelete = document.querySelector(
    `div.card[data-position="${position}"]`
  );
  console.log("deleting card in html: ", cardToDelete);
  cardToDelete.remove();
  console.log("before task array: ", activeProject.getAllTasks());
  activeProject.removeTask(position);
  console.log("after task array: ", activeProject.getAllTasks());

  console.log("delete card called for card position:", position);
  console.log("after deletion, remaining cards: ", activeProject.getAllTasks());
  //update card positions
  updateCardsHTML(activeProject);
}

function showProject(project) {
  let projHeader = document.getElementById("project-title");
  projHeader.textContent = project.getTitle();
  let projContent = document.getElementById("project-content");
  projContent.textContent = project.getContent();

  //clear all cards in html
  clearCardsHTML();
  showCardsInProject(project);
  setActiveProjectHTML(project);
}

function clearCardsHTML() {
  let cardsContainer = document.getElementById("cards-container");
  let card = cardsContainer.lastElementChild;
  while (card) {
    cardsContainer.removeChild(card);
    card = cardsContainer.lastElementChild;
  }
}

function showCardsInProject(activeProject) {
  let allTasks = activeProject.getAllTasks();
  for (let i = 0; i < allTasks.length; i++) {
    addNewTaskCard(allTasks[i]);
  }
  updateCardsHTML(activeProject);
}

// functions for task
function updateCardsHTML(activeProject) {
  let allTasks = activeProject.getAllTasks();
  let allTaskCards = document.getElementsByClassName("card");
  //if nothing, return
  if (allTaskCards.length == 0) return;
  console.log(activeProject.getAllTasks());
  for (let i = 0; i < allTasks.length; i++) {
    allTasks[i].setPosition(i);
    allTaskCards[i].dataset.position = i;
    //once again, remove prior event listeners
    allTaskCards[i].replaceWith(allTaskCards[i].cloneNode(true));
    //then add event listeners to every card's button
    allTaskCards[i]
      .getElementsByClassName("bt-del-card")[0]
      .addEventListener("click", () => {
        deleteCard(activeProject, i);
      });

    allTaskCards[i]
      .getElementsByClassName("bt-mark-card")[0]
      .addEventListener("click", () => {
        markCardDone(i);
      });
  }
}

//create new html task cards
function addNewTaskCard(task) {
  let newCard = document.createElement("div");
  newCard.classList.add("card");

  let newCardTitle = document.createElement("div");
  newCardTitle.classList.add("title");
  newCardTitle.textContent = task.getTitle();

  let newCardContent = document.createElement("div");
  newCardContent.classList.add("content");
  newCardContent.textContent = task.getContent();

  newCard.dataset.done = "false";
  newCard.dataset.position = task.getPosition();

  //add card action buttons
  let cardAction = document
    .getElementById("card-action-sample")
    .cloneNode(true);

  newCard.appendChild(newCardTitle);
  newCard.appendChild(newCardContent);
  newCard.appendChild(cardAction);

  //add new card to cards container
  let cardsContainer = document.getElementById("cards-container");
  cardsContainer.appendChild(newCard);
}

function readNewTaskInput(activeProject) {
  // console.log("active project: ", activeProject.getTitle());

  let newTitle = document.getElementById("new-task-title").value;
  let newContent = document.getElementById("new-task-content").value;
  let newTask = new Task(
    newTitle,
    newContent,
    activeProject.getAllTasks().length
  );
  activeProject.addTask(newTask);
  console.log(
    "added new task",
    newTask.getTitle(),
    " into project ",
    activeProject.getTitle()
  );
  addNewTaskCard(newTask);
  updateCardsHTML(activeProject);
}

function updateIndexHTML() {
  //get projects from array
  let allProjects = document.getElementsByClassName("project");
  for (let i = 0; i < myProjects.length; i++) {
    allProjects[i].dataset.order = i;
    //remove existing event listeners
    allProjects[i].replaceWith(allProjects[i].cloneNode(true));
    //add event listeners
    allProjects[i].addEventListener("click", () => {
      activeProject = myProjects[i];

      showProject(myProjects[i]);
      // console.log("showing project: ", myProjects[i].getTitle());
    });
  }

  console.log("refresh called, myProjects length: ", myProjects.length);
}

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

//when create new project button is pressed
document
  .getElementById("newProjectButton")
  .addEventListener("click", openProjectForm);

document.getElementById("new-create").addEventListener("click", () => {
  if (document.getElementById("new-title").value.trim().length < 1) {
    document.getElementById("new-title").placeholder =
      "Please enter project name";
  } else {
    readNewProjectInput();
    clearInputForm();
    closeProjectForm();
    updateIndexHTML();
  }
});

document.getElementById("new-clear").addEventListener("click", () => {
  clearInputForm();
  closeProjectForm();
});
//for adding new tasks
document.getElementById("newTaskButton").addEventListener("click", () => {
  if (!activeProject) {
    alert("Please create or select project from left sidebar to add task to.");
    return;
  }
  openTaskForm();
});

function setActiveProjectHTML(activeProject) {
  //remove active class from each element which has it
  let activeElements = document.getElementsByClassName("active");
  if (!activeElements) return;
  for (let i = 0; i < activeElements.length; i++) {
    activeElements[i].classList.remove("active");
  }

  let activeProjectTab = document.querySelector(
    `li.project[data-order="${activeProject.getOrder()}"]`
  );
  if (!activeProjectTab) {
    console.log("no active projects found - ERROR");
    return;
  }
  activeProjectTab.classList.add("active");
}

document.getElementById("new-task-create").addEventListener("click", () => {
  if (document.getElementById("new-task-title").value.trim().length < 1) {
    document.getElementById("new-task-title").placeholder =
      "Please enter task name";
  } else {
    readNewTaskInput(activeProject);
    clearInputForm();
    closeAllPopUpForms();
  }
});
