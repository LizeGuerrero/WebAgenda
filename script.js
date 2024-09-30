const calendar = document.querySelector(".calendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventBtn = document.querySelector(".add-event"),
    addEventWrapper = document.querySelector(".add-event-wrapper "),
    addEventCloseBtn = document.querySelector(".close "),
    addEventTitle = document.querySelector(".event-name "),
    addEventFrom = document.querySelector(".event-time-from "),
    addEventTo = document.querySelector(".event-time-to "),
    addEventSubmit = document.querySelector(".add-event-btn "),
    searchNameInput = document.getElementById("search-name"),
    searchDateInput = document.getElementById("search-date"),
    searchStartTimeInput = document.getElementById("search-start-time"),
    searchEndTimeInput = document.getElementById("search-end-time"),
    searchBtn = document.getElementById("search-btn");

    

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
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



const eventsArr = [];
getEvents();
console.log(eventsArr);


function initCalendar() {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1;

    date.innerHTML = months[month] + " " + year;

    let days = "";

    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDate; i++) {
        //revisa si el evento existe
        let event = false;
        eventsArr.forEach((eventObj) => {
            if (
                eventObj.day === i &&
                eventObj.month === month + 1 &&
                eventObj.year === year
            ) {
                event = true;
            }
        });
        if (
            i === new Date().getDate() &&
            year === new Date().getFullYear() &&
            month === new Date().getMonth()
        ) {
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);
            if (event) {
                days += `<div class="day today active event">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        } else {
            if (event) {
                days += `<div class="day event">${i}</div>`;
            } else {
                days += `<div class="day ">${i}</div>`;
            }
        }
    }

    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }
    daysContainer.innerHTML = days;
    addListner();
    
    todayBtn.addEventListener("click", () => {
        today = new Date(); // Actualiza la fecha de hoy
        month = today.getMonth(); // Obtiene el mes actual
        year = today.getFullYear(); // Obtiene el año actual
        activeDay = today.getDate(); // Obtiene el día actual
        initCalendar(); // Vuelve a inicializar el calendario
        getActiveDay(activeDay); // Actualiza el día activo
        updateEvents(activeDay); // Actualiza los eventos para el día activo
    });
}

//funcion para añadir mes
function prevMonth() {
    month--;
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();
}

function nextMonth() {
    month++;
    if (month > 11) {
        month = 0;
        year++;
    }
    initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();


function addListner() {
    const days = document.querySelectorAll(".day");
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            const clickedDay = Number(e.target.innerHTML); // Almacena el día clicado
            // Si se hizo clic en un día del mes actual
            if (!e.target.classList.contains("prev-date") && !e.target.classList.contains("next-date")) {
                activeDay = clickedDay; // Actualiza activeDay directamente
                getActiveDay(activeDay);
                updateEvents(activeDay);
                
                // Remover active de otros días
                days.forEach((day) => {
                    day.classList.remove("active");
                });
                e.target.classList.add("active"); // Marca el día clicado como activo
            } else if (e.target.classList.contains("prev-date")) {
                // Si se hizo clic en un día del mes anterior
                prevMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (!day.classList.contains("prev-date") && day.innerHTML === clickedDay.toString()) {
                            day.classList.add("active");
                            activeDay = clickedDay; // Actualiza activeDay aquí
                            getActiveDay(activeDay);
                            updateEvents(activeDay);
                        }
                    });
                }, 100);
            } else if (e.target.classList.contains("next-date")) {
                // Si se hizo clic en un día del mes siguiente
                nextMonth();
                setTimeout(() => {
                    const days = document.querySelectorAll(".day");
                    days.forEach((day) => {
                        if (!day.classList.contains("next-date") && day.innerHTML === clickedDay.toString()) {
                            day.classList.add("active");
                            activeDay = clickedDay; // Actualiza activeDay aquí
                            getActiveDay(activeDay);
                            updateEvents(activeDay);
                        }
                    });
                }, 100);
            }
        });
    });
}

gotoBtn.addEventListener("click", gotoDate);

dateInput.addEventListener("input", function (e) {
    let value = e.target.value;

    // Remover cualquier carácter que no sea número o "/"
    value = value.replace(/[^0-9/]/g, "");

    // Asegurarse de que la barra solo esté en la tercera posición
    if (value.length === 2 && !value.includes("/")) {
        value += "/";
    }

    // Dividir el valor en partes para validar el mes
    let parts = value.split("/");

    if (parts[0]) {
        let month = parts[0];

        // Corregir si el mes es mayor a 12
        if (month.length === 2 && parseInt(month) > 12) {
            month = "12"; // Limitar el mes a 12 si es mayor
        } else if (month === "00") {
            month = "01"; // Si el mes es "00", convertirlo a "01"
        }

        // Reemplazar el mes validado en las partes
        parts[0] = month;
    }

    // Limitar la longitud máxima a 7 caracteres (mm/yyyy)
    e.target.value = parts.join("/").substring(0, 7);
});

function gotoDate() {
    console.log("Aquí");
    const dateArr = dateInput.value.split("/");
    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();
            return;
        }
    }
    alert("Fecha inválida o no existente");
}



function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayName = dayNames[day.getDay()];
    eventDay.innerHTML = dayName;
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}


function updateEvents(date) {
    let events = "";
    eventsArr.forEach((event) => {
        if (
            date === event.day &&
            month + 1 === event.month &&
            year === event.year
        ) {
            event.events.forEach((event) => {
                events += `<div class="event">
            <div class="title">
                <i class="fas fa-circle"></i>
                <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
                <span class="event-time">${event.time}</span>
            </div>
        </div>`;
            });
        }
    });
    if (events === "") {
        events = `<div class="no-event">
            <h3>Sin eventos agregados</h3>
        </div>`;
    }
    eventsContainer.innerHTML = events;
    saveEvents();
}


addEventBtn.addEventListener("click", () => {
    addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
    addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
    if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
        addEventWrapper.classList.remove("active");
    }
});


addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 60);
});




addEventFrom.addEventListener("input", (e) => {
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if (addEventFrom.value.length === 2) {
        addEventFrom.value += ":";
    }
    if (addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);
    }
});

addEventTo.addEventListener("input", (e) => {
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if (addEventTo.value.length === 2) {
        addEventTo.value += ":";
    }
    if (addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);
    }
});


addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;
    if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Por favor, rellene todos los campos");
        return;
    }


    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");
    if (
        timeFromArr.length !== 2 ||
        timeToArr.length !== 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert("Formato de hora inválido");
        return;
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);


    let eventExist = false;
    eventsArr.forEach((event) => {
        if (
            event.day === activeDay &&
            event.month === month + 1 &&
            event.year === year
        ) {
            event.events.forEach((event) => {
                if (event.title === eventTitle) {
                    eventExist = true;
                }
            });
        }
    });
    if (eventExist) {
        alert("Ya existe un evento con este nombre");
        return;
    }
    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
    };
    console.log(newEvent);
    console.log(activeDay);
    let eventAdded = false;
    if (eventsArr.length > 0) {
        eventsArr.forEach((item) => {
            if (
                item.day === activeDay &&
                item.month === month + 1 &&
                item.year === year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent],
        });
    }

    console.log(eventsArr);
    addEventWrapper.classList.remove("active");
    addEventTitle.value = "";
    addEventFrom.value = "";
    addEventTo.value = "";
    updateEvents(activeDay);

    const activeDayEl = document.querySelector(".day.active");
    if (!activeDayEl.classList.contains("event")) {
        activeDayEl.classList.add("event");
    }
});


eventsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("event")) {
        if (confirm("¿Estás seguro de eliminar este evento?")) {
            const eventTitle = e.target.children[0].children[1].innerHTML;
            eventsArr.forEach((event) => {
                if (
                    event.day === activeDay &&
                    event.month === month + 1 &&
                    event.year === year
                ) {
                    event.events.forEach((item, index) => {
                        if (item.title === eventTitle) {
                            event.events.splice(index, 1);
                        }
                    });
                    
                    if (event.events.length === 0) {
                        eventsArr.splice(eventsArr.indexOf(event), 1);
                        
                        const activeDayEl =
                            document.querySelector(".day.active");
                        if (activeDayEl.classList.contains("event")) {
                            activeDayEl.classList.remove("event");
                        }
                    }
                }
            });
            updateEvents(activeDay);
        }
    }
});


function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventsArr));
}


function getEvents() {
    
    if (localStorage.getItem("events") === null) {
        return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
    // Si el tiempo está en formato 24 horas
    if (time.includes(":")) {
        let timeArr = time.split(":");
        let timeHour = parseInt(timeArr[0], 10);
        let timeMin = timeArr[1];
        
        // Determina si es AM o PM
        let timeFormat = timeHour >= 12 ? "PM" : "AM";
        timeHour = timeHour % 12 || 12; // Convierte a formato 12 horas
        return timeHour + ":" + timeMin + " " + timeFormat; // Retorna en formato 12 horas
    } else {
        // Si el tiempo está en formato 12 horas (AM/PM)
        let timeArr = time.split(" ");
        let timeHourMin = timeArr[0].split(":");
        let timeHour = parseInt(timeHourMin[0], 10);
        let timeMin = timeHourMin[1];
        let timeFormat = timeArr[1];

        // Convierte de 12 horas a 24 horas
        if (timeFormat === "PM" && timeHour !== 12) {
            timeHour += 12; // Convierte PM
        } else if (timeFormat === "AM" && timeHour === 12) {
            timeHour = 0; // Convierte 12 AM a 0 horas
        }
        
        // Asegúra de que el formato tenga dos dígitos
        return (timeHour < 10 ? "0" : "") + timeHour + ":" + timeMin; // Retorna en formato 24 horas
    }
}

function searchEvents() {
    let searchName = searchNameInput.value.toLowerCase().trim();
    let searchDate = searchDateInput.value; // Obtiene la fecha en formato YYYY-MM-DD
    let searchStartTime = searchStartTimeInput.value; // Obtiene la hora de inicio en formato 24 horas
    let searchEndTime = searchEndTimeInput.value; // Obtiene la hora de fin en formato 24 horas

    // Div para almacenar resultados
    let matchedEvents = [];

    eventsArr.forEach(event => {
        // Comprobar si hay coincidencia de nombre
        let nameMatch = event.events.some(e => e.title.toLowerCase().includes(searchName));

        // Comprobar si hay coincidencia de fecha
        let dateMatch = (searchDate === "" || (event.year === parseInt(searchDate.split("-")[0]) && event.month === parseInt(searchDate.split("-")[1]) && event.day === parseInt(searchDate.split("-")[2])));

        // Comprobar si hay coincidencia de hora de inicio
        let startTimeMatch = (searchStartTime === "" || convertTime(searchStartTime) === event.events[0].time.split(" - ")[0]);

        // Comprobar si hay coincidencia de hora de fin
        let endTimeMatch = (searchEndTime === "" || convertTime(searchEndTime) === event.events[0].time.split(" - ")[1]);

        // Si hay coincidencias en los criterios de búsqueda
        if (nameMatch && dateMatch && startTimeMatch && endTimeMatch) {
            matchedEvents.push(event); // Almacena eventos coincidentes
        }
    });

    // Llamar a la función para mostrar resultados
    displayResults(matchedEvents);
}

function displayResults(matchedEvents) {
    // Div para mostrar resultados
    let resultsHTML = "";

    if (matchedEvents.length > 0) {
        matchedEvents.forEach(event => {
            resultsHTML += `<tr>
                <td>${event.events[0].title}</td>
                <td>${event.day}/${event.month}/${event.year}</td>
                <td>${event.events[0].time}</td>
            </tr>`;
        });
    } else {
        resultsHTML = `<tr>
            <td colspan="3">No se encontraron eventos</td>
        </tr>`;
    }

    // Actualizar el cuerpo de la tabla con los resultados
    document.getElementById("events-table-body").innerHTML = resultsHTML;
}




// Añadir el evento del botón de búsqueda
document.getElementById("search-btn").addEventListener("click", searchEvents);



window.onload = function() {
    document.getElementById("search-btn").addEventListener("click", searchEvents);
};