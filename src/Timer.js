import React, { useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";

export default function Timer() {
  const [counter, setCounter] = useState(0);
  const [pause, setPause] = useState(true);

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
        size="lg"
        onClick={() => {
          setCounter(300);
          setPause(false);
        }}
      >
        Timer: {counter}
      </Button>
      <Button size="lg" onClick={() => setPause(!pause)}>
        Pause
      </Button>
    </div>
  );
}
