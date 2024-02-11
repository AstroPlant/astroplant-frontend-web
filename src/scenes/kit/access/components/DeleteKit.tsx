import { useId, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { schemas } from "~/api";
import { rtkApi } from "~/services/astroplant";
import { useAppDispatch } from "~/hooks";
import { notificationSuccess } from "~/modules/notification";
import { addNotificationRequest } from "~/modules/notification/actions";
import { Button } from "~/Components/Button";
import { useModalConfirmDialog } from "~/Components/ModalDialog";

import style from "./style.module.css";

export type Props = {
  kit: schemas["Kit"];
};

export default function DeleteKit({ kit }: Props) {
  const { t } = useTranslation();
  const id = useId();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [deleteKitMutation] = rtkApi.useDeleteKitMutation();
  const { element: confirmElement, trigger: confirmTrigger } =
    useModalConfirmDialog();

  const kitName = useMemo(() => kit.name || "Unnamed", [kit]);

  return (
    <section className={style.item}>
      {confirmElement}
      <div>
        <div>
          <strong>Delete</strong>
        </div>
        Permanently delete this kit.
      </div>
      <Button
        id={id}
        variant="negative"
        onClick={async () => {
          if (
            !(await confirmTrigger({
              body: (
                <Trans i18nKey="kitAccess.deleteKitConfirm">
                  {{ kitName }}
                </Trans>
              ),
            }))
          ) {
            return;
          }

          try {
            await deleteKitMutation({
              kitSerial: kit.serial,
            });
          } catch {
            return;
          }

          const notification = notificationSuccess(
            "Kit deleted",
            "This kit was successfully deleted",
          );
          dispatch(addNotificationRequest(notification));
          navigate("/me", { replace: true });
        }}
      >
        {t("kitAccess.deleteKit")}
      </Button>
    </section>
  );
}
