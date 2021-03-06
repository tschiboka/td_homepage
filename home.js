const elems = {};
const app = {
    activityMeter: {
        open: false,
        openCloseAnimationIsRunning: false,
        timerIsRunning: false,
        timerInterval: undefined,
        timer: 0,
        activityNames: JSON.parse(localStorage.activityMeter).map(e => e.name),
        currentActivity: JSON.parse(localStorage.activityMeter).map(e => e.name)[0],
        settingsIsOpen: false,
        settingsActivitiesMenuIsOpen: false,
        activitiesMenuInputIsOpen: false,
    }
}



function startHome() {
    primeActivityMeterElements();

    document.addEventListener("click", e => handleClickEvents(e));
    elems.activityMeterCurrentActivity.innerHTML = app.activityMeter.currentActivity;
    app.activityMeter.prevTime = JSON.parse(localStorage.activityMeter).find(e => e.name === app.activityMeter.currentActivity).time;
    displayActivityTime();
    renderActivityList();
}



function primeActivityMeterElements() {
    elems.activityMeter = document.querySelector(".activity-meter");
    elems.activityMeterIcon = document.querySelector(".activity-meter__icon");
    elems.activityMeterDisplay = document.querySelector(".activity-meter__display");
    elems.activityMeterStartStopBtn = document.querySelector(".activity-meter__start-stop-timer-btn");
    elems.activityMeterHour = document.querySelector(".activity-meter__time > div:first-child");
    elems.activityMeterMin = document.querySelector(".activity-meter__time > div:nth-child(2)");
    elems.activityMeterSec = document.querySelector(".activity-meter__time > div:last-child");
    elems.activityMeterCurrentActivity = document.querySelector(".activity-meter__activity-name");
    elems.activityMeterSettings = document.querySelector(".activity-meter__settings");
    elems.activityMeterSettingsBtn = document.querySelector(".activity-meter__settings-btn");
    elems.activityMeterActivitiesMenu = document.querySelector(".activity-meter__activities");
    elems.activityMeterActivityList = document.querySelector(".activity-meter__activities__activity-list");
    elems.activityMeterActivityInputBox = document.querySelector(".activity-meter__activities__input-box");
    elems.activityMeterActivityInput = document.querySelector(".activity-meter__activities__input-box > input");
    elems.activityMeterActivityInputOKBtn = document.querySelector(".activity-meter__activities__input-box > button");
}



function handleClickEvents(e) {
    // activity meter
    if ((Array.from(e.target.classList) || []).find(cl => /activity-meter/g.test(cl))) handleActivityMeterClickEventDelegation(e);
}



function handleActivityMeterClickEventDelegation(e) {
    const origin = (e.target.classList[0] || "").replace(/activity-meter__/g, "");

    console.log(origin);

    switch (origin) {
        case "icon": { } // intentional fall-through!
        case "icon-box": { }
        case "icon-part": { handleActivityMeterIconClick(); break; }
        case "start-stop-timer-btn": { handleActivityMeterStartStopBtnClick(); break; }
        case "settings-btn": { handleActivityMeterSettingsBtnClick(); break; }
        case "settings__close": { closeActivityMeter(); break; }
        case "settings__activities": { openCloseSettingsActivity(); break; }
        case "activities__add-btn": { showActivitiesInput(); break; }
        case "activities__OK-btn": { addNewActivity(); break; }
        case "activities__activity-list__item": { setActivity(e.target); break; }
    }
}



function handleActivityMeterIconClick() {
    if (app.activityMeter.openCloseAnimationIsRunning) return void 0;

    app.openCloseAnimationIsRunning = true;

    if (app.activityMeter.open) closeActivityMeter();
    else openActivityMeter();
}


function openActivityMeter() {
    elems.activityMeter.appendChild(elems.activityMeterDisplay);
    elems.activityMeterDisplay.style.animation = "activity-meter-fade 0.5s linear reverse";
    const timer1 = setTimeout(() => {
        const clone = elems.activityMeterDisplay.cloneNode(true);
        elems.activityMeterDisplay = clone;
        const timer2 = setTimeout(() => {
            elems.activityMeter.removeChild(document.querySelector(".activity-meter__display"));
            clone.style.animation = "";
            elems.activityMeter.appendChild(clone);
            app.activityMeter.openCloseAnimationIsRunning = false;
            primeActivityMeterElements(); // all childs loosing references
            app.activityMeter.open = true;
            clearTimeout(timer2);
            clearTimeout(timer1);
        }, 500);
    }, 500);
}



