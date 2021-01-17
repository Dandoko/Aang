import React from "react";
import head from "./res/head.png";
import left from "./res/leftArm.png";
import right from "./res/rightArm.png";
import legs from "./res/legs.png";
import base from "./res/base.png";

// chooses which model image to display
export default function Model({ bodyPoint }) {
  switch (bodyPoint) {
    case "nose":
    case "leftEye":
    case "rightEye":
    case "leftEar":
    case "rightEar":
    case "leftShoulder":
    case "rightShoulder":
      return <img src={head} alt="head model" style={bodyImg} />;
    case "leftElbow":
    case "leftWrist":
      return <img src={left} alt="left arm model" style={bodyImg} />;
    case "rightElbow":
    case "rightWrist":
      return <img src={right} alt="right arm model" style={bodyImg} />;
    case "leftHip":
    case "rightHip":
    case "leftKnee":
    case "rightKnee":
    case "leftAnkle":
    case "rightAnkle":
      return <img src={legs} alt="leg model" style={bodyImg} />;
    default:
      return <img src={base} alt="base model" style={bodyImg} />;
  }
}

const bodyImg = {
  backgroundColor: "transparent",
};
