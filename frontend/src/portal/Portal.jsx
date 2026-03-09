import Auth_check from "./Auth_check";
import Portallayout from "./Portal_layout";
import Portalconn from "./Portal_conn";

export default function Portal() {
  return (
    <Auth_check>
      <Portallayout>
        <Portalconn />
      </Portallayout>
    </Auth_check>
  );
}