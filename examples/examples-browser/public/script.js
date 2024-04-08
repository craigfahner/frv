let forwardTimes = [];
let predictedAges = [];
let withBoxes = true;
let printButton = document.getElementById("print");
let expressionDisplay = document.getElementById("expressions");
let genderDisplay = document.getElementById("gender");
let ageDisplay = document.getElementById("age");
let detectionResult;
let landmarkCoords;
let expressions;
let genderResult;
let genderStr = "";
let affect;
let interpolatedAge;
let faceScore;
let genderScore;
let video;
let newFaceDetection = true;
let storedObjectLength = 0;
let detectionTimeline = [];
let timeout = 900000;
let items = [];
var videoDeviceId;
let myCanvas;

// let timeout = 60000;


//ml5
let yolo;
let objects = [];

function onChangeHideBoundingBoxes(e) {
  withBoxes = !$(e.target).prop("checked");
}

setTimeout(function(){
   window.location.reload();
}, timeout);

// window.addEventListener("click", () => {
//   document.body.requestFullscreen();
// });

// printButton.addEventListener(
//   "click",
//   () => {
//     //console.log(objects);
//     if (detectionResult != null) {
//       // console.log(detectionResult);
//       //console.log(landmarkCoords);
//       // for(var expression in detectionResult.expressions){
//       //   console.log(expression);
//       // }
//       // console.log(expressions);
//       // console.log(detectionResult.detection.box.x);
//       // console.log(detectionResult.detection.box.y);
//       // console.log(detectionResult.detection.box.width);
//       // console.log(detectionResult.detection.box.height);
//     }
//   },
//   false
// );

function updateTimeStats(timeInMs) {
  forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30);
  const avgTimeInMs =
    forwardTimes.reduce((total, t) => total + t) / forwardTimes.length;
  $("#time").val(`${Math.round(avgTimeInMs)} ms`);
  $("#fps").val(`${faceapi.utils.round(1000 / avgTimeInMs)}`);
}

function interpolateAgePredictions(age) {
  predictedAges = [age].concat(predictedAges).slice(0, 30);
  const avgPredictedAge =
    predictedAges.reduce((total, a) => total + a) / predictedAges.length;
  return avgPredictedAge;
}

// async function onPlay() {
//   const videoEl = $("#inputVideo").get(0);

//   if (videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded()) {
//     return setTimeout(() => onPlay());
//   }

//   const options = getFaceDetectorOptions();

//   const ts = Date.now();

//   const result = await faceapi
//     .detectSingleFace(videoEl, options)
//     .withAgeAndGender()
//     .withFaceExpressions();
//   const landmarkResult = await faceapi
//     .detectSingleFace(videoEl, options)
//     .withFaceLandmarks();

//   detectionResult = result;

//   updateTimeStats(Date.now() - ts);
//   const canvas = $("#overlay").get(0);
//   if (landmarkResult && result) {
//     const dims = faceapi.matchDimensions(canvas, videoEl, true);
//     const resizedLMResult = faceapi.resizeResults(landmarkResult, dims);
//     landmarkCoords = resizedLMResult.landmarks.positions;
//     const resizedResult = faceapi.resizeResults(result, dims);
//     // if (withBoxes) {
//     //   faceapi.draw.drawDetections(canvas, resizedResult, {
//     //     // options not working?
//     //     lineWidth: 1,
//     //     textColor: "red",
//     //     boxColor: "red",
//     //     withScore: false,
//     //   });
//     // }

//     const { age, gender, genderProbability } = resizedResult;
//     const minConfidence = 0.05;

//     // interpolate gender predictions over last 30 frames
//     // to make the displayed age more stable
//     interpolatedAge = interpolateAgePredictions(age);

//     // new faceapi.draw.DrawTextField(
//     //   [
//     //     `${faceapi.utils.round(interpolatedAge, 0)} years`,
//     //     `${gender} (${faceapi.utils.round(genderProbability)})`,
//     //   ],
//     //   result.detection.box.topLeft
//     // ).draw(canvas);

//     // faceapi.draw.drawFaceLandmarks(canvas, resizedLMResult, {
//     //   drawLines: false,
//     // }); // unclear why these options don't work
//     // faceapi.draw.drawFaceExpressions(canvas, resizedResult, minConfidence);

