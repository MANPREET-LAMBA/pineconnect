import Auth_check from "./Auth_check";
import Portal_layout from "./Portal_layout";
import Portal_conn from "./Portal_conn";

export default function Portal() {
  return (
    <Auth_check>
      <Portal_layout>
        <Portal_conn />
      </Portal_layout>
    </Auth_check>
  );
}