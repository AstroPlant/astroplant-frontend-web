import React from "react";
import { AddButtonProps } from "@rjsf/core";
import { Button, Icon } from "semantic-ui-react";

const AddButton = (props: AddButtonProps) => {
  return (
    <Button {...props} icon labelPosition='left' color='teal'>
      <Icon name="plus" />
      Add Item
    </Button>
  );
};

export default AddButton;
