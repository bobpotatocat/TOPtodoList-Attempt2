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
  getDoneStatus(doneStatus) {
    this.done = doneStatus;
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
  setTasks(taskArray) {
    this.tasks = taskArray;
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
  getDoneStatus() {
    return this.done;
  }
  flipDoneStatus() {
    this.done = !this.done;
  }
  setDoneStatus(doneStatus) {
    this.done = doneStatus;
  }
}

let myProjects = [];
let activeProject;

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

//this retrieves input fields, makes new project in array
function readNewProjectInput() {
  let newTitle = document.getElementById("new-title").value;

  let newContent = document.getElementById("new-content").value;
  //add new project to library
  let newProject = new Project(newTitle, newContent, myProjects.length);
  myProjects.push(newProject);
  console.log("added new project.");
  addNewProjectTab(newProject, myProjects.length);
  // console.log("set active proj to be: ", activeProject.getTitle());
}
function deleteProject(order) {
  //remove from array
  myProjects.splice(order, 1);
  //remove from sidebar
  let projectTabToDel = document.querySelector(
    `li.project[data-order="${order}"]`
  );
  projectTabToDel.remove();
  console.log("deleted project of position : ", order);
  updateProjectTabHTML();
  setActiveProjectHTML(); //no parameter
}
function addNewProjectTab(project, order) {
  let projectsList = document.getElementById("projects-list");
  let newTab = document.createElement("li");
  newTab.dataset.order = order;
  newTab.textContent = project.getTitle();
  newTab.classList.add("project");
  //add trash icon and event listener (also need to update listener )
  let projTrashButton = document.createElement("input");
  projTrashButton.classList.add("projectTabDelButton");
  projTrashButton.type = "image";
  projTrashButton.src = "trash-can.png";
  // projTrashButton.addEventListener("click", deleteProject(order));  //don't add here, add after it has been created
  newTab.appendChild(projTrashButton);
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
  let projContent = document.getElementById("project-content");
  clearCardsHTML();
  if (project === "default") {
    projHeader.textContent = "Create/Select a project to view!";
    projContent.textContent = "";
    setActiveProjectHTML();
    return;
  } else {
    projHeader.textContent = project.getTitle();
    projContent.textContent = project.getContent();
    showCardsInProject(project);
    setActiveProjectHTML(project);
  }
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
        //flip done status for task
        allTasks[i].flipDoneStatus();
        markCardDone(i);
      });

    allTaskCards[i].addEventListener("click", (e) => {
      //if not clicking on buttons
      if (
        !allTaskCards[i]
          .getElementsByClassName("card-action-input")[0]
          .contains(e.target)
      ) {
        console.log("enlarging card in pos: ", i);
        enlargeTaskCard(i);
      }
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
  newCardTitle.contentEditable = "true";

  let newCardContent = document.createElement("div");
  newCardContent.classList.add("content");
  newCardContent.textContent = task.getContent();
  newCardContent.contentEditable = "true";

  // if task is already done when card is being created,
  // make it green by setting data-done
  newCard.dataset.done = task.getDoneStatus();
  newCard.dataset.position = task.getPosition();

  //add card action buttons
  let cardAction = document
    .getElementById("card-action-sample")
    .cloneNode(true);

  cardAction.id = "card-action-actual";
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

function updateProjectTabHTML() {
  //get projects from array
  let allProjectTabs = document.getElementsByClassName("project");
  for (let i = 0; i < myProjects.length; i++) {
    myProjects[i].setOrder(i);
    allProjectTabs[i].dataset.order = i;
    //remove existing event listeners
    allProjectTabs[i].replaceWith(allProjectTabs[i].cloneNode(true));
    //add event listeners
    allProjectTabs[i].addEventListener("click", () => {
      activeProject = myProjects[i];
      showProject(myProjects[i]);
      // console.log("showing project: ", myProjects[i].getTitle());
    });

    let thisTrashButton = allProjectTabs[i].getElementsByClassName(
      "projectTabDelButton"
    )[0];
    thisTrashButton.addEventListener("click", () => {
      console.log("delete button clicked");
      deleteProject(i);
      showProject("default");
    });
  }
}

function markCardDone(pos) {
  //update the array first
  let thisCard = activeProject.getAllTasks()[pos];
  if (thisCard.done === "true") {
    thisCard.done = "false";
  } else {
    thisCard.done = "true";
  }

  //update html card
  let cardToMark = document.querySelector(`div.card[data-position="${pos}"]`);
  cardToMark.dataset.done = thisCard.done;
}
function setActiveProjectHTML(activeProject) {
  //remove active class from each element which has it
  let activeElements = document.getElementsByClassName("active");
  if (activeElements) {
    for (let i = 0; i < activeElements.length; i++) {
      activeElements[i].classList.remove("active");
    }
  }

  if (!activeProject) {
    //when no parameter passed, just remove style and return
    return;
  }

  let activeProjectTab = document.querySelector(
    `li.project[data-order="${activeProject.getOrder()}"]`
  );
  if (!activeProjectTab) {
    console.log("active project not found - ERROR");
    return;
  }
  activeProjectTab.classList.add("active");
}

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
    updateProjectTabHTML();
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

document.getElementById("new-task-clear").addEventListener("click", () => {
  clearInputForm();
  closeAllPopUpForms();
});

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

function enlargeTaskCard(position) {
  //remove all enlarged class items
  let enlargedElements = document.getElementsByClassName("enlarged");
  if (enlargedElements) {
    for (let i = 0; i < enlargedElements.length; i++) {
      enlargedElements[i].classList.remove("enlarged");
    }
  }
  let thisCard = document.querySelector(`div.card[data-position="${position}"`);
  thisCard.classList.add("enlarged");
}

//click anywhere outside div to close enlarged view
document.body.addEventListener("click", (e) => {
  //if have card currently enlarged
  if (document.getElementsByClassName("enlarged")[0]) {
    if (!document.getElementsByClassName("enlarged")[0].contains(e.target)) {
      document
        .getElementsByClassName("enlarged")[0]
        .classList.remove("enlarged");
    }
  }
});

window.addEventListener("beforeunload", (e) => {
  let updatedProjectsArray = JSON.stringify(myProjects);
  localStorage.setItem("myProjectsJSON", updatedProjectsArray);
});

let test = new Project("bob dole", "some content here", 0);
test.addTask(new Task("task 1", "some content", 0));
test.addTask(new Task("task 2", "", 1));
let jsonTest = JSON.stringify(test);
// console.log(jsonTest);
let obj = JSON.parse(jsonTest);
// console.log(obj["title"]);

let myarr = [];
myarr.push(test);
let jsonArray = JSON.stringify(myarr);
// console.log(myarr);
localStorage.setItem("myProjects", jsonArray);

let hoho = localStorage.getItem("myProjects");
let hehe = JSON.parse(hoho);
// console.log(hehe[0]);
// console.log(hehe[0]["tasks"][0]);

// console.log();

// hoho.forEach((ho) => {
//   console.log(ho[title]);
// });
// if (hoho.length>0){
//   populateFromJSON();
// }else{
//   console.log('no json data found.')
// }

function getFromJSON() {
  //to change key in getItem
  let jsonprojectArray = JSON.parse(localStorage.getItem("myProjectsJSON"));
  let myProjects = [];
  for (let i = 0; i < jsonprojectArray.length; i++) {
    //create project to populate myProject array - need to add done property too
    let thisJSONproject = jsonprojectArray[i];
    let thisProject = new Project(
      thisJSONproject["title"],
      thisJSONproject["content"],
      i
    );

    thisProject.getDoneStatus(thisJSONproject["done"]);
    //then create tasks one by one add to project
    for (let j = 0; j < thisJSONproject["tasks"].length; j++) {
      let thisJSONtask = thisJSONproject["tasks"][j];
      let thisTask = new Task(
        thisJSONtask["title"],
        thisJSONtask["content"],
        j
      );
      thisTask.setDoneStatus(thisJSONtask["done"]);
      thisProject.addTask(thisTask);
    }

    //then add to proj array
    myProjects.push(thisProject);
  }
  return myProjects;
}

function populateFromJSON(myProjects) {
  for (let i = 0; i < myProjects.length; i++) {
    addNewProjectTab(myProjects[i], i);
  }
  updateProjectTabHTML();
}

myProjects = getFromJSON();
populateFromJSON(myProjects);
