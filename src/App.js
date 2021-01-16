// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load posenet DONE
// 6. Detect function DONE
// 7. Drawing utilities from tensorflow DONE
// 8. Draw functions DONE

import React, { useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  var poses = [];
  const maxPoses = 10;

  var calibratedPose;
  var currPose;

  var calibrated = false;

  //  Load posenet
  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    setInterval(() => {
      detect(net);
    }, 1000);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      //console.log(pose);

      if (calibrated) {
        drawCanvas(calibratedPose, video, videoWidth, videoHeight, canvasRef);
        return;
      }

      addPose(pose);

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const addPose = (pose) => {    
    if (poses.length >= maxPoses) {
      poses.shift();
    }

    poses.push(pose);

    if (!calibrated && poses.length == maxPoses) {
      calibratePose();
    }
  }

  const ergoComputation = () => {
    if (poses.length < maxPoses) {
      return;
    }

    //PostureChecker();
    //ArmChecker();
  }

  const calibratePose = (minConfidence) => {
    calibrated = true;
    for (var i = 0; i < poses[0]["keypoints"].length; i ++) {
      var poseComponent = PoseComponent;
      poseComponent.part = poses[0][i].part;
      poseComponent.keypoints = 

      var count = 0;

      for (var j = 0; j < maxPoses; j ++) {
        console.log("Pose" + j);
        console.log(poses[j]);
        if (poses[j]["keypoints"][i].score >= minConfidence) {
          poseComponent["keypoints"][i].position.x += poses[j]["keypoints"][i].position.x;
          poseComponent["keypoints"][i].position.y += poses[j]["keypoints"][i].position.y;
          poseComponent["keypoints"][i].score += poses[j]["keypoints"][i].score;

          count ++;
        }
      }

      poseComponent["keypoints"][i].position.x /= count;
      poseComponent["keypoints"][i].position.y /= count;
      poseComponent["keypoints"][i].score /= count;

      calibratedPose = poseComponent;
      currPose = poseComponent;
    }

    console.log("Calibrating done");
    console.log(calibratedPose);
    console.log("harembe");
  }


  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  runPosenet();

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  );
}

const PoseComponent = {
  "position": {
    "x": double = 0, 
    "y": double = 0
  },
  "part": String,
  "score": double = 0
}

const Pose = {
    "keypoints": [
      {
        PoseComponents,
      }
    ]
  };

export default App;