//     // dump results into vars, display on page
//     genderResult = result.gender;
//     genderScore = result.genderProbability;
//     let genderStr =
//       genderResult +
//       " (" +
//       (Math.round(genderScore * 100) / 100).toFixed(2) +
//       ")";
//     genderDisplay.innerHTML = genderStr;
//     interpolatedAge = (Math.round(interpolatedAge * 100) / 100).toFixed(0);
//     ageDisplay.innerHTML = interpolatedAge;

//     expressions = result.expressions;

//     // Create items array
//     var items = Object.keys(expressions).map(function (key) {
//       return [key, expressions[key]];
//     });

//     // Sort the array based on the second element
//     items.sort(function (first, second) {
//       return second[1] - first[1];
//     });

//     expressionDisplay.innerHTML = "";
//     // for (var i = 0; i < items.length; i++) {
//     for (var i = 0; i < 4; i++) {
//       // display sorted array
//       expressionDisplay.innerHTML =
//         expressionDisplay.innerHTML +
//         items[i][0] +
//         ": " +
//         (Math.round(items[i][1] * 100) / 100).toFixed(2) +
//         "<br>";
//     }
//     affect = items[0][0];

//     // dump face rect coords into something
//   }

//   setTimeout(() => onPlay());
// }

// async function run() {
//   // load face detection and face expression recognition models
//   await changeFaceDetector(TINY_FACE_DETECTOR);
//   await faceapi.loadFaceLandmarkModel("/");
//   await faceapi.nets.ageGenderNet.load("/");
//   await faceapi.loadFaceExpressionModel("/");
//   //await faceapi.loadFaceRecognitionModel('/');

//   changeInputSize(224);

  // try to access users webcam and stream the images
  // to the video element
//   const stream = await navigator.mediaDevices.getUserMedia({
//     video: {
//       width: 640,
//       height: 480,
//       // deviceId: {
//       //   exact: videoDeviceId,
//       // },
//     },
//   });
//   const videoEl = $("#inputVideo").get(0);
//   videoEl.srcObject = stream;
// }

// function updateResults() {}

// $(document).ready(function () {
//   // renderNavBar('#navbar', 'webcam_age_and_gender_recognition')
//   initFaceDetectionControls();
//   navigator.mediaDevices.enumerateDevices().then((devices) => {
//     console.log(devices);
//     console.log(devices[devices.length - 1].label);
//     console.log(devices[devices.length - 1].deviceId);
//     videoDeviceId = devices[devices.length - 1].deviceId;
//     run();
//   });
  
// });

// p5.js stuff

function setup() {
  myCanvas = createCanvas(1280, 720);
  textFont('Inconsolata');

  myCanvas.parent("videocontainer");
  angleMode(DEGREES);
	video = createCapture(VIDEO, async () => {
		// read machine learning models - refer to the library api doc https://github.com/justadudewhohacks/face-api.js/
		await faceapi.loadSsdMobilenetv1Model('./');
		await faceapi.loadFaceLandmarkModel('./');
		await faceapi.loadFaceRecognitionModel('./');
    await faceapi.nets.ageGenderNet.load("/");
		await faceapi.loadFaceExpressionModel('./');
		getExpressions();
	});
  video.size(640, 480);
  video.hide();
}

yolo = ml5.objectDetector("yolo", detect);

