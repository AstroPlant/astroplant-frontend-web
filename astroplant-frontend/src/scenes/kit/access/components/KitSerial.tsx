import React from "react";
import { compose } from "recompose";
import { withTranslation, WithTranslation } from "react-i18next";
import { Card } from "semantic-ui-react";

import { Kit } from "astroplant-api";

type State = {
  password?: string;
};

export type Props = {
  kit: Kit;
};

type PInner = WithTranslation & Props;

class KitSerial extends React.Component<PInner, State> {
  state: State = {};

  render() {
    const { kit } = this.props;

    return (
      <Card color="orange" centered raised fluid>
        <Card.Content>
          <Card.Header>Kit serial</Card.Header>
          <Card.Description>{kit.serial}</Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default compose<PInner, Props>(withTranslation())(KitSerial);
