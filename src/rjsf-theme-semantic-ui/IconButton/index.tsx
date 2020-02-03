import React from "react";
import { Button, Icon } from "semantic-ui-react";

const mappings: any = {
  remove: <Icon name="delete" />,
  plus: <Icon name="plus" />,
  "arrow-up": <Icon name="arrow up" />,
  "arrow-down": <Icon name="arrow down" />
};

const IconButton = (props: any) => {
  return (
    <Button {...props} icon>
      { mappings[props.icon] }
    </Button>
  );
};

export default IconButton;
