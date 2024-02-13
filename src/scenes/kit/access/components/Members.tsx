import { schemas } from "~/api";
import { rtkApi } from "~/services/astroplant";

import { Link } from "react-router-dom";
import { Button } from "~/Components/Button";
import Gravatar from "~/Components/Gravatar";
import { DropdownDetails } from "~/Components/DropdownDetails";

import style from "./Members.module.css";
import clsx from "clsx";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { ModalDialog, useModalConfirmDialog } from "~/Components/ModalDialog";
import { Input } from "~/Components/Input";
import { useAppSelector, useDebounce } from "~/hooks";
import { selectMe } from "~/modules/me/reducer";

export type Props = {
  kit: schemas["Kit"];
};

export default function Members({ kit }: Props) {
  const { data } = rtkApi.useGetKitMembersQuery({ kitSerial: kit.serial });
  const [deleteKitMembership, { error: deleteKitMembershipError }] =
    rtkApi.useDeleteKitMembershipMutation();

  const [addingMember, setAddingMember] = useState(false);

  const me = useAppSelector(selectMe);

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
      <Button
        variant="primary"
        style={{ marginBottom: "1rem" }}
        onClick={() => setAddingMember(true)}
      >
        Add a member
      </Button>
      <ModalDialog open={addingMember} onClose={() => setAddingMember(false)}>
        <AddMember kit={kit} close={() => setAddingMember(false)} />
      </ModalDialog>
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
                confirm={
                  membership.user.username === me.username
                    ? () => ({
                        content: {
                          header: "Please confirm",
                          body: (
                            <>
                              Please confirm you wish to remove yourself from
                              this kit. If you confirm, your membership of this
                              kit will immediately be removed. You will no
                              longer be able to configure this kit.
                            </>
                          ),
                        },
                      })
                    : undefined
                }
                onClick={() => {
                  deleteKitMembership({
                    kitMembershipId: membership.id,
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

  const { element: confirmElement, trigger: confirmTrigger } =
    useModalConfirmDialog();

  const me = useAppSelector(selectMe);

  let currentRole = "View-only";
  if (configure) {
    currentRole = "Configure";
  } else if (admin) {
    currentRole = "Admin";
  }

  useEffect(() => {
    if (error !== undefined) {
      // TODO: use something other than an `alert`
      if (
        "type" in error &&
        error.type === "APPLICATION" &&
        error.data.title !== undefined
      ) {
        alert("Could not change the kit member's role.\n\n" + error.data.title);
      } else {
        alert(
          "Could not change the kit member's role.\n\nAn unknown error occurred",
        );
      }
    }
  }, [error]);

  const onChange = useMemo(
    () => async (e: ChangeEvent<HTMLInputElement>) => {
      if (kitMembership.user.username === me.username) {
        const confirmed = await confirmTrigger({
          header: "Are you sure?",
          body: (
            <>
              Are you sure you wish to change your own role? If you confirm,
              your role will be changed immediately. You may not be able to
              change your role back.
            </>
          ),
        });

        if (!confirmed) {
          return;
        }
      }

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
    [
      confirmTrigger,
      patchKitMembership,
      kitMembership.id,
      kitMembership.user,
      me.username,
    ],
  );

  return (
    <>
      {confirmElement}
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
    </>
  );
}

function AddMember({ kit, close }: { kit: schemas["Kit"]; close: () => void }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 250);

  const [selectedUser, setSelectedUser] = useState<schemas["User"] | null>(
    null,
  );
  const [success, setSuccess] = useState(false);

  const { data: suggestions } = rtkApi.useGetKitMemberSuggestionsQuery(
    {
      kitSerial: kit.serial,
      query: { username: debouncedQuery },
    },
    { skip: debouncedQuery === "" },
  );
  const [addKitMember] = rtkApi.useAddKitMemberMutation();

  return (
    <>
      <p>
        Find people to add to <strong>{kit.serial}</strong>
      </p>
      {selectedUser ? (
        success ? (
          <section>
            <p>
              User <strong>{selectedUser.displayName}</strong> has successfully
              been added as member.
            </p>
            <Button
              className={style.add}
              variant="primary"
              leftAdornment={<IconX />}
              onClick={async () => {
                setSelectedUser(null);
                setSuccess(false);
                setQuery("");
                close();
              }}
            >
              Close
            </Button>
          </section>
        ) : (
          <section className={style.addMemberSelection}>
            <div className={style.selectedMember}>
              <Gravatar
                identifier={selectedUser.gravatar}
                size={32}
                className={style.avatar}
              />
              <div>
                <strong>{selectedUser.displayName}</strong>
                <br />
                <span className={style.username}>{selectedUser.username}</span>
              </div>
              <div className={style.cancel}>
                <Button variant="text" onClick={() => setSelectedUser(null)}>
                  <IconX />
                </Button>
              </div>
            </div>
            <p>
              Do you want to add <strong>{selectedUser.displayName}</strong> to
              this kit?
            </p>
            <div>
              <Button
                className={style.add}
                leftAdornment={<IconPlus />}
                variant="primary"
                onClick={async () => {
                  const result = await addKitMember({
                    kitSerial: kit.serial,
                    member: {
                      username: selectedUser.username,
                      accessConfigure: false,
                      accessSuper: false,
                    },
                  });
                  if ("data" in result) {
                    setSuccess(true);
                  } else {
                    alert("An error occurred");
                  }
                }}
              >
                Add {selectedUser.displayName}
              </Button>
            </div>
          </section>
        )
      ) : (
        <section>
          <Input
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Username"
          />
          {suggestions !== undefined && (
            <div style={{ marginTop: "1rem" }}>
              {suggestions.length === 0 ? (
                <p>
                  <strong>Could not find anyone with that username.</strong>
                </p>
              ) : (
                <ul className={style.memberSuggestions} role="listbox">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.username}
                      role="option"
                      aria-selected={false}
                      onClick={() => setSelectedUser(suggestion)}
                    >
                      <Gravatar
                        identifier={suggestion.gravatar}
                        size={32}
                        className={style.avatar}
                      />{" "}
                      {suggestion.username}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}
