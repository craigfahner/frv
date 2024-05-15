const express = require('express')
const path = require('path')
const { get } = require('request')
const WebSocket = require('ws');
const http = require('http');
//const bash = require("child_process");
const { exec } = require('child_process');
const Gpio = require('orange-pi-gpio'); // comment these out when not running on orangepi
let gpio5 = new Gpio({pin:1,mode:'in'}); // this one too
let printing = false;
const bashScriptPath = '/home/orangepi/Downloads/print.sh';



const app = express()
const server = http.createServer(app);
const wss = new WebSocket.Server({server});

let gpioState = false;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const viewsDir = path.join(__dirname, 'views')
app.use(express.static(viewsDir))
app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, '../images')))
app.use(express.static(path.join(__dirname, '../media')))
app.use(express.static(path.join(__dirname, '../../weights')))
app.use(express.static(path.join(__dirname, '../../dist')))

app.get('/', (req, res) => res.redirect('/face_detection'))
app.get('/face_detection', (req, res) => res.sendFile(path.join(viewsDir, 'faceDetection.html')))
app.get('/face_landmark_detection', (req, res) => res.sendFile(path.join(viewsDir, 'faceLandmarkDetection.html')))
app.get('/face_expression_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'faceExpressionRecognition.html')))
app.get('/age_and_gender_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'ageAndGenderRecognition.html')))
app.get('/face_extraction', (req, res) => res.sendFile(path.join(viewsDir, 'faceExtraction.html')))
app.get('/face_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'faceRecognition.html')))
app.get('/video_face_tracking', (req, res) => res.sendFile(path.join(viewsDir, 'videoFaceTracking.html')))
app.get('/webcam_face_detection', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceDetection.html')))
app.get('/webcam_face_landmark_detection', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceLandmarkDetection.html')))
app.get('/webcam_face_expression_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'webcamFaceExpressionRecognition.html')))
app.get('/webcam_age_and_gender_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'webcamAgeAndGenderRecognition.html')))
app.get('/bbt_face_landmark_detection', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceLandmarkDetection.html')))
app.get('/bbt_face_similarity', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceSimilarity.html')))
app.get('/bbt_face_matching', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceMatching.html')))
app.get('/bbt_face_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'bbtFaceRecognition.html')))
app.get('/batch_face_landmarks', (req, res) => res.sendFile(path.join(viewsDir, 'batchFaceLandmarks.html')))
app.get('/batch_face_recognition', (req, res) => res.sendFile(path.join(viewsDir, 'batchFaceRecognition.html')))

app.post('/fetch_external_image', async (req, res) => {
  const { imageUrl } = req.body
  if (!imageUrl) {
    return res.status(400).send('imageUrl param required')
  }
  try {
    const externalResponse = await request(imageUrl)
    res.set('content-type', externalResponse.headers['content-type'])
    return res.status(202).send(Buffer.from(externalResponse.body))
  } catch (err) {
    return res.status(404).send(err.toString())
  }
})

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  // Handle messages received from the client
  ws.on('message', function incoming(message) {
      console.log('Received message from client: ', message);
  });

  // Send a message to the client
  //ws.send('saveimage');
});

server.listen(3000, () => console.log('Listening on port 3000!'))

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function(resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
      },
      returnBuffer ? { encoding: null } : {}
    )

    get(options, function(err, res) {
      if (err) return reject(err)
      return resolve(res)
    })
  })
}



function readGPIO(){
  gpio5.read()
  .then((state)=>{
      //console.log(state); //state of pin 5
      gpioState = state;
      if(state == 0 && printing == false){
        console.log("button press detected");
        const client = wss.clients.values().next().value;
        if (client) {
          // Sending the message
          client.send('saveimage');
        } else {
          console.log('No client connected');
        }
        // bash.execFile('/home/orangepi/Downloads/print.sh', (err,stdout,stderr) => {
        //   if (err) {
        //     console.error(err);
        //   } else {
        //     console.log(`stdout from print script: ${stdout.toString()}`);
        //   }
        // });
        const myShellScript = exec('sh /home/orangepi/Downloads/print.sh');
        myShellScript.stdout.on('data', (data)=>{
          console.log(data); 
          // do whatever you want here with data
        });
        myShellScript.stderr.on('data', (data)=>{
            console.error(data);
        });
      
        togglePrinting();
      }
  });
}

setInterval(readGPIO, 100);

async function togglePrinting() {
  printing = true; // Set printing to true
  console.log('Printing set to true');
  

  // Wait for 10 seconds
  await new Promise(resolve => setTimeout(resolve, 10000));

  printing = false; // Set printing to false after 10 seconds
  console.log('Printing set to false');
}