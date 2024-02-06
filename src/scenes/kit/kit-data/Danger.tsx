/*! Delete configuration */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "~/Components/Button";
import { Input } from "~/Components/Input";
import { schemas } from "~/api";
import { useAppDispatch } from "~/hooks";
import { kitConfigurationDeleted } from "~/modules/kit/actions";
import { KitState } from "~/modules/kit/reducer";
import { notificationSuccess } from "~/modules/notification";
import { addNotificationRequest } from "~/modules/notification/actions";
import { PDForbidden, PDNotFound } from "~/problems";
import { rtkApi } from "~/services/astroplant";
import { configurationToNameString } from "~/utils/configuration";

export type DangerProps = {
  kit: KitState;
  configuration: schemas["KitConfigurationWithPeripherals"];
};

export function DeleteSuccess() {
  return (
    <>
      <header>
        <h2>Delete configuration</h2>
      </header>
      <p>The configuration was successfully deleted.</p>
    </>
  );
}

export function Danger({ kit, configuration }: DangerProps) {
  const [delete_, setDelete] = useState("");
  const [triggerDelete, deleteResult] = rtkApi.useDeleteConfigurationMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // TODO: perhaps we should navigate away from this UI on kit/configuration
  // change to help prevent some user mistakes.

  const canDelete = useMemo(
    () => delete_.toLowerCase() === "delete",
    [delete_],
  );

  useEffect(() => {
    setDelete("");
  }, [configuration]);

  useEffect(() => {
    console.warn(deleteResult);
    if (deleteResult.isSuccess) {
      const notification = notificationSuccess(
        "Configuration deleted",
        "The configuration was successfully deleted.",
      );
      dispatch(addNotificationRequest(notification));
      dispatch(
        kitConfigurationDeleted({
          serial: kit.serial,
          kitId: kit.details!.id,
          kitConfigurationId: configuration.id,
        }),
      );
      navigate("../../configurations");
    }
  }, [deleteResult, kit, configuration]);

  let error = (
    <>The configuration could not be deleted due to an unknown error.</>
  );
  if (deleteResult.error) {
    if ("type" in deleteResult.error) {
      if (
        deleteResult.error.type === "APPLICATION" &&
        PDNotFound.is(deleteResult.error.data)
      ) {
        error = (
          <>
            The configuration could not be deleted because it was not found.
            Perhaps it has already been removed?
          </>
        );
      } else if (
        deleteResult.error.type === "APPLICATION" &&
        PDForbidden.is(deleteResult.error.data)
      ) {
        error = (
          <>You are not authorized to delete configurations of this kit.</>
        );
      }
    }
  }

  return (
    <>
      <header>
        <h2>Delete configuration</h2>
      </header>
      <p>
        Deleting a configuration permanently removes all measurements and media
        associated with it.
      </p>
      <p>
        To delete configuration{" "}
        <strong>{configurationToNameString(configuration)}</strong>, type
        "delete" in the box below and press the button.{" "}
        <strong>This cannot be undone</strong>.
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          triggerDelete({ configurationId: configuration.id });
        }}
      >
        <Input
          value={delete_}
          onChange={(e) => setDelete(e.currentTarget.value)}
          placeholder="To confirm, write 'delete'"
          disabled={!deleteResult.isUninitialized}
        />
        <Button
          type="submit"
          disabled={!canDelete || !deleteResult.isUninitialized}
          loading={deleteResult.isLoading}
          variant="negative"
        >
          Delete configuration
        </Button>
      </form>
      {deleteResult.isError && (
        <p className="error">
          <strong>{error}</strong>
        </p>
      )}
    </>
  );
}
