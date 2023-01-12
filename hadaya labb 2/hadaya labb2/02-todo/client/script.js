todoForm.title.addEventListener("input", (e) => validateField(e.target));
todoForm.title.addEventListener("blur", (e) => validateField(e.target));
todoForm.description.addEventListener("input", (e) => validateField(e.target));
todoForm.description.addEventListener("blur", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("input", (e) => validateField(e.target));
todoForm.dueDate.addEventListener("blur", (e) => validateField(e.target));

todoForm.addEventListener("submit" , onSubmit);

const todoListElement = document.getElementById("todoList");

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;


const api = new Api("http://localhost:5000/tasks");



function validateField(field){
    const {name, value} = field;

    let = validationMessage = "" ;

    switch(name) {
        case "title": {
            if(value.length < 2) {
                titleValid = false;
                validationMessage = "Fältet  'Titel' måste innehålla minst 2 tecken";
            } else if(value > 100){
                titleValid = false;
                validationMessage = "Fältet  'Titel' får inte innehålla mer än 100 tecken";
        } else {
        titleValid = true;
        }
        break;
        }
        case "description": {
            if(value.length > 500){
                descriptionValid = false;
                validationMessage = "Fältet  'beskrivning' får inte innehålla mer än 500 tecken";
            } else {
            descriptionValid = true;
            }
            break;
        }
        case "dueDate": {
            if(value.length == 0 ){
                descriptionValid = false;
                validationMessage = "Fältet  'utfört senast' får inte lämnas tomt";
            } else{
        dueDateValid= true;
            }
        break;

        }

    }

    field.previousElementSibling.innerText = validationMessage;
    field.previousElementSibling.classList.remove("hidden");

    

}





function onSubmit(e) {

    e.preventDefault();

    if(titleValid && descriptionValid && dueDateValid){
        console.log("submit");
        saveTask();
    }

    
 
};

function saveTask() {
    const task = {
        title: todoForm.title.value,
        description: todoForm.description.value,
        dueDate: todoForm.dueDate.value,
        completed : false,

    };

    api.create(task).then((task) => {
    if(task){
        renderList();
    }} );
}

function renderList() {
    const sortList = [];
    api.getAll().then((tasks) => {
      todoListElement.innerHTML = '';
      if (tasks && tasks.length > 0) {
        tasks.forEach((task) => {
            sortList.push(task);
        });
        sortList.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

        sortList.forEach((task) => {
          todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
        });
      }
    });
  }


function renderTask({ id, title, description, dueDate, completed }) {

  const isChecked =  completed == true ? "checked" : "";
  const colorChange = completed == true ? "text-green-700 rounded-xl opacity-60	bg-black border-4 border-black" : "";
  const textChange = completed == true ? "text-green-500 text-lg font-extrabold" : "";
  const textChangeTwo = completed == true ? "text-emerald-200" : "";


  let html = `
    <li class="select-none mt-2 py-2 border-b border-amber-300 ${colorChange}">
      <div class="flex items-center p-1 " id=${id}>
        <h3 class="mb-3 flex-1 text-xl font-bold text-pink-800 uppercase ${textChangeTwo}">${title}</h3>
        <div>
          <span>${dueDate}</span>
          <button onclick="deleteTask(${id})" class="${textChange} inline-block bg-amber-500 text-xs text-amber-900 border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
          <br>
          <input onclick="completeTask(${id})" type="checkbox" id="completeBox" ${isChecked}>
          <label class="${textChange}" for="completedBox">Utförd</label><br>
        </div>
      </div>`;
  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic ${textChangeTwo}">${description}</p>
  `);
  html += `
    </li>`;

  return html;
}

function completeTask(id) {
  const taskComplete = document.getElementById(id).querySelector('#completeBox').checked;
  api.update(id, taskComplete).then(result => { renderList()});
}

function deleteTask(id) {
    api.remove(id).then(result => {
        renderList();
    });
}
renderList();