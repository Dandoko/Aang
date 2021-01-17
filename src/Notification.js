import React from "react";
import Model from "./Model";
import { Heading } from "@chakra-ui/react";

export default function Notification({ bodyPoint, distance }) {
  //let hasGoodPosture = bodyPoint === "" ? false : <Heading>Please fix your {bodyPoint}</Heading>;

  return (
    <div>
      <Heading>Your distance is {distance} </Heading>
      <Model bodyPoint={bodyPoint}></Model>
    </div>
  );
}
