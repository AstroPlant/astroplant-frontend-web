import { schemas } from "~/api";
import { rtkApi } from "~/services/astroplant";

import { Link } from "react-router-dom";
import { Button } from "~/Components/Button";
import Gravatar from "~/Components/Gravatar";
import { DropdownDetails } from "~/Components/DropdownDetails";

import style from "./Members.module.css";
import clsx from "clsx";
import { IconCheck } from "@tabler/icons-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ModalDialog } from "~/Components/ModalDialog";
import { Input } from "~/Components/Input";

export type Props = {
  kit: schemas["Kit"];
};

export default function Members({ kit }: Props) {
  const { data } = rtkApi.useGetKitMembersQuery({ kitSerial: kit.serial });
  const [deleteKitMembership, { error: deleteKitMembershipError }] =
    rtkApi.useDeleteKitMembershipMutation();

  useEffect(() => {
    if (deleteKitMembershipError !== undefined) {
      // TODO: use something other than an `alert`
      if (
        "type" in deleteKitMembershipError &&
        deleteKitMembershipError.type === "APPLICATION" &&
        deleteKitMembershipError.data.title !== undefined
      ) {
        alert(
          "Could not remove the kit member.\n\n" +
            deleteKitMembershipError.data.title,
        );
      } else {
        alert("Could not remove the kit member.\n\nAn unknown error occurred");
      }
    }
  }, [deleteKitMembershipError]);

  return (
    <>
      <ul className={style.members}>
        {data?.map((membership) => (
          <li key={membership.id}>
            <section className={style.user}>
              <Link
                to={`/user/${membership.user.username}`}
                className={style.avatar}
              >
                <Gravatar identifier={membership.user.gravatar} size={42} />
              </Link>
              <Link to={`/user/${membership.user.username}`}>
                {membership.user.displayName}
              </Link>
            </section>
            <section className={style.roles}>
              <RoleSelector kitMembership={membership} />
            </section>
            <section className={style.actions}>
              <Button
                variant="muted"
                size="small"
                onClick={() => {
                  deleteKitMembership({
                    kitMembershipId: membership.id,
                    kitId: kit.id,
                  });
                }}
              >
                Remove
              </Button>
            </section>
          </li>
        ))}
      </ul>
    </>
  );
}

function RoleSelector({
  kitMembership,
}: {
  kitMembership: schemas["KitMembership"];
}) {
  // NOTE: in the back-end roles are currently modelled as two booleans:
  // "configure access" and "super access". Super access grants all
  // permissions, configure access grants a subset of permissions of super
  // access. For now we present this to the user as a simple selection of a
  // single role. I'm not sure if it ever becomes interesting to have an actual
  // role matrix where different roles do not necessarily grant a subset of
  // permissions of different roles; if we do, this role selection will have to
  // change.

  const role = {
    accessSuper: kitMembership.accessSuper,
    accessConfigure: kitMembership.accessConfigure,
  };

  const [patchKitMembership, { error }] =
    rtkApi.usePatchKitMembershipMutation();

  const refRadioViewOnly = useRef<HTMLInputElement>(null);
  const refRadioConfigure = useRef<HTMLInputElement>(null);
  const refRadioAdmin = useRef<HTMLInputElement>(null);

  const viewOnly = !role.accessSuper && !role.accessConfigure;
  const configure = role.accessConfigure && !role.accessSuper;
  const admin = role.accessSuper;

  let currentRole = "View-only";
  if (role.accessSuper) {
    currentRole = "Admin";
  } else {
    currentRole = "Configure";
  }

  useEffect(() => {
    if (error !== undefined) {
      // TODO: use something other than an `alert`
      if (
        "type" in error &&
        error.type === "APPLICATION" &&
        error.data.title !== undefined
      ) {
        alert("Could not remove the kit member.\n\n" + error.data.title);
      } else {
        alert("Could not remove the kit member.\n\nAn unknown error occurred");
      }
    }
  }, [error]);

  const onChange = useMemo(
    () => (e: ChangeEvent<HTMLInputElement>) => {
      const newRole = e.target.value;
      let patch: null | schemas["PatchKitMembership"] = null;
      switch (newRole) {
        case "viewOnly":
          patch = { accessConfigure: false, accessSuper: false };
          break;
        case "configure":
          patch = { accessConfigure: true, accessSuper: false };
          break;
        case "admin":
          patch = { accessConfigure: false, accessSuper: true };
          break;
      }

      if (patch !== null) {
        patchKitMembership({ kitMembershipId: kitMembership.id, patch });
      }
    },
    [kitMembership.id],
  );

  return (
    <DropdownDetails
      className={style.configurations}
      label={
        <div className={style.roleLabel}>
          <span>Role: </span>
          <span>{currentRole}</span>
        </div>
      }
      title="Change this member's role"
      header="Choose a role"
      anchor="right"
    >
      <form onSubmit={(e) => e.preventDefault}>
        <ul role="menu" className={style.rolesOptions}>
          <li
            className={clsx(viewOnly && style.selected)}
            onClick={() => {
              refRadioViewOnly.current!.click();
            }}
          >
            <input
              ref={refRadioViewOnly}
              type="radio"
              hidden
              name="role"
              value="viewOnly"
              checked={viewOnly}
              onChange={onChange}
            />
            <div>
              <IconCheck />
            </div>
            <div>
              <header>View-only</header>
              <div>Can view and download data</div>
            </div>
          </li>
          <li
            className={clsx(configure && style.selected)}
            onClick={() => {
              refRadioConfigure.current!.click();
            }}
          >
            <input
              ref={refRadioConfigure}
              type="radio"
              hidden
              name="role"
              value="configure"
              checked={configure}
              onChange={onChange}
            />
            <div>
              <IconCheck />
            </div>
            <div>
              <header>Configure</header>
              <div>
                Can view and download data, add and delete configurations
              </div>
            </div>
          </li>
          <li
            className={clsx(admin && style.selected)}
            onClick={() => {
              refRadioAdmin.current!.click();
            }}
          >
            <input
              ref={refRadioAdmin}
              type="radio"
              hidden
              name="role"
              value="admin"
              checked={admin}
              onChange={onChange}
            />
            <div>
              <IconCheck />
            </div>
            <div>
              <header>Admin</header>
              <div>
                Can view and download data, add and delete configurations,
                manage members
              </div>
            </div>
          </li>
        </ul>
      </form>
    </DropdownDetails>
  );
}
