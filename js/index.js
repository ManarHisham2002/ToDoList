// Function to Go to a specific page
moveTo = (link) => {
  location.href = `../../ToDoList/${link}`;
};

// Declare Element
let userName = document.getElementById("name");
let email = document.getElementById("email");
let password = document.getElementById("password");
let confirmPassword = document.getElementById("confirmPassword");
let hiUser = document.getElementById("hiUser");
let Overlay = document.getElementById("overlay");
let newTask = document.getElementById("new-task");
let list = document.getElementById("list");
let taskToUpdate = null;
let oldTaskText = "";
const userAvatar = document.getElementById("userAvatar");
const avatarInput = document.getElementById("avatarInput");

// Function to Create Error Messege
errorMsg = (element, msg) => {
  // Styling Element
  element.style.cssText = "border: 1px solid red; transform: scale(1.1);";
  // Create Error Messege
  if (
    element.nextElementSibling &&
    element.nextElementSibling.tagName === "SPAN"
  ) {
    // If there is a message, he always deletes it
    element.nextElementSibling.remove();
  }
  let newElement = document.createElement("span");
  newElement.textContent = `${msg}`;
  // Add Error Messege after Element
  element.insertAdjacentElement("afterend", newElement);
};

// Function to Sign Up New User
onRegister = (event) => {
  event.preventDefault();
  // Declare Variable
  userNameValue = userName.value.trim();
  emailValue = email.value.trim();
  passwordValue = password.value;
  confirmPasswordValue = confirmPassword.value;
  // Calling users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  //  Loop each element in the users to see if the email is there or not
  let isExist = users.some((user) => user.email === emailValue);
  if (isExist) {
    // If it is present, a message will appear stating that it is present
    errorMsg(email, "This email is already registered!");
  } else {
    // If it is not present, the new user registers
    if (passwordValue === confirmPasswordValue) {
      if (passwordValue.length >= 8) {
        // Add New User In Array Users
        users.push({
          userName: userNameValue,
          email: emailValue,
          password: passwordValue,
          tasks: [],
        });
        // Add Array Users In LocalStorge
        localStorage.setItem("users", JSON.stringify(users));
        // Save current logged in user
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            userName: userNameValue,
            email: emailValue,
            password: passwordValue,
            tasks: [],
          })
        );
        moveTo("home.html");
        // Show welcome message
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        hiUser.textContent = `Welcome ${currentUser.userName}`;
        console.log(currentUser.userName);
      } else {
        // If Passsword is less than 8 characters
        errorMsg(password, "Password less than 8 characters");
      }
    } else {
      // If Password Not equal Confirm
      errorMsg(confirmPassword, "Password doesn't match");
    }
  }
};

// Function to Log In User
onLogIn = (event) => {
  event.preventDefault();
  // Declare Variable
  emailValue = email.value.trim();
  passwordValue = password.value;
  // Calling users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];
  // Find user with matching email & password
  let user = users.find(
    (user) => user.email === emailValue && user.password === passwordValue
  );
  if (user) {
    if (!user.tasks) {
      user.tasks = [];
    }
    // Save current logged in user
    localStorage.setItem("currentUser", JSON.stringify(user));
    moveTo("home.html");
    // Show welcome message
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    hiUser.textContent = `Welcome ${currentUser.userName}`;
    console.log(currentUser.userName);
  } else {
    // If user not found, check if email exists
    let isMail = users.some((user) => user.email === emailValue);
    if (!isMail) {
      // Email not registered
      errorMsg(email, "This email is not registered");
    } else {
      // Email exists but password is wrong
      errorMsg(password, "Wrong password");
    }
  }
};
// Function Clock
function updateClock() {
  let hourHand = document.getElementById("hour");
  let minuteHand = document.getElementById("minute");
  let secondHand = document.getElementById("second");
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  let hourRotation = (hours % 12) * 30 + (minutes / 60) * 30;
  let minuteRotation = minutes * 6 + (seconds / 60) * 6;
  let secondRotation = seconds * 6;
  hourHand.style.transform = `translateX(-50%) rotate(${hourRotation}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${minuteRotation}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${secondRotation}deg)`;
}

