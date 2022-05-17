let stream = null,
    audio = null,
    mixedStream = null,
    chunks = [],
    recorder = null,
    recordedVideo = null;
downloadButton = null;
var gazeData = [];
var onlyTime = [];

window.onload = function () {
    setupStream();
    //start the webgazer tracker
    webgazer.setRegression('ridge') /* currently must set regression and tracker */
        .setTracker('clmtrackr')
        .setGazeListener(function (data, clock) {
            // console.log(data); /* data is an object containing an x and y key which are the x and y prediction coordinates (no bounds limiting) */

            if (data != null && data["x"] > 0 && data["y"] > 0 && isCalibrated && data["x"] <= screen.width && data["y"] <= screen.height) {
                var predx = data["x"];
                var predy = data["y"];
                var elapsedTime = clock;

                // push to gazeData array
                gazeData.push([elapsedTime, predx, predy]);

                // push to onlyTime array
                onlyTime.push([elapsedTime]);

                console.log(data["x"] + ", " + data["y"] + ", " + clock);
            }

            //   console.log(clock); /* elapsed time in milliseconds since webgazer.begin() was called */
            //   console.log(elapsedTime);
        })
        .begin()
        .showPredictionPoints(true); /* shows a square every 100 milliseconds where current prediction is */


    //Set up the webgazer video feedback.
    var setup = function () {

        //Set up the main canvas. The main canvas is used to calibrate the webgazer.
        var canvas = document.getElementById("plotting_canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
    };

    function checkIfReady() {
        if (webgazer.isReady()) {
            setup();
        } else {
            setTimeout(checkIfReady, 100);
        }
    }
    setTimeout(checkIfReady, 100);


};

//setup Stream 
async function setupStream() {
    try {
        stream = await navigator.mediaDevices.getDisplayMedia({
            video: true
        });

        audio = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44100,
            },
        });
        console.log('Stream set up success')
        startRecording();
    } catch (err) {
        console.error(err)
    }
}

async function startRecording() {
    if (stream && audio) {
        mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
        recorder = new MediaRecorder(mixedStream);
        recorder.ondataavailable = handleDataAvailable;
        recorder.start(1000);

        console.log('Recording started');
    } else {
        console.warn('No stream available.');
    }
}

function stopRecording() {
    recorder.stop();
}

function handleDataAvailable(e) {
    chunks.push(e.data);
}



//setup video feedback
function setupVideoFeedback() {
    if (stream) {
        const video = document.querySelector('.video-feedback');
        video.srcObject = stream;
        video.play();
    } else {
        console.warn('No stream available');
    }
}

function handleDataAvailable(e) {
    chunks.push(e.data);
}
//  exporting data to .csv
function saveGaze(expData) {
    const blob = new Blob(chunks, { 'type': 'video/mp4' });
    chunks = [];

    var csv = '';
    expData.forEach(function (row) {
        csv += row.join(',');
        csv += "\n";
    });

    downloadButton.href = URL.createObjectURL(blob);
    downloadButton.download = 'video.mp4';
    downloadButton.disabled = false;


    stream.getTracks().forEach((track) => track.stop());
    audio.getTracks().forEach((track) => track.stop());
    console.log('Recording stopped');

    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'gazeData.csv';
    hiddenElement.click();
}

window.onbeforeunload = function () {
    //webgazer.end(); //Uncomment if you want to save the data even if you reload the page.
    window.localStorage.clear(); //Comment out if you want to save data across different sessions
}

/**
 * Restart the calibration process by clearing the local storage and reseting the calibration point
 */
function Restart() {
    document.getElementById("Accuracy").innerHTML = "<a>Not yet Calibrated</a>";
    ClearCalibration();
    PopUpInstruction();
}

window.addEventListener('load', () => {
    downloadButton = document.querySelector('.download-video');

})