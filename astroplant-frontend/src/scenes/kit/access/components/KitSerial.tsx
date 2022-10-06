import React from "react";
import { compose } from "recompose";
import { withTranslation, WithTranslation } from "react-i18next";
import { Card, Icon, Input } from "semantic-ui-react";

import { KitsApi, Kit } from "astroplant-api";

import ApiButton from "../../../../Components/ApiButton";
import { AuthConfiguration } from "../../../../utils/api";

type State = {
  password?: string;
};

export type Props = {
  kit: Kit;
};

type PInner = WithTranslation & Props;

const Button = ApiButton<any>();

class KitSerial extends React.Component<PInner, State> {
  state: State = {};

  render() {
    const { t, kit } = this.props;

    const kitName = kit.name || "Unnamed";

    return (
      <Card color="orange" centered raised fluid>
        <Card.Content>
          <Card.Header>Kit serial</Card.Header>
          <Card.Description>
            {kit.serial}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default compose<PInner, Props>(withTranslation())(KitSerial);
