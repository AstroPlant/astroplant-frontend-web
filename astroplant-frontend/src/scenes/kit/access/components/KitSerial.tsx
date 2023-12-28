import { IconIdBadge2 } from "@tabler/icons-react";
import { useId } from "react";

import { Input } from "~/Components/Input";
import { schemas } from "~/api";

export type Props = {
  kit: schemas["Kit"];
};

export default function KitSerial({ kit }: Props) {
  const id = useId();

  return (
    <>
      <div>
        <label htmlFor={id}>
          <strong>Kit serial</strong>
        </label>
      </div>
      <Input
        id={id}
        fullWidth
        value={kit.serial}
        leftAdornment={<IconIdBadge2 />}
        readOnly
        onClick={(e) => {
          e.currentTarget.select();
        }}
      />
    </>
  );
}
