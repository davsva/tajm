import * as common from "./common.js";

function dayToCellIndex(day) {
    if (day === 0)
        return 8;
    return day + 1;
}

async function fillCalendar(year, month) {
    const yearCell = document.getElementById("year");
    const monthCell = document.getElementById("month");

    // Fetch additional (Swedish) information about the month from https://sholiday.faboul.se/
    let dayInfo;
    try {
        const response = await fetch(`https://sholiday.faboul.se/dagar/v2.1/${year}/${common.pad(month + 1, 2)}`);
        dayInfo = await response.json();
    } catch (error) {
        // TypeError: Failed to fetch
        console.error("There was an error", error);
    }

    // First clear calendar
    for (let i = 0; i < 48; i++) {
        const cellId = "cell-data-" + (i + 1);
        const cell = document.getElementById(cellId);
        cell.innerHTML = null;
        cell.classList.remove("red-text");
        cell.classList.remove("today");
        cell.classList.remove("cal-cell-filled");
    }
    // Then fill it up
    yearCell.innerHTML = year;
    let firstDay = new Date(year, month, 1);
    monthCell.innerHTML = firstDay.toLocaleString("en-us", { month: "long" });
    let lastDay = new Date(year, month + 1, 0);
    let daysInMonth = lastDay.getDate();
    let rowOffset = 0;

    for (let i = 0; i < daysInMonth; i++) {
        const day = new Date(year, month, i + 1);
        const cellIndex = rowOffset + dayToCellIndex(day.getDay());
        const cellId = "cell-data-" + cellIndex;
        const cell = document.getElementById(cellId);

        cell.innerHTML = (i + 1);

        // Make it hoverable
        cell.classList.add("cal-cell-filled");

        // Set the ckass red-text if the day is a röd dag
        if (dayInfo.dagar[i]["röd dag"] === "Ja") {
            cell.classList.add("red-text");
        }
        // Set the class today if this is today
        if (common.sameDay(day, new Date())) {
            cell.classList.add("today");
        }

        // Might it be time to show the week number
        if ((cellIndex % 8) == 0) {
            rowOffset += 8;
            const cellWeekId = "cell-data-" + (cellIndex - 7);
            const cellWeek = document.getElementById(cellWeekId);
            cellWeek.innerHTML = day.iso8601Week();
        }
        // The last day needs to be payed extra attention for the week numbers to be displayed 
        // correctly
        if (i + 1 == daysInMonth) {
            // The condinional prevents the edge case when the last day of a week is on a Sunday, if 
            // not skipped the same old week number is displayed on an empty line
            if (cellIndex % 8 != 0) {
                const cellWeekId = "cell-data-" + (Math.floor(cellIndex / 8) * 8 + 1);
                const cellWeek = document.getElementById(cellWeekId);
                cellWeek.innerHTML = day.iso8601Week();
            }
        }
    }
}

const prevMonthButton = document.getElementById("prevMonthButton");
const nextMonthButton = document.getElementById("nextMonthButton");
const todayButton = document.getElementById("todayButton");
const calContainer = document.getElementById("cal-container");

const startTime = document.getElementById("startTimeInput");
const endTime = document.getElementById("endTimeInput");

let currentDate = new Date();
let showingDate = currentDate;

prevMonthButton.addEventListener("click", (event) => { // eslint-disable-line no-unused-vars
    showingDate = new Date(showingDate.getFullYear(), showingDate.getMonth() - 1, 1);
    fillCalendar(showingDate.getFullYear(), showingDate.getMonth());
});

nextMonthButton.addEventListener("click", (event) => { // eslint-disable-line no-unused-vars
    showingDate = new Date(showingDate.getFullYear(), showingDate.getMonth() + 1, 1);
    fillCalendar(showingDate.getFullYear(), showingDate.getMonth());
});

todayButton.addEventListener("click", (event) => { // eslint-disable-line no-unused-vars
    currentDate = new Date();
    showingDate = currentDate;
    showingDate = new Date(showingDate.getFullYear(), showingDate.getMonth(), 1);
    fillCalendar(showingDate.getFullYear(), showingDate.getMonth());
});

calContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.classList.contains("cal-cell-filled")) {
        console.log("clicked on day = " + target.innerHTML + " in year " + showingDate.getFullYear() + " of month " + showingDate.getMonth());
    }
});


/* Assure that a time field matches [0-2][0-9]:[0-5][0-9] when typed and that is a valid time */
function validateTimeField(event) {
    let target = event.target;
    switch (target.value.length) {
    case 1: {
        if (! target.value.match("[0-2]") ) {
            target.value = null;
        }
        break; 
    }
    case 2: {
        if (! target.value.match("[0-2][0-9]") ) {
            target.value = null;
            break;
        }
        // Check that the hour is >= 0 and < 24
        if (! (target.value >= 0 && target.value < 24)) {
            target.value = null;
            break;
        }
        // Prohibit the colon addition if the key is backspace or delete
        if (! (event.key === "Backspace" || event.key === "Delete")) {
            target.value += ":";
        }
        break; 
    }
    case 3: {
        if (! target.value.match("[0-2][0-9]:") ) {
            target.value = null;
        }
        break;
    }
    case 4: {
        if (! target.value.match("[0-2][0-9]:[0-5]") ) {
            target.value = null;
        }
        break;
    }
    case 5: {
        if (! target.value.match("[0-2][0-9]:[0-5][0-9]") ) {
            target.value = null;
            break;
        }
        // Check that the minute is >= 0 and < 60
        let minute = target.value.substring(3);
        if (! (minute >= 0 && minute < 60)) {
            target.value = null;
            break;
        }
        break;
    }
    default: break;
    }
}

startTime.addEventListener("keyup", (event) => {
    validateTimeField(event);
}); 

endTime.addEventListener("keyup", (event) => {
    validateTimeField(event);
}); 

todayButton.innerHTML = currentDate.getDate();
fillCalendar(showingDate.getFullYear(), showingDate.getMonth());