const stopwatch = document.querySelector("[data-stopwatch]");

let stopwatchInterval;
let runningTime = 0;

function startTimer() {
  let startTime = Date.now() - runningTime;

  stopwatchInterval = setInterval(() => {
    runningTime = Date.now() - startTime;
    stopwatch.textContent = calculateTime(runningTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(stopwatchInterval);
}

function resetTimer() {
  runningTime = 0;
  clearInterval(stopwatchInterval);
  stopwatch.textContent = "00:00";
}

function calculateTime(runningTime) {
  const totalSeconds = Math.floor(runningTime / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);

  const displaySeconds = (totalSeconds % 60).toString().padStart(2, "0");
  const displayMinutes = totalMinutes.toString().padStart(2, "0");

  return `${displayMinutes}:${displaySeconds}`;
}

export { startTimer, stopTimer, resetTimer };
