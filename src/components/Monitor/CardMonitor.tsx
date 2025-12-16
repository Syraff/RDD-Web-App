import { Link } from "react-router";
import { Separator } from "../ui/separator";

export default function CardMonitor({ index }: { index: number }) {
  return (
    <>
      <Link to={index === 0 ? "/monitor/" + index : "#"}>
        <div
          className={`p-2 rounded-2xl relative  ${
            index > 0
              ? "bg-gray-100"
              : "bg-white border border-primary hover:scale-102 transition"
          }`}
        >
          {/* status */}
          <div className="relative">
            <div
              className={`flex gap-x-1 items-center absolute px-2 py-1 rounded-full top-2 left-2 border z-99 ${
                index > 0
                  ? "bg-red-100 border-red-600 text-red-600"
                  : "bg-green-100 border-green-600 text-green-600"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full  ${
                  index > 0 ? "bg-red-600" : "bg-green-600"
                }`}
              ></div>
              <p className="text-[10px] font-medium">
                {index > 0 ? "Offline" : "Online"}
              </p>
            </div>
            <div className="flex gap-x-1 items-center absolute px-2 py-1 bg-yellow-100 border-2 border-yellow-600 rounded-md bottom-2 right-2 ">
              <p className="text-md text-yellow-600 font-bold">
                {index > 0 ? "-" : "50"}{" "}
                <span className="text-xs font-medium">KM/H</span>
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1560336811-fe9526e287fe?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt=""
              className={`aspect-video rounded-lg mb-4 ${
                index > 0 ? "grayscale" : ""
              }`}
            />
          </div>
          <div className="px-2 pb-3">
            <p className="font-normal text-md">
              Device Id: <span className="text-md font-medium">#90721741</span>
            </p>
            <Separator className="my-3  border-[0.5px]" />
            <div className="flex justify-between">
              <p className="font-normal text-xs">
                Location:{" "}
                <span className="text-md font-medium">
                  {index > 0 ? "-" : "-6.1716 | 106.5265"}
                </span>
              </p>
              <p className="font-normal text-xs underline hover:cursor-pointer">
                {index > 0 ? "" : "See location"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}
