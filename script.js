// Obtenemos la fecha actual
const fechaActual = new Date();

// Arrays con los nombres de los días y meses
const diasSemana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];
const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

// Extraemos el día de la semana, día, mes y año
const nombreDia = diasSemana[fechaActual.getDay()];
const dia = fechaActual.getDate();
const mes = meses[fechaActual.getMonth()];
const año = fechaActual.getFullYear();

// Asignamos los valores a los elementos HTML
document.getElementById("nombre-dia").textContent = nombreDia;
document.getElementById("dia").textContent = dia;
document.getElementById("mes").textContent = mes;
document.getElementById("año").textContent = año;

document.addEventListener("DOMContentLoaded", function () {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskNameInput = document.getElementById("taskName");
  const pomodoroDurationInput = document.getElementById("pomodoroDuration");
  const taskList = document.getElementById("taskList");
  const taskTemplate = document.getElementById("taskTemplate");

  let tasks = [];

  addTaskBtn.addEventListener("click", function () {
    const taskName = taskNameInput.value.trim();
    const pomodoroDuration = parseInt(pomodoroDurationInput.value);

    if (taskName && pomodoroDuration) {
      addTask(taskName, pomodoroDuration);
      taskNameInput.value = "";
      pomodoroDurationInput.value = "";
    }
  });

  function startPomodoro(taskObj, timeLeftEl, startTimerBtn, taskItem) {
    if (taskObj.intervalId) {
        // Si ya hay un temporizador corriendo, lo pausamos
        clearInterval(taskObj.intervalId);
        taskObj.intervalId = null;
        startTimerBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;  // Cambiamos el texto del botón a "Start"
        taskItem.classList.remove('active');
        taskItem.classList.add('paused'); // Cambiamos el fondo a amarillo (pausado)
    } else {
        // Si no hay un temporizador corriendo, lo iniciamos
        startTimerBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`; // Cambiamos el texto del botón a "Pause"
        taskItem.classList.remove('paused');
        taskItem.classList.add('active'); // Cambiamos el fondo a verde (en ejecución)

        taskObj.intervalId = setInterval(() => {
            taskObj.timeLeft--;
            timeLeftEl.textContent = `${Math.floor(taskObj.timeLeft / 60)} min ${taskObj.timeLeft % 60} sec`;

            if (taskObj.timeLeft <= 0) {
                clearInterval(taskObj.intervalId);
                taskObj.intervalId = null;
                alert(`Pomodoro terminado para la tarea: ${taskObj.taskName}`);
                startTimerBtn.textContent = 'Start';  // Reiniciamos el texto del botón
                timeLeftEl.textContent = `${taskObj.pomodoroDuration} min`;
                taskItem.classList.remove('active');
                taskItem.classList.add('completed'); // Cambiamos el fondo a rojo (completado)
                taskObj.timeLeft = taskObj.pomodoroDuration * 60;  // Reseteamos el tiempo
            }
        }, 1000);
    }
}

function addTask(taskName, pomodoroDuration) {
    const taskClone = taskTemplate.content.cloneNode(true);
    const taskItem = taskClone.querySelector('.task-item');
    const taskNameEl = taskClone.querySelector('.task-name');
    const timeLeftEl = taskClone.querySelector('.time-left');
    const editBtn = taskClone.querySelector('.edit-btn');
    const deleteBtn = taskClone.querySelector('.delete-btn');
    const startTimerBtn = taskClone.querySelector('.start-timer-btn');
    const completeCheckbox = taskClone.querySelector('.task-complete-checkbox');
    
    taskNameEl.textContent = taskName;
    timeLeftEl.textContent = `${pomodoroDuration} min`;

    const taskObj = { taskName, pomodoroDuration, timeLeft: pomodoroDuration * 60, intervalId: null, completed: false };

    tasks.push(taskObj);

    startTimerBtn.addEventListener('click', function() {
        startPomodoro(taskObj, timeLeftEl, startTimerBtn, taskItem);
    });

    editBtn.addEventListener('click', function() {
        editTask(taskObj, taskNameEl, timeLeftEl);
    });

    deleteBtn.addEventListener('click', function() {
        deleteTask(taskItem, taskObj);
    });

    completeCheckbox.addEventListener('change', function() {
        toggleCompleteTask(taskItem, taskObj);
    });

    taskList.appendChild(taskItem);
}

  function toggleCompleteTask(taskItem, taskObj) {
    taskObj.completed = !taskObj.completed;
    if (taskObj.completed) {
      taskItem.classList.add("completed");
    } else {
      taskItem.classList.remove("completed");
    }
  }
 

  function editTask(taskObj, taskNameEl, timeLeftEl) {
    const newTaskName = prompt("Editar tarea:", taskObj.taskName);
    const newDuration = parseInt(
      prompt("Editar duración del Pomodoro (min):", taskObj.pomodoroDuration)
    );

    if (newTaskName && !isNaN(newDuration)) {
      taskObj.taskName = newTaskName;
      taskObj.pomodoroDuration = newDuration;
      taskObj.timeLeft = newDuration * 60;

      taskNameEl.textContent = newTaskName;
      timeLeftEl.textContent = `${newDuration} min`;
    }
  }

  function deleteTask(taskItem, taskObj) {
    clearInterval(taskObj.intervalId);
    taskList.removeChild(taskItem);
    tasks = tasks.filter((t) => t !== taskObj);
  }
});
