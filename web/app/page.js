"use client";

import { WithAuthentication } from "@/lib/components/auth";
import Calender from "@/lib/components/calender";

function Timesheet() {
  return (
    <main>
      <Calender />
    </main>
  );
}

export default WithAuthentication(Timesheet);
