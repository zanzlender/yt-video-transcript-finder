import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="m-auto flex flex-col items-center justify-center gap-4">
      <h2 className="text-center text-4xl text-white">404 Not Found</h2>
      <p className="text-white">Could not find requested resource</p>
      <Link className="text-xl text-white" href="/">
        Return Home
      </Link>
    </div>
  );
}
