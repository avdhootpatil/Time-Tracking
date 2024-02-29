"use client";

import { WithAuthentication } from "@/lib/components/auth";
import Calender from "@/lib/components/calender";

function Timesheet() {
  return (
    <div>
      <Calender />
    </div>
  );
}

export default WithAuthentication(Timesheet);
