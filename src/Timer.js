import React, { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

export default function Timer() {
  const [counter, setCounter] = useState(300);
  const [pause, setPause] = useState(true);

  let updateText = !pause ? "Pause" : "Start";

  useEffect(() => {
    if (pause) {
      clearInterval(counter);
    } else {
      const timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [counter, pause]);

  return (
    <div className="wrap">
      <Button
        style={{display: "block", marginBottom: 10, width: 230, height:50, fontSize: 30}}
        onClick={() => {
          setCounter(300);
          setPause(false);
        }}
      >
        Timer: {counter}
      </Button>
      <Button style={{width: 230, height:50, fontSize: 30}} onClick={() => setPause(!pause)}>
        {updateText}
      </Button>
    </div>
  );
}
