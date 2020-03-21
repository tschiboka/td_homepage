const elems = {};
const app = {
    activityMeter: {
        open: true,
        animationIsRunning: false,
    }
}



function startHome() {
    elems.activityMeter = document.querySelector(".activity-meter");
    elems.activityMeterIcon = document.querySelector(".activity-meter__icon");
    elems.activityMeterDisplay = document.querySelector(".activity-meter__display");

    // add eventListeners
    elems.activityMeterIcon.addEventListener("click", handleActivityMeterClick);
}



function handleActivityMeterClick() {
    if (app.animationIsRunning) return void 0;

    app.animationIsRunning = true;

    if (app.activityMeter.open) {
        elems.activityMeterDisplay.style.animation = "activity-meter-fade 0.5s linear";
        const timer1 = setTimeout(() => {
            const clone = elems.activityMeterDisplay.cloneNode(true);
            elems.activityMeter.removeChild(document.querySelector(".activity-meter__display"));
            elems.activityMeterDisplay = clone;
            const timer2 = setTimeout(() => {
                app.animationIsRunning = false;
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
                app.animationIsRunning = false;
                clearTimeout(timer2);
                clearTimeout(timer1);
            }, 500);
        }, 500);
    }
    app.activityMeter.open = !app.activityMeter.open;
}