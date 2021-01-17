// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load posenet DONE
// 6. Detect function DONE
// 7. Drawing utilities from tensorflow DONE
// 8. Draw functions DONE

import React, { useRef, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";
import PoseComponent from "./PoseComponent";
import Pose from "./Pose";
import Notification from "./Notification";
import DepthNotification from "./DepthNotification";

// chakra imports
import { Button, Flex, Spacer, Box } from "@chakra-ui/react";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  var poses = []; // stores 10 most recent poses - nose, eyes, ...
  const maxPoses = 10;

  var calibratedPose = new Pose();
  var currPose = new Pose();

  var calibrated = false;

  const [bodyPoint, setBodyPoint] = useState("");
  const [distance, setDistance] = useState("Neutral");

  //  Load posenet
  const runPosenet = async () => {
    console.log("Running Posenet :)");
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

      addPose(pose);

      if (calibrated) {
        console.log(calibratedPose);
        drawCanvas(calibratedPose, video, videoWidth, videoHeight, canvasRef);

        ergoComputation();
        return;
      } else {
        console.log("loading :o");
      }

      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  // replaces oldest pose with newest pose
  const addPose = (pose) => {
    if (poses.length >= maxPoses) {
      poses.shift();
    }

    poses.push(pose);

    if (poses.length == maxPoses) {
      averagePoses(0.6);
    }
  };

  const ergoComputation = () => {
    console.log("Eroge");
    if (poses.length < maxPoses) {
      return;
    }

    PostureChecker(0.7);
    //ArmChecker();
  };

  const averagePoses = (minConfidence) => {
    currPose = new Pose();
    // loops 17 times for 17 keypoints (body parts)
    for (var i = 0; i < poses[0]["keypoints"].length; i++) {
      // initialize component
      var poseComponent = new PoseComponent();
      console.log(poses[0]["keypoints"][i]);
      poseComponent.part = poses[0]["keypoints"][i].part;

      var count = 0;

      for (var j = 0; j < maxPoses; j++) {
        //console.log("Pose" + j);
        //console.log(poses[j]);
        if (poses[j]["keypoints"][i].score >= minConfidence) {
          // get sum for mean
          poseComponent.position.x += poses[j]["keypoints"][i].position.x;
          poseComponent.position.y += poses[j]["keypoints"][i].position.y;
          poseComponent.score += poses[j]["keypoints"][i].score;

          count++;

          //console.log(count);
        }
      }

      if (count == 0) {
        poseComponent.position.x = 0;
        poseComponent.position.y = 0;
        poseComponent.score = 0;
      } else {
        poseComponent.position.x /= count;
        poseComponent.position.y /= count;
        poseComponent.score /= count;
      }

      //console.log(poseComponent);

      if (!calibrated) {
        calibratedPose["keypoints"].push(poseComponent);
      }
      currPose["keypoints"].push(poseComponent);
    }

    console.log("Calibrating done");
    console.log(calibratedPose);

    calibrated = true;
  };

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  const PostureChecker = (minConfidence) => {
    var useNose = true;
    var useEyes = true;
    var useEars = true;

    console.log(
      currPose["keypoints"][1].score + "||||" + currPose["keypoints"][2].score
    );

    if (currPose["keypoints"][0].score < minConfidence) {
      useNose = false;
    }

    if (
      currPose["keypoints"][1].score < minConfidence ||
      currPose["keypoints"][2].score < minConfidence
    ) {
      useEyes = false;
    }

    if (
      currPose["keypoints"][3].score < minConfidence ||
      currPose["keypoints"][4].score < minConfidence
    ) {
      useEars = false;
    }

    //Caclulate distance between eyes ,eears, and height
    let calNosePos = calibratedPose["keypoints"][0].position;
    let actNosePos = currPose["keypoints"][0].position;
    let calNoseHeight = Math.sqrt(calNosePos.y);
    let actNoseHeight = Math.sqrt(actNosePos.y);

    let calLEyePos = calibratedPose["keypoints"][1].position;
    let calREyePos = calibratedPose["keypoints"][2].position;
    let actLEyePos = currPose["keypoints"][1].position;
    let actREyePos = currPose["keypoints"][2].position;

    let calEyeDist = Math.sqrt(
      (calLEyePos.x - calREyePos.x) * (calLEyePos.x - calREyePos.x) +
        (calLEyePos.y - calREyePos.y) * (calLEyePos.y - calREyePos.y)
    );
    let actEyeDist = Math.sqrt(
      (actLEyePos.x - actREyePos.x) * (actLEyePos.x - actREyePos.x) +
        (actLEyePos.y - actREyePos.y) * (actLEyePos.y - actREyePos.y)
    );

    let calLEarPos = calibratedPose["keypoints"][3].position;
    let calREarPos = calibratedPose["keypoints"][4].position;
    let actLEarPos = currPose["keypoints"][3].position;
    let actREarPos = currPose["keypoints"][4].position;

    let calEarDist = Math.sqrt(
      (calLEarPos.x - calREarPos.x) * (calLEarPos.x - calREyePos.x) +
        (calLEarPos.y - calREarPos.y) * (calLEarPos.y - calREarPos.y)
    );
    let actEarDist = Math.sqrt(
      (actLEarPos.x - actREarPos.x) * (actLEarPos.x - actREarPos.x) +
        (actLEarPos.y - actREarPos.y) * (actLEarPos.y - actREarPos.y)
    );

    //Use those values to detemrine posture
    var isLower = false;
    var eyesCloser = false;
    var earsCloser = false;
    var eyesFurther = false;
    var earsFurther = false;

    let noseDistDiffThreshold = 1.3;
    let eyeDistDiffThreshold = 0.4;
    let earDistDiffThreshold = 0.5;

    isLower = actNoseHeight - calNoseHeight > noseDistDiffThreshold;

    eyesCloser = actEyeDist - calEyeDist > eyeDistDiffThreshold;
    earsCloser = actEarDist - calEarDist > earDistDiffThreshold;

    eyesFurther = calEyeDist - actEyeDist > eyeDistDiffThreshold;
    earsFurther = calEarDist - actEarDist > earDistDiffThreshold;

    //Determine bad posture
    if (isLower && useNose) {
      //|| isCloser || isFurther) {
      setBodyPoint("leftEye");
    } else {
      setBodyPoint("");
    }

    if ((eyesCloser && useEyes) || (useEars && earsCloser)) {
      //set state "close"
      setDistance("Close");
    } else if ((eyesFurther && useEyes) || (useEars && earsFurther)) {
      setDistance("Far");
    } else {
      setDistance("Neutral")
    }

    console.log(
      useEyes +
        " | " +
        calEyeDist +
        " | " +
        actEyeDist +
        " | " +
        eyeDistDiffThreshold +
        "\n"
    );

    console.log(
      calNoseHeight +
        " | " +
        actNoseHeight +
        " | " +
        noseDistDiffThreshold +
        "\n"
    );
    console.log(bodyPoint);
    console.log("============================================================");
  };

  // runPosenet();

  return (
    <div className="App">
      <Button
        onClick={() => {
          runPosenet();
        }}
        size="lg"
      >
        Calibrate
      </Button>

      <header className="App-header" style={{ float: "right" }}>
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0.02,
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
      <Notification
        bodyPoint={bodyPoint}
      ></Notification>
      <DepthNotification distance={distance}
      ></DepthNotification>

      <Flex>
        <Box p="400" bg="red.400">
          Box 1
        </Box>
        <Spacer /> {/* eats available space */}
        <Box p="4" bg="green.400">
          Box 2
        </Box>
        <Notification colSpan={6} bodyPoint={"bodyPoint"}></Notification>
      </Flex>
    </div>
  );
}

export default App;
