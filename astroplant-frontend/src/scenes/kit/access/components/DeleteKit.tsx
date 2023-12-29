import { useId, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { api, Response, schemas } from "~/api";
import ApiButton from "~/Components/ApiButton";
import { useAppDispatch } from "~/hooks";
import { notificationSuccess } from "~/modules/notification";
import { addNotificationRequest } from "~/modules/notification/actions";
import { deleteKit } from "~/modules/kit/actions";

import style from "./style.module.css";

const Button = ApiButton<any>();

export type Props = {
  kit: schemas["Kit"];
};

export default function DeleteKit({ kit }: Props) {
  const { t } = useTranslation();
  const id = useId();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onResponse = useMemo(
    () => (_: Response<void>) => {
      const notification = notificationSuccess(
        "Kit deleted",
        "This kit was successfully deleted",
      );
      dispatch(addNotificationRequest(notification));
      dispatch(deleteKit({ serial: kit.serial, kitId: kit.id }));
      navigate("/me", { replace: true });
    },
    [dispatch, kit, navigate],
  );

  const send = useMemo(
    () => () => {
      return api.deleteKit({
        kitSerial: kit.serial,
      });
    },
    [kit],
  );

  const kitName = useMemo(() => kit.name || "Unnamed", [kit]);

  return (
    <section className={style.item}>
      <div>
        <div>
          <strong>Delete</strong>
        </div>
        Permanently delete this kit.
      </div>
      <Button
        id={id}
        send={send}
        onResponse={onResponse}
        label={t("kitAccess.deleteKit")}
        buttonProps={{ variant: "negative" }}
        confirm={() => ({
          content: (
            <Trans i18nKey="kitAccess.deleteKitConfirm">{{ kitName }}</Trans>
          ),
        })}
      />
    </section>
  );
}
