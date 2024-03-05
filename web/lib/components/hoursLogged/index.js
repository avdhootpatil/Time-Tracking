"use client";

import { hoursChipType } from "@/lib/helperFunctions";
import { useEffect, useState } from "react";

export default function HoursLogged({ hours = 0 }) {
  const [bgColour, setBgColour] = useState("blue");

  useEffect(() => {
    if (hours === 0) {
      setBgColour(hoursChipType(hours));
    }
  }, [hours]);

  return (
    <span className="inline-flex items-center bg-blue-250 py-1 my-2 text-xs font-medium text-gray-600 ">
      <span
        className={`font-bold px-2 py-1 border border-solid rounded-lg  bg-${bgColour}-200`}
      >
        {hours}
      </span>
    </span>
  );
}
