import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Icon, Input } from "semantic-ui-react";

import ApiButton from "~/Components/ApiButton";
import { api, Response, schemas } from "~/api";

export type Props = {
  kit: schemas["Kit"];
};

const Button = ApiButton<any>();

export default function ResetPassword({ kit }: Props) {
  const { t } = useTranslation();
  const [password, setPassword] = useState<string | null>(null);

  const onResponse = (response: Response<string>) => {
    setPassword(response.data);
  };

  const send = () => {
    return api.resetPassword({
      kitSerial: kit.serial,
    });
  };

  const kitName = kit.name || "Unnamed";

  return (
    <Card color="orange" centered raised fluid>
      <Card.Content>
        <Card.Header>Kit password</Card.Header>
        <Card.Description>
          {password ? (
            <Input
              fluid
              icon={<Icon name="lock" inverted circular link />}
              value={password || ""}
              onClick={(ev: any) => ev.target.select()}
              readOnly
            />
          ) : (
            <Button
              send={send}
              onResponse={onResponse}
              label={t("kitAccess.resetPassword")}
              buttonProps={{ variant: "negative" }}
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
