const textArea = document.getElementById('text-area');
const startRecordingBtn = document.getElementById('start-recording');
const stopRecordingBtn = document.getElementById('stop-recording');
const playbackBtn = document.getElementById('playback');
const stopPlaybackBtn = document.getElementById('stop-playback');
const mouseCursor = document.getElementById('mouse-cursor');

let recording = false;
let playback = false;
let events = [];

// Start recording
startRecordingBtn.addEventListener('click', () => {
    recording = true;
    events = [];
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = false;
    playbackBtn.disabled = true;
    stopPlaybackBtn.disabled = true;
    textArea.focus();
});

// Stop recording
stopRecordingBtn.addEventListener('click', () => {
    recording = false;
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
    playbackBtn.disabled = false;
    stopPlaybackBtn.disabled = true;
});

// Record textarea changes
textArea.addEventListener('input', (event) => {
    if (recording) {
        events.push({
            type: 'input',
            value: textArea.value,
            cursorPos: textArea.selectionStart,
            time: Date.now()
        });
    }
});

// Record text selection
textArea.addEventListener('select', () => {
    if (recording) {
        events.push({
            type: 'select',
            start: textArea.selectionStart,
            end: textArea.selectionEnd,
            time: Date.now()
        });
    }
});

// Record cursor position
textArea.addEventListener('click', () => {
    if (recording) {
        events.push({
            type: 'cursor',
            position: textArea.selectionStart,
            time: Date.now()
        });
    }
});


// Playback recorded events
playbackBtn.addEventListener('click', () => {
    if (events.length === 0) return;
    let startTime = events[0].time;
    playback = true;
    playbackBtn.disabled = true;
    stopPlaybackBtn.disabled = false;
    textArea.value = '';
    textArea.focus();
    let i = 0;

    function playEvent() {
        if (!playback || i >= events.length) return;
        const event = events[i];
        const delay = (i === 0) ? 0 : event.time - events[i - 1].time;

        setTimeout(() => {
            if (event.type === 'input') {
                textArea.value = event.value;
                textArea.selectionStart = textArea.selectionEnd = event.cursorPos;
            } else if (event.type === 'select') {
                textArea.selectionStart = event.start;
                textArea.selectionEnd = event.end;
            } else if (event.type === 'cursor') {
                textArea.selectionStart = textArea.selectionEnd = event.position;
            } else if (event.type === 'mouse') {
                mouseCursor.style.left = `${event.x}px`;
                mouseCursor.style.top = `${event.y}px`;
            }
            i++;
            playEvent();
        }, delay);
    }

    playEvent();
});

// Stop playback and clear recording
stopPlaybackBtn.addEventListener('click', () => {
    playback = false;
    events = [];
    textArea.value = '';
    playbackBtn.disabled = true;
    stopPlaybackBtn.disabled = true;
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
});
