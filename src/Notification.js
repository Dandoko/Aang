import React from "react";
import Model from "./Model";

export default function Notification({ bodyPoint }) {
  return (
    <div>
      <h1>Please fix your {bodyPoint}</h1>
      <Model bodyPoint={bodyPoint}></Model>
    </div>
  );
}
