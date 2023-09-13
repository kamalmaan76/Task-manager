const task_input = document.querySelector("#input1");
const date_input = document.querySelector(".schedule-date"); // added date input
const add_btn = document.querySelector(".add-task-button");
const todos_list_body = document.querySelector(".todos-list-body");
const alert_message = document.querySelector(".alert-message");
const searchInput = document.querySelector("#myinput");
const delete_all_btn = document.querySelector(".delete-all-btn");
const desc_input = document.querySelector("#input2");


let todos = JSON.parse(localStorage.getItem("todos")) || [];

window.addEventListener("DOMContentLoaded", () => {
  showAllTodos();
  if (!todos.length) {
    displayTodos([]);
  }
});

//get random unique id
function getRandomId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function addToDo(task_input, date_input, desc_input) {
  let task = {
    id: getRandomId(),
    task: task_input.value,
    desc:desc_input.value,
    dueDate: date_input.value, // added due date
    completed: false,
    status: "pending", // adding initial status as 'pending'
  };
  todos.push(task);
}

task_input.addEventListener("keyup", (e) => {
  if (e.keyCode === 13 && task_input.value.length > 0) {
    addToDo(task_input, date_input,desc_input); // Added date input
    saveToLocalStorage();
    task_input.value = "";
    showAllTodos();
  }
});

add_btn.addEventListener("click", () => {
  if (task_input.value === "") {
    showAlertMessage("Please enter a task", "error");
  } else {
    addToDo(task_input, date_input,desc_input); // Added date input
    saveToLocalStorage();
    showAllTodos();
    task_input.value = "";
    desc_input.value="";
    date_input.value = ""; // Added date input
    showAlertMessage("Task added successfully", "success");
  }
});

delete_all_btn.addEventListener("click", clearAllTodos);

//show all todos
function showAllTodos() {
  todos_list_body.innerHTML = "";
  if (todos.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="5" class="text-center">No task found</td></tr>`;
    return;
  }

  todos.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td>${todo.task}</td>
                <td>${todo.desc}</td>
                <td>${todo.dueDate || "No due date"}</td>
                <!--<td>${todo.status}</td>--->
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
        `;
  });
}

//save todos to local storage
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//show alert message
function showAlertMessage(message, type) {
  let alert_box = `
        <div class="alert alert-${type} shadow-lg mb-5 w-full">
            <div>
                <span>
                    ${message}
                </span>
            </div>
        </div>
    `;
  alert_message.innerHTML = alert_box;
  alert_message.classList.remove("hide");
  alert_message.classList.add("show");
  setTimeout(() => {
    alert_message.classList.remove("show");
    alert_message.classList.add("hide");
  }, 3000);
}

/*
// Add an event listener to the search input field
searchInput.addEventListener("keyup", (e) => {
  e.preventDefault();
  let searchedWord = e.target.value.toLowerCase();

  const taskItems = document.querySelectorAll(".task");
  taskItems.forEach((taskItem) => {
   let taskText = taskItem.querySelector(".taskDisabled").value.toLowerCase();

    if (taskText.indexOf(searchedWord) !== -1) {
      taskItem.style.display = "block";
   } else {
     taskItem.style.display = "none";
   }
  });
});
*/


//delete todo
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  showAlertMessage("Todo deleted successfully", "success");
  showAllTodos();
}

//edit todo
function editTodo(id) {
  let todo = todos.find((todo) => todo.id === id);
  task_input.value = todo.task;
  desc_input.value=todo.desc;
  todos = todos.filter((todo) => todo.id !== id);
  add_btn.innerHTML = "<i class='bx bx-check bx-sm'></i>";
  saveToLocalStorage();
  add_btn.addEventListener("click", () => {
    add_btn.innerHTML = "<i class='bx bx-plus bx-sm'></i>";
    showAlertMessage("Todo updated successfully", "success");
  });
}

// Decription
// addTaskButton.addEventListener("click", function() {
//     const taskTitle = taskTitleInput.value;
//     const taskDescription = taskDescriptionInput.value;
    
//     const task = {
//       title: taskTitle,
//       description: taskDescription,
//       completed: false
//     };
    
//     tasks.push(task);
//     displayTasks(tasks);
    
//     taskTitleInput.value = "";
//     taskDescriptionInput.value = "";
//   });
  
//clear all todos
function clearAllTodos() {
  if (todos.length > 0) {
    todos = [];
    saveToLocalStorage();
    showAlertMessage("All todos cleared successfully", "success");
    showAllTodos();
  } else {
    showAlertMessage("No todos to clear", "error");
  }
}

function toggleStatus(id) {
  let todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  //todo.task.classList.add('completed');
  // todo.status="completed";
  saveToLocalStorage();
  showAllTodos();
}

function filterTodos(status) {
  let filteredTodos;
  switch (status) {
    case "all":
      filteredTodos = todos;
      break;
    case "pending":
      filteredTodos = todos.filter((todo) => !todo.completed);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed);
      break;
  }
  displayTodos(filteredTodos);
}

