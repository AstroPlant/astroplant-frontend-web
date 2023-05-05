import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

const RelativeTime = (props: { to: DateTime }) => {
  const [relativeTime, setRelativeTime] = useState(props.to.toRelative());
  const [intervalId, setIntervalId] = useState<null | NodeJS.Timer>(null);

  useEffect(() => {
    let mounted = true;
    setIntervalId(
      setInterval(() => {
        if (mounted) {
          setRelativeTime(props.to.toRelative());
        }
      }, 10000)
    );
    return function cleanup() {
      mounted = false;
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return <>{relativeTime}</>;
};

export default RelativeTime;
