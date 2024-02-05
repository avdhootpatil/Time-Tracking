import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <>
      <Link href="/pages/projects">Projects Page</Link>
      <br />
      <Link href="/pages/calendar">Calendar page</Link>
      <br />
      <Link href="/pages/login">Login Page</Link>
      <br />
      <Link href="/pages/registration">Registration page</Link>
    </>
  );
};

export default Home;
