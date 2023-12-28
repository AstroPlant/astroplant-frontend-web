import { useId, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { IconLock } from "@tabler/icons-react";

import ApiButton from "~/Components/ApiButton";
import { Input } from "~/Components/Input";
import { api, Response, schemas } from "~/api";

import style from "./style.module.css";

export type Props = {
  kit: schemas["Kit"];
};

const Button = ApiButton<any>();

export default function ResetPassword({ kit }: Props) {
  const id = useId();

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
    <section className={style.item}>
      <div>
        <div>
          <label htmlFor={id}>
            <strong>Kit password</strong>
          </label>
        </div>
        <p>
          Generate a new password for the kit. The kit won't be able to connect
          with the old password anymore.
        </p>
      </div>
      {password ? (
        <Input
          id={id}
          fullWidth
          leftAdornment={<IconLock />}
          value={password || ""}
          onClick={(ev: any) => ev.target.select()}
          readOnly
        />
      ) : (
        <Button
          id={id}
          send={send}
          onResponse={onResponse}
          label={t("kitAccess.resetPassword")}
          buttonProps={{ variant: "negative" }}
          confirm={() => ({
            content: (
              <Trans i18nKey="kitAccess.resetPasswordConfirm">
                {{ kitName }}
              </Trans>
            ),
          })}
        />
      )}
    </section>
  );
}
