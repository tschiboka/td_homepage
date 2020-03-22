const elems = {};
const app = {
    activityMeter: {
        open: true,
        openCloseAnimationIsRunning: false,
        timerIsRunning: false,
        timerInterval: undefined,
        timer: 0,
        activityNames: JSON.parse(localStorage.activityMeter).map(e => e.name),
        currentActivity: JSON.parse(localStorage.activityMeter).map(e => e.name)[0],
        settingsIsOpen: false,
    }
}



function startHome() {
    primeActivityMeterElements();

    elems.activityMeter.addEventListener("click", e => handleActivityMeterClickEventDelegation(e));
    elems.activityMeterCurrentActivity.innerHTML = app.activityMeter.currentActivity;
    app.activityMeter.prevTime = JSON.parse(localStorage.activityMeter).find(e => e.name === app.activityMeter.currentActivity).time;
    displayActivityTime();
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
}



function handleActivityMeterClickEventDelegation(e) {
    const origin = (e.target.classList[0] || "").replace(/activity-meter__/g, "");

    switch (origin) {
        case "icon": { } // intentional fall-through!
        case "icon-box": { }
        case "icon-part": { handleActivityMeterIconClick(); break; }
        case "start-stop-timer-btn": { handleActivityMeterStartStopBtnClick() }
        case "settings-btn": { handleActivityMeterSettingsBtnClick() }
    }
}



function handleActivityMeterIconClick() {
    if (app.activityMeter.openCloseAnimationIsRunning) return void 0;

    app.openCloseAnimationIsRunning = true;

    if (app.activityMeter.open) {
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
                clearTimeout(timer2);
                clearTimeout(timer1);
            }, 500);
        }, 500);
    }
    else {
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
                clearTimeout(timer2);
                clearTimeout(timer1);
            }, 500);
        }, 500);
    }
    app.activityMeter.open = !app.activityMeter.open;
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