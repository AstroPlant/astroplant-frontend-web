import { Navigate } from "react-router-dom";
import {
  withAuthentication,
  WithAuthentication,
} from "~/Components/AuthenticatedGuard";

type Props = WithAuthentication;

function Me({ me }: Props) {
  return <Navigate to={`/user/${me.username}`} />;
}

export default withAuthentication()(Me);