function draw() {
  clear();
  //background(255);

  if(video){
    image(video,0,0,640,480);
  }

  if (detectionResult == null) {
    detect();
  }
  if (objects.length > 0) {
    for (var q = 0; q < objects.length; q++) {
      if (objects.length != storedObjectLength) {
        addTimelineEvent(objects[q].label + " detected");
      }
      stroke(0, 255, 0);
      strokeWeight(2);
      rect(
        objects[q].normalized.x * 640,
        objects[q].normalized.y * 480,
        objects[q].normalized.width * 640,
        objects[q].normalized.height * 480
      );
      text(
        objects[q].label,
        objects[q].normalized.x * 640,
        objects[q].normalized.y * 480
      );
    }
    storedObjectLength = objects.length;
  } else {
    storedObjectLength = 0;
  }
  stroke(255, 255, 255, 100);
  noFill();
  strokeWeight(1);

  //ellipse(50,50,50,50);

  if (landmarkCoords) {
    if (detectionResult != null) {
      if (newFaceDetection == true) {
        document.getElementById("facedata").style.display = "block";
        document.getElementById("noface").style.display = "none";
        addTimelineEvent(
          interpolatedAge +
            " year old " +
            genderResult +
            " with " +
            affect +
            " affect detected"
        );
      }
      newFaceDetection = false;
      objects = [];
      image(
        crop(
          video,
          detectionResult.detection.box.x,
          detectionResult.detection.box.y,
          detectionResult.detection.box.width,
          detectionResult.detection.box.height
        ),
        680,
        40,
        150,
        150
      );
      //simplified mesh drawing
      beginShape();
      vertex(landmarkCoords[42].x, landmarkCoords[42].y);
      vertex(landmarkCoords[27].x, landmarkCoords[27].y);
      vertex(landmarkCoords[35].x, landmarkCoords[35].y);
      vertex(landmarkCoords[42].x, landmarkCoords[42].y);
      vertex(landmarkCoords[54].x, landmarkCoords[54].y);
      vertex(landmarkCoords[35].x, landmarkCoords[35].y);
      vertex(landmarkCoords[54].x, landmarkCoords[54].y);
      vertex(landmarkCoords[45].x, landmarkCoords[45].y);
      vertex(landmarkCoords[16].x, landmarkCoords[16].y);
      vertex(landmarkCoords[54].x, landmarkCoords[54].y);
      vertex(landmarkCoords[12].x, landmarkCoords[12].y);
      vertex(landmarkCoords[54].x, landmarkCoords[54].y);
      vertex(landmarkCoords[9].x, landmarkCoords[9].y);
      vertex(landmarkCoords[57].x, landmarkCoords[57].y);
      vertex(landmarkCoords[8].x, landmarkCoords[8].y);
      vertex(landmarkCoords[57].x, landmarkCoords[57].y);
      vertex(landmarkCoords[7].x, landmarkCoords[7].y);
      vertex(landmarkCoords[60].x, landmarkCoords[60].y);
      vertex(landmarkCoords[36].x, landmarkCoords[36].y);
      vertex(landmarkCoords[0].x, landmarkCoords[0].y);
      vertex(landmarkCoords[60].x, landmarkCoords[60].y);
      vertex(landmarkCoords[31].x, landmarkCoords[31].y);
      vertex(landmarkCoords[27].x, landmarkCoords[27].y);
      vertex(landmarkCoords[39].x, landmarkCoords[39].y);
      vertex(landmarkCoords[27].x, landmarkCoords[27].y);
      vertex(landmarkCoords[31].x, landmarkCoords[31].y);
      vertex(landmarkCoords[39].x, landmarkCoords[39].y);
      vertex(landmarkCoords[60].x, landmarkCoords[60].y);
      vertex(landmarkCoords[4].x, landmarkCoords[4].y);

      endShape();

      //extra bits
      beginShape();
      vertex(landmarkCoords[31].x, landmarkCoords[31].y);
      vertex(landmarkCoords[50].x, landmarkCoords[50].y);
      vertex(landmarkCoords[33].x, landmarkCoords[33].y);
      vertex(landmarkCoords[52].x, landmarkCoords[52].y);
      vertex(landmarkCoords[35].x, landmarkCoords[35].y);
      endShape();

      beginShape();
      vertex(landmarkCoords[17].x, landmarkCoords[17].y);
      vertex(landmarkCoords[36].x, landmarkCoords[36].y);
      endShape();
      beginShape();
      vertex(landmarkCoords[26].x, landmarkCoords[26].y);
      vertex(landmarkCoords[45].x, landmarkCoords[45].y);
      endShape();
      beginShape();
      vertex(landmarkCoords[39].x, landmarkCoords[39].y);
      vertex(landmarkCoords[21].x, landmarkCoords[21].y);
      vertex(landmarkCoords[27].x, landmarkCoords[27].y);
      vertex(landmarkCoords[22].x, landmarkCoords[22].y);
      vertex(landmarkCoords[42].x, landmarkCoords[42].y);
      endShape();

      stroke(255);
      // draw face outline
      beginShape();
      for (var i = 0; i <= 16; i++) {
        vertex(landmarkCoords[i].x, landmarkCoords[i].y);
        // textSize(10);
        // text(i, landmarkCoords[i].x,landmarkCoords[i].y+5);
      }
      for (var i = 26; i >= 17; i--) {
        vertex(landmarkCoords[i].x, landmarkCoords[i].y);
        // textSize(10);
        // text(i, landmarkCoords[i].x,landmarkCoords[i].y+5);
      }
      endShape(CLOSE);
      

      // draw left eye
      beginShape();
      for (var i = 36; i <= 41; i++) {
        vertex(landmarkCoords[i].x, landmarkCoords[i].y);
      }
      endShape(CLOSE);
      // draw right eye
      beginShape();
      for (var i = 42; i <= 47; i++) {
        vertex(landmarkCoords[i].x, landmarkCoords[i].y);
      }
      endShape(CLOSE);

      // draw nose vert
      beginShape();
      for (var i = 27; i <= 30; i++) {
        vertex(landmarkCoords[i].x, landmarkCoords[i].y);
      }
      vertex(landmarkCoords[33].x, landmarkCoords[33].y);
      endShape();
      // draw nose hztl
      beginShape();
      for (var i = 31; i <= 35; i++) {
        vertex(landmarkCoords[i].x, landmarkCoords[i].y);
      }
      endShape();

      //draw mouth outer
      beginShape();
      for (var i = 48; i <= 59; i++) {
        vertex(landmarkCoords[i].x, landmarkCoords[i].y);
      }
      endShape(CLOSE);
      //draw mouth inner
      beginShape();
      for (var i = 60; i <= 67; i++) {
        vertex(landmarkCoords[i].x, landmarkCoords[i].y);
      }
      endShape(CLOSE);

      
      
      
      // do it again but copy to other side
      push();
      translate(675, 170);
      let scaleFactor = map(dist(landmarkCoords[0].x, landmarkCoords[0].y,landmarkCoords[16].x, landmarkCoords[16].y),85,170,1.3,0.7);

      // scale(scaleFactor);
      scale(0.55);
      //simplified mesh drawing
      stroke(0);

      beginShape();
      vertex(
        landmarkCoords[42].x - detectionResult.detection.box.x,
        landmarkCoords[42].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[27].x - detectionResult.detection.box.x,
        landmarkCoords[27].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[35].x - detectionResult.detection.box.x,
        landmarkCoords[35].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[42].x - detectionResult.detection.box.x,
        landmarkCoords[42].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[54].x - detectionResult.detection.box.x,
        landmarkCoords[54].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[35].x - detectionResult.detection.box.x,
        landmarkCoords[35].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[54].x - detectionResult.detection.box.x,
        landmarkCoords[54].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[45].x - detectionResult.detection.box.x,
        landmarkCoords[45].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[16].x - detectionResult.detection.box.x,
        landmarkCoords[16].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[54].x - detectionResult.detection.box.x,
        landmarkCoords[54].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[12].x - detectionResult.detection.box.x,
        landmarkCoords[12].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[54].x - detectionResult.detection.box.x,
        landmarkCoords[54].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[9].x - detectionResult.detection.box.x,
        landmarkCoords[9].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[57].x - detectionResult.detection.box.x,
        landmarkCoords[57].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[8].x - detectionResult.detection.box.x,
        landmarkCoords[8].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[57].x - detectionResult.detection.box.x,
        landmarkCoords[57].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[7].x - detectionResult.detection.box.x,
        landmarkCoords[7].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[60].x - detectionResult.detection.box.x,
        landmarkCoords[60].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[36].x - detectionResult.detection.box.x,
        landmarkCoords[36].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[0].x - detectionResult.detection.box.x,
        landmarkCoords[0].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[60].x - detectionResult.detection.box.x,
        landmarkCoords[60].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[31].x - detectionResult.detection.box.x,
        landmarkCoords[31].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[27].x - detectionResult.detection.box.x,
        landmarkCoords[27].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[39].x - detectionResult.detection.box.x,
        landmarkCoords[39].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[27].x - detectionResult.detection.box.x,
        landmarkCoords[27].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[31].x - detectionResult.detection.box.x,
        landmarkCoords[31].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[39].x - detectionResult.detection.box.x,
        landmarkCoords[39].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[60].x - detectionResult.detection.box.x,
        landmarkCoords[60].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[4].x - detectionResult.detection.box.x,
        landmarkCoords[4].y - detectionResult.detection.box.y
      );

      endShape();

      //extra bits
      beginShape();
      vertex(
        landmarkCoords[31].x - detectionResult.detection.box.x,
        landmarkCoords[31].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[50].x - detectionResult.detection.box.x,
        landmarkCoords[50].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[33].x - detectionResult.detection.box.x,
        landmarkCoords[33].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[52].x - detectionResult.detection.box.x,
        landmarkCoords[52].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[35].x - detectionResult.detection.box.x,
        landmarkCoords[35].y - detectionResult.detection.box.y
      );
      endShape();

      beginShape();
      vertex(
        landmarkCoords[17].x - detectionResult.detection.box.x,
        landmarkCoords[17].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[36].x - detectionResult.detection.box.x,
        landmarkCoords[36].y - detectionResult.detection.box.y
      );
      endShape();
      beginShape();
      vertex(
        landmarkCoords[26].x - detectionResult.detection.box.x,
        landmarkCoords[26].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[45].x - detectionResult.detection.box.x,
        landmarkCoords[45].y - detectionResult.detection.box.y
      );
      endShape();
      beginShape();
      vertex(
        landmarkCoords[39].x - detectionResult.detection.box.x,
        landmarkCoords[39].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[21].x - detectionResult.detection.box.x,
        landmarkCoords[21].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[27].x - detectionResult.detection.box.x,
        landmarkCoords[27].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[22].x - detectionResult.detection.box.x,
        landmarkCoords[22].y - detectionResult.detection.box.y
      );
      vertex(
        landmarkCoords[42].x - detectionResult.detection.box.x,
        landmarkCoords[42].y - detectionResult.detection.box.y
      );
      endShape();

      stroke(0);

      // draw face outline
      beginShape();
      for (var i = 0; i <= 16; i++) {
        vertex(
          landmarkCoords[i].x - detectionResult.detection.box.x,
          landmarkCoords[i].y - detectionResult.detection.box.y
        );
        // textSize(10);
        // text(i, landmarkCoords[i].x,landmarkCoords[i].y+5);
      }
      for (var i = 26; i >= 17; i--) {
        vertex(
          landmarkCoords[i].x - detectionResult.detection.box.x,
          landmarkCoords[i].y - detectionResult.detection.box.y
        );
        // textSize(10);
        // text(i, landmarkCoords[i].x,landmarkCoords[i].y+5);
      }
      endShape(CLOSE);

      // draw left eye
      beginShape();
      for (var i = 36; i <= 41; i++) {
        vertex(
          landmarkCoords[i].x - detectionResult.detection.box.x,
          landmarkCoords[i].y - detectionResult.detection.box.y
        );
      }
      endShape(CLOSE);
      // draw right eye
      beginShape();
      for (var i = 42; i <= 47; i++) {
        vertex(
          landmarkCoords[i].x - detectionResult.detection.box.x,
          landmarkCoords[i].y - detectionResult.detection.box.y
        );
      }
      endShape(CLOSE);

      // draw nose vert
      beginShape();
      for (var i = 27; i <= 30; i++) {
        vertex(
          landmarkCoords[i].x - detectionResult.detection.box.x,
          landmarkCoords[i].y - detectionResult.detection.box.y
        );
      }
      vertex(
        landmarkCoords[33].x - detectionResult.detection.box.x,
        landmarkCoords[33].y - detectionResult.detection.box.y
      );
      endShape();
      // draw nose hztl
      beginShape();
      for (var i = 31; i <= 35; i++) {
        vertex(
          landmarkCoords[i].x - detectionResult.detection.box.x,
          landmarkCoords[i].y - detectionResult.detection.box.y
        );
      }
      endShape();

      //draw mouth outer
      beginShape();
      for (var i = 48; i <= 59; i++) {
        vertex(
          landmarkCoords[i].x - detectionResult.detection.box.x,
          landmarkCoords[i].y - detectionResult.detection.box.y
        );
      }
      endShape(CLOSE);
      //draw mouth inner
      beginShape();
      for (var i = 60; i <= 67; i++) {
        vertex(
          landmarkCoords[i].x - detectionResult.detection.box.x,
          landmarkCoords[i].y - detectionResult.detection.box.y
        );
      }
      endShape(CLOSE);

      pop();
      push();
      fill(255);
      stroke(0);

      //rect(660,360,500,200);
      pop();
      stroke(255, 0, 0);
      strokeWeight(2);
      // draw detection box

      rect(
        detectionResult.detection.box.x,
        detectionResult.detection.box.y,
        detectionResult.detection.box.width,
        detectionResult.detection.box.height
      );

// display text here
push();
textAlign(LEFT);
fill(0);
noStroke();
textSize(32);
fill(0);
textStyle(BOLD);
text('Gender:',864,80);
text('Age:',864,125);
text('Affect:',864,170);
textAlign(RIGHT);
text(genderStr,1210,80);
text(interpolatedAge,1210,125);
for (let i = 0; i < 4; i++) {
  // display sorted array
  let affectStr =
  items[i][0] +
    ": " +
    (Math.round(items[i][1] * 100) / 100).toFixed(2);
  text(affectStr,1210,170+(i*45));
}
pop();

    } else {
      if(newFaceDetection==false){
        document.getElementById("facedata").style.display = "none";
        document.getElementById("noface").style.display = "flex";
      }
      newFaceDetection = true;
    }
  }
  push();
fill(255);
noStroke();
textSize(16);
fill(0);
textStyle(BOLD);
text('Facial inferences',667,20);
pop();
}