function closeActivityMeter() {
    elems.activityMeterSettings.style.display = "none";
    elems.activityMeterSettingsBtn.style.borderBottom = "1px solid #ddd";
    app.activityMeter.settingsIsOpen = false;
    elems.activityMeterDisplay.style.animation = "activity-meter-fade 0.5s linear";
    const timer1 = setTimeout(() => {
        const clone = elems.activityMeterDisplay.cloneNode(true);
        elems.activityMeter.removeChild(document.querySelector(".activity-meter__display"));
        elems.activityMeterDisplay = clone;
        const timer2 = setTimeout(() => {
            app.activityMeter.openCloseAnimationIsRunning = false;
            app.activityMeter.open = false;
            clearTimeout(timer2);
            clearTimeout(timer1);
        }, 500);
    }, 500);
}



function handleActivityMeterStartStopBtnClick() {
    running = app.activityMeter.timerIsRunning;
    app.activityMeter.timerIsRunning = !running;

    if (app.activityMeter.timerIsRunning) {
        elems.activityMeterStartStopBtn.innerHTML = "&#9632;";
        elems.activityMeterStartStopBtn.title = "stop";
        app.activityMeter.timerIsRunning = true;
        app.activityMeter.timerInterval = setInterval(() => { incrementActivityMeterTimer(); }, 1000);
    }
    else {
        elems.activityMeterStartStopBtn.innerHTML = "&#9658;";
        elems.activityMeterStartStopBtn.title = "start";
        app.activityMeter.timerIsRunning = false;
        clearInterval(app.activityMeter.timerInterval);
        saveActivityTime();
    }
}



function displayActivityTime() {
    const time = app.activityMeter.timer + Number(app.activityMeter.prevTime);
    const hour = Math.floor(time / 3600);
    const min = Math.floor((time % 3600) / 60);
    const sec = time % 60;

    elems.activityMeterSec.innerHTML = sec + "s";
    elems.activityMeterMin.innerHTML = min + "m";
    elems.activityMeterHour.innerHTML = hour + "h";
}



function incrementActivityMeterTimer() {
    ++app.activityMeter.timer;

    displayActivityTime();
}



function saveActivityTime() {
    const storage = JSON.parse(localStorage.activityMeter);
    const index = storage.findIndex(e => e.name === app.activityMeter.currentActivity);
    storage[index].time = app.activityMeter.timer + Number(app.activityMeter.prevTime);
    localStorage.setItem("activityMeter", JSON.stringify(storage));
}



function handleActivityMeterSettingsBtnClick() {
    app.activityMeter.settingsIsOpen = !app.activityMeter.settingsIsOpen;

    if (app.activityMeter.settingsIsOpen) {
        elems.activityMeterSettings.style.display = "flex";
        elems.activityMeterSettingsBtn.style.borderBottom = "none";
    }
    else {
        elems.activityMeterSettings.style.display = "none";
        elems.activityMeterSettingsBtn.style.borderBottom = "1px solid #ddd";
    }
}



function openCloseSettingsActivity() {
    app.activityMeter.settingsActivitiesMenuIsOpen = !app.activityMeter.settingsActivitiesMenuIsOpen;

    if (app.activityMeter.settingsActivitiesMenuIsOpen) { elems.activityMeterActivitiesMenu.style.display = "flex"; }
    else { elems.activityMeterActivitiesMenu.style.display = "none"; }
}



function renderActivityList() {
    // empty activity list first in order not to push them multiple times
    if (elems.activityMeterActivityList.getElementsByTagName("li").length) {
        while (elems.activityMeterActivityList.firstChild) { elems.activityMeterActivityList.removeChild(elems.activityMeterActivityList.lastChild); }
    }

    app.activityMeter.activityNames.sort().map(act => {
        const div = document.createElement("li");
        div.innerHTML = act;
        div.classList = "activity-meter__activities__activity-list__item"
        div.setAttribute("data-activity", act);
        elems.activityMeterActivityList.appendChild(div);
    });
}



function showActivitiesInput() {
    app.activityMeter.activitiesMenuInputIsOpen = !app.activityMeter.activitiesMenuInputIsOpen;

    if (app.activityMeter.activitiesMenuInputIsOpen) elems.activityMeterActivityInputBox.style.display = "flex";
    else elems.activityMeterActivityInputBox.style.display = "none";
}



function addNewActivity() {
    const inputVal = elems.activityMeterActivityInput.value;
    if (!inputVal) return void (0);

    let storage = JSON.parse(localStorage.activityMeter);
    storage.push({ name: inputVal, time: "0" });
    storage = JSON.stringify(storage);
    localStorage.setItem("activityMeter", storage);
    app.activityMeter.activityNames = JSON.parse(localStorage.activityMeter).map(e => e.name);

    elems.activityMeterActivityInput.value = "";
    elems.activityMeterActivityInputBox.style.display = "none";
    renderActivityList();
}



function setActivity(target) {
    const newActivity = target.getAttribute("data-activity");
    app.activityMeter.currentActivity = newActivity;
    elems.activityMeterCurrentActivity.innerHTML = newActivity;
}