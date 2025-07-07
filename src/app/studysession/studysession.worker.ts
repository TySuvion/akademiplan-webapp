/// <reference lib="webworker" />

enum TimerState {
  STUDY = 'STUDY',
  BREAK = 'BREAK',
}

interface TimerMessage {
  type: 'START' | 'PAUSE' | 'STOP' | 'RESET';
  minutes?: number;
  state?: TimerState;
}

let timerInterval: any;
let timeLeft: number = 0;
let currentState: TimerState = TimerState.STUDY;

self.addEventListener('message', ({ data }: { data: TimerMessage }) => {
  switch (data.type) {
    case 'START':
      if (data.minutes) {
        timeLeft = data.minutes * 60; // Convert minutes to seconds
        currentState = data.state || TimerState.STUDY;
        startTimer();
      }
      break;
    case 'PAUSE':
      pauseTimer();
      break;
    case 'STOP':
      stopTimer();
      break;
    case 'RESET':
      resetTimer();
      break;
  }
});

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      console.log(timeLeft);
      self.postMessage({
        type: 'RUNNING',
        timeLeft,
        state: currentState,
      });
    } else {
      stopTimer();
      self.postMessage({
        type: 'COMPLETE',
        state: currentState,
      });
    }
  }, 1000); //delay of 1 second (1000 milliseconds)
}

function pauseTimer() {
  clearInterval(timerInterval);
  timeLeft = timeLeft / 60; // Convert seconds back to minutes for display
  self.postMessage({
    type: 'PAUSED',
    timeLeft,
    state: currentState,
  });
}

function stopTimer() {
  clearInterval(timerInterval);
  timeLeft = 0;
}

function resetTimer() {
  stopTimer();
  self.postMessage({
    type: 'RESET',
    timeLeft: 0,
    state: currentState,
  });
}
