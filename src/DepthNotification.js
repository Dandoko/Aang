import React from "react";
import Model from "./Model";
import { Heading } from "@chakra-ui/react"

export default function DepthNotification({ distance }) {
  return (
    <Heading>Your distance is {distance} </Heading>
  );
}
