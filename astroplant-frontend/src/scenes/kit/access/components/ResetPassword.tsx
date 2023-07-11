import React from "react";
import compose from "~/utils/compose";
import { withTranslation, WithTranslation } from "react-i18next";
import { Card, Icon, Input } from "semantic-ui-react";

import ApiButton from "../../../../Components/ApiButton";
import { api, Response, schemas } from "~/api";

type State = {
  password?: string;
};

export type Props = {
  kit: schemas["Kit"];
};

type PInner = WithTranslation & Props;

const Button = ApiButton<any>();

class ResetPassword extends React.Component<PInner, State> {
  state: State = {};

  onResponse(response: Response<string>) {
    this.setState({ password: response.data });
  }

  send() {
    const { kit } = this.props;

    return api.resetPassword({
      kitSerial: kit.serial,
    });
  }

  render() {
    const { t, kit } = this.props;

    const kitName = kit.name || "Unnamed";

    return (
      <Card color="orange" centered raised fluid>
        <Card.Content>
          <Card.Header>Kit password</Card.Header>
          <Card.Description>
            {this.state.password ? (
              <Input
                fluid
                icon={<Icon name="lock" inverted circular link />}
                value={this.state.password || ""}
                readOnly
              />
            ) : (
              <Button
                send={this.send.bind(this)}
                onResponse={this.onResponse.bind(this)}
                label={t("kitAccess.resetPassword")}
                buttonProps={{ negative: true }}
                confirm={() => ({
                  content: t("kitAccess.resetPasswordConfirm", {
                    kitName,
                  }),
                })}
              />
            )}
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }
}

export default compose<PInner, Props>(withTranslation())(ResetPassword);