function displayTodos(todosArray) {
  todos_list_body.innerHTML = "";
  if (todosArray.length === 0) {
    todos_list_body.innerHTML = `<tr><td colspan="5" class="text-center">No task found</td></tr>`;
    return;
  }
  todosArray.forEach((todo) => {
    todos_list_body.innerHTML += `
            <tr class="todo-item" data-id="${todo.id}">
                <td class="1todo">${todo.task}</td>
                <td>${todo.desc}</td>
                <td>${todo.dueDate || "No due date"}</td>
                <!--<td>${todo.status}</td>--->
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-edit-alt bx-bx-xs"></i>    
                    </button>
                    <button class="btn btn-success btn-sm" onclick="toggleStatus('${
                      todo.id
                    }')">
                        <i class="bx bx-check bx-xs"></i>
                    </button>
                    <button class="btn btn-error btn-sm" onclick="deleteTodo('${
                      todo.id
                    }')">
                        <i class="bx bx-trash bx-xs"></i>
                    </button>
                </td>
            </tr>
    `;
  });
}

// const allTr = document.querySelectorAll('#records tr');
// const searchInputField= document.querySelector('#myinput');
// searchInputField.addEventListener('input',function(e){
//  const searchStr = e.target.value.toLowerCase();
//  recorddisplay.innerHTML ='';
//  allTr.forEach(tr=>{
//   const td_in_tr =tr.querySelectorAll('td');
//   if(td_in_tr[0].innerText.toLowerCase().indexOf(searchStr) > -1){
//     recordsDisplay.appendChild(tr);
//   }
//  });
//  if(recordsDisplay.innerHTML == ''){
//   recordsDisplay.innerHTML='No Records Found'
//  }
//   // console.log(e.target.value)
// });

// search
function myFunction(){
  let filter=document.getElementById('myInput').value.toUpperCase();
  let table=document.getElementById('content');
  let tbody=document.getElementById('records');
  let tr=tbody.getElementsByTagName('tr');
  // console.log(tr);
  for(var i=0;i<tr.length;i++){
    // console.log(tr[i].getElementsByClassName('todo-item'));
    var search1=tr[i].getElementsByTagName('td')[0].innerHTML;
    // console.log(kamal.getElementsByTagName('td')[0].innerHTML);
    // console.log(kamal);
    if(search1.toUpperCase().indexOf(filter) > -1){
      tr[i].style.display="";
    }
    else{
      tr[i].style.display="none";
    }
  }
}

// function sortTable(columnIndex) {
//   const table = document.getElementById("todosTable");
//   const tableRows = Array.from(table.querySelectorAll("tbody tr"));

//   tableRows.sort((rowA, rowB) => {
//     const cellA = rowA.querySelectorAll("td")[columnIndex].textContent.toLowerCase();
//     const cellB = rowB.querySelectorAll("td")[columnIndex].textContent.toLowerCase();

//     return cellA.localeCompare(cellB);
//   });

//   tableRows.forEach((row) => {
//     table.querySelector("tbody").appendChild(row);
//   });
// }

// function showAllTodos() {
//   // ... (existing code)

//   // Add sorting data attributes to the header row
//   const headerRow = document.querySelector("#content thead tr");
//   const columnHeaders = headerRow.querySelectorAll("th");
//   columnHeaders.forEach((th, index) => {
//     th.setAttribute("data-sort", index);
//   });
// }

// function sortTable(columnIndex) {
//   const table = document.getElementById("content");
//   const tbody = document.getElementById("records");
//   const tableRows = Array.from(tbody.getElementsByTagName("tr"));

//   tableRows.sort((rowA, rowB) => {
//     const cellA = rowA.querySelectorAll("td")[columnIndex].textContent.toLowerCase();
//     const cellB = rowB.querySelectorAll("td")[columnIndex].textContent.toLowerCase();

//     return cellA.localeCompare(cellB);
//   });

//   // Clear the existing rows and append the sorted rows
//   tbody.innerHTML = "";
//   tableRows.forEach((row) => {
//     tbody.appendChild(row);
//   });
// }

// sorting
function sortTask(){
  var i;
  let table=document.getElementById('content');
  let tbody=document.getElementById('records');
  
  // let li=ul.getElementsByTagName('li');
  // console.log(li);

var switching=true;
var shouldswitch;
while(switching){
  switching=false;
  let tr=tbody.getElementsByTagName('tr');
  for(i=0;i<tr.length-1;i++){
          shouldswitch=false;
          if((tr[i].getElementsByTagName('td')[0].innerHTML.toLowerCase()) > (tr[i+1].getElementsByTagName('td')[0].innerHTML.toLowerCase())){
              shouldswitch=true;
              break;
          }
  }
  if(shouldswitch){
    tr[i].parentNode.insertBefore(tr[i+1],tr[i]);
    switching=true;
  }
}
}