// Show Overlay To Write New Task
showOverLay = (task = null) => {
  Overlay.style.display = "block";
  if (task) {
    // تعديل
    taskToUpdate = task;
    oldTaskText = task.querySelector(".task-text").textContent;
    newTask.value = oldTaskText;
  } else {
    // إضافة
    taskToUpdate = null;
    oldTaskText = "";
    newTask.value = "";
  }
};

// Hidden Overlay To Write New Task
hideOverLay = () => {
  Overlay.style.display = "none";
  newTask.value = "";
  taskToUpdate = null;
};

// Save tasks for the logged-in user
function saveTasks(tasks) {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;
  let users = JSON.parse(localStorage.getItem("users")) || [];
  // Update tasks inside current user
  users = users.map((user) =>
    user.email === currentUser.email ? { ...user, tasks } : user
  );
  // Save back
  localStorage.setItem("users", JSON.stringify(users));
  // Update currentUser copy
  currentUser.tasks = tasks;
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

// Function to create task element
function createTaskElement(taskText) {
  let task = document.createElement("li");
  task.classList.add("task");
  task.innerHTML = `
    <div class="checkbox-container">
      <input type="checkbox" />
      <span class="checkmark" onclick="checkMark(event)"></span>
      <span class="task-text">${taskText}</span>
    </div>
    <div class="icon">
      <i class="fa-solid fa-pen-nib" onclick="showOverLay(this.closest('.task'))"></i>
      <i class="fa-solid fa-trash ms-2" onclick="deleteTask(event)"></i>
    </div>
  `;
  list.appendChild(task);
}

// Load tasks for the logged-in user
function loadTasks() {
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) return;
  let tasks = currentUser.tasks || [];
  // list.innerHTML = ""; // clear old list
  tasks.forEach((taskText) => {
    createTaskElement(taskText);
  });
}

// function (Add / Update) Task
addTask = () => {
  let newTaskValue = newTask.value.trim();
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let tasks = currentUser.tasks || [];
  if (newTaskValue === "") {
    errorMsg(newTask, "Please enter a task");
    return;
  }
  if (taskToUpdate) {
    //  Compare Update Task & Old Task
    if (newTaskValue === oldTaskText) {
      errorMsg(newTask, "You didn't change Task");
      return;
    }
    taskToUpdate.querySelector(".task-text").textContent = newTaskValue;
    // Update LocalStorage
    let index = tasks.indexOf(oldTaskText);
    if (index !== -1) {
      tasks[index] = newTaskValue;
      saveTasks(tasks);
    }
  } else {
    // Add New Task
    createTaskElement(newTaskValue);
    tasks.push(newTaskValue);
    saveTasks(tasks);
  }
  hideOverLay();
};

// Function Complete Current Task
checkMark = (e) => {
  const span = e.target;
  const li = span.closest(".checkbox-container");
  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
  span.classList.toggle("show-mark", checkbox.checked);
};

// Function Delete Current Task
deleteTask = (e) => {
  let li = e.target.closest(".task");
  let taskText = li.querySelector(".task-text").textContent;
  // Remove from DOM
  li.remove();
  // Remove from localStorage
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let tasks = currentUser.tasks || [];
  tasks = tasks.filter((t) => t !== taskText);
  saveTasks(tasks);
};
// Save User Photo
const openFiles = () => {
  avatarInput.click();
};

const photo = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const newAvatar = reader.result;
    userAvatar.src = newAvatar;

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      currentUser.avatar = newAvatar;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.map((user) =>
        user.email === currentUser.email ? { ...user, avatar: newAvatar } : user
      );
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  reader.readAsDataURL(file);
};

window.onload = () => {
  // Load Clock
  updateClock();
  setInterval(updateClock, 1000);
  // Show User Name
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    if (hiUser) hiUser.textContent = `Welcome ${currentUser.userName}`;

    if (currentUser.avatar && userAvatar) {
      userAvatar.src = currentUser.avatar;
    }
  }
  // Load Tasks List
  loadTasks();
};

// Function to Log Out User
logOut = () => {
  // Remove current user
  localStorage.removeItem("currentUser");
  // Move to master page
  moveTo("index.html");
};

