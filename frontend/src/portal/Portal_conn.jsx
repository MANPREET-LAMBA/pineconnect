import LicenseRow from "./LicenseRow";

export default function Portal_conn() {
  return (
    <div className=" flex justify-end m-4">
      <div className="w-[82%] h-screen border rounded-2xl  ">
        <div className="w-full h-fit flex justify-between p-4 text-start text-2xl font-bold tracking-wide">
          <h1 className=" w-full ">Licence key</h1>
          <h1 className=" w-full border-x-2 border-purple-300/70 pl-3">
            Username
          </h1>
          <h1 className="w-full border-r-2 border-purple-300/70 pl-3">Status</h1>
          <h1 className="w-full pl-3">Mode</h1>
        </div>
        <LicenseRow/>
      </div>
    </div>
  );
}
