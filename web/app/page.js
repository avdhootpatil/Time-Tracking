// import styles from "./page.module.css";
"use client";

import { WithAuthentication } from "@/lib/components/auth";

function Timesheet() {
  return (
    <main>
      <div>Timesheet App</div>
    </main>
  );
}

export default WithAuthentication(Timesheet);
