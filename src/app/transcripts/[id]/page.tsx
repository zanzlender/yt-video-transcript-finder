import React from "react";

type AcceptedSearchParams = "start" | "duration" | "lineId";

type Props = {
  searchParams: Record<AcceptedSearchParams, string>;
};

const Transcript = ({ searchParams }: Props) => {
  console.log("SEARCH PARAMS: ", searchParams);

  const startParam = searchParams.start;
  const durationParam = searchParams.duration;
  const lineIdParam = searchParams.lineId;

  return (
    <div className="mx-auto mt-32 flex w-full max-w-7xl gap-6">
      <div className="h-[300px] w-full max-w-[500px] bg-white"></div>

      <div className="w-full">
        <h2 className="mb-5 text-3xl text-white">Youtube title 123</h2>

        <p className="mb-2 text-white">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus,
          dolorum hic odio officiis sit est asperiores at facere incidunt dicta
          modi nisi blanditiis eos sapiente sunt voluptate maxime dolores qui?
        </p>
        <p className="mb-2 text-white">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus,
          dolorum hic odio officiis sit est asperiores at facere incidunt dicta
          modi nisi blanditiis eos sapiente sunt voluptate maxime dolores qui?
        </p>
        <p className="mb-2 text-white">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus,
          dolorum hic odio officiis sit est asperiores at facere incidunt dicta
          modi nisi blanditiis eos sapiente sunt voluptate maxime dolores qui?
        </p>
        <p className="mb-2 text-white">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus,
          dolorum hic odio officiis sit est asperiores at facere incidunt dicta
          modi nisi blanditiis eos sapiente sunt voluptate maxime dolores qui?
        </p>
        <p className="mb-2 text-white">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus,
          dolorum hic odio officiis sit est asperiores at facere incidunt dicta
          modi nisi blanditiis eos sapiente sunt voluptate maxime dolores qui?
        </p>
      </div>
    </div>
  );
};

export default Transcript;