function addTimelineEvent(text) {
  let container = document.getElementById("detectioncontainer");
  let children = container.children;
  //console.log(children.length);

  const currentDate = new Date();
  const dateString = currentDate.toLocaleString("en-US", {
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  if (children.length >= 6) {
    const lastChild = container.lastChild;

    container.removeChild(lastChild);
  }

  if (children.length <= 5) {
    let newDiv = document.createElement("div");
    newDiv.className = "flexy";
    let timeSpan = document.createElement("span");
    let textSpan = document.createElement("span");
    timeSpan.append(dateString);
    textSpan.append(text);
    newDiv.append(textSpan);
    newDiv.insertBefore(timeSpan, newDiv.firstChild);
    container.insertBefore(newDiv, container.firstChild);
  }
}

function crop(image, x, y, w, h) {
  var cropped = createImage(w, h);
  cropped.copy(image, x, y, w, h, 0, 0, w, h);
  return cropped;
}

function detect() {
  if (detectionResult == null) {
    yolo.detect(video, function (err, results) {
      if (err) {
        console.log(err);
        return;
      }
      objects = results;
      if (objects) {
        //console.log(results);
      }

      // detect();
    });
  }
}

async function getExpressions(){
  const options = getFaceDetectorOptions();
  const ts = Date.now();
	result = await faceapi.detectSingleFace(video.elt, options).withFaceLandmarks().withAgeAndGender().withFaceExpressions();
	updateTimeStats(Date.now() - ts);
  if (result) {
    detectionResult = result;
    const dims = faceapi.matchDimensions(video, video, true);
    const resizedLMResult = faceapi.resizeResults(result, dims);
    landmarkCoords = resizedLMResult.landmarks.positions;
    const resizedResult = faceapi.resizeResults(result, dims);
    const { age, gender, genderProbability } = resizedResult;
    const minConfidence = 0.05;

    // interpolate gender predictions over last 30 frames
    // to make the displayed age more stable
    interpolatedAge = interpolateAgePredictions(age);
    genderResult = result.gender;
    genderScore = result.genderProbability;
    genderStr =
      genderResult +
      " (" +
      (Math.round(genderScore * 100) / 100).toFixed(2) +
      ")";
    genderDisplay.innerHTML = genderStr;
    interpolatedAge = (Math.round(interpolatedAge * 100) / 100).toFixed(0);
    ageDisplay.innerHTML = interpolatedAge;

    expressions = result.expressions;

    // Create items array
    items = Object.keys(expressions).map(function (key) {
      return [key, expressions[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
      return second[1] - first[1];
    });

    expressionDisplay.innerHTML = "";
    // for (var i = 0; i < items.length; i++) {
    for (var i = 0; i < 4; i++) {
      // display sorted array
      expressionDisplay.innerHTML =
        expressionDisplay.innerHTML +
        items[i][0] +
        ": " +
        (Math.round(items[i][1] * 100) / 100).toFixed(2) +
        "<br>";
    }




    affect = items[0][0];

  }
  
  getExpressions(); // recursively call getExpressions function forever

}

function keyTyped(){
  if(key == 's'){
     savedImg = myCanvas.get(675,30,550,300);
     savedImg.save('my-painting', 'png');
   }
}

const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = function() {
            console.log('Connected to server');
        };

        ws.onmessage = function(event) {
            console.log('Received message from server: ', event.data);

            // Trigger your client-side function here
            // For example:
            // myFunction();
        };
