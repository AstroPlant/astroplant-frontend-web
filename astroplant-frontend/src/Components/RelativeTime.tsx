import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";

const RelativeTime = (props: { to: DateTime }) => {
  const [relativeTime, setRelativeTime] = useState(props.to.toRelative());

  useEffect(() => {
    setRelativeTime(props.to.toRelative());
    const intervalId = setInterval(() => {
      setRelativeTime(props.to.toRelative());
    }, 1000);

    return function cleanup() {
      clearInterval(intervalId);
    };
  }, [props.to]);

  return <>{relativeTime}</>;
};

export default RelativeTime;
