import { AnimatedButton } from "@/components/AnimatedButton";
import { Check } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";

interface DetectionLogProps {
  data: any;
  setData: Dispatch<SetStateAction<[]>>;
}

export default function DetectionLog({ data, setData }: DetectionLogProps) {
  return (
    <div className="border border-primary rounded-lg shadow-lg">
      <div className="px-4 py-3 border-b border-primary/50 rounded-t-lg flex justify-between items-center font-semibold">
        Detection Log
        <AnimatedButton onClick={() => setData([])}>Clear</AnimatedButton>
      </div>
      <div className="flex flex-col max-h-72 h-full gap-3 px-4 py-5 overflow-scroll">
        {data.map((item: any, index: number) => (
          <div
            className="flex justify-between items-start p-2 border border-primary rounded-sm"
            key={index}
          >
            <div className="flex items-center gap-x-2">
              <PhotoProvider>
                <PhotoView src={item.image}>
                  <img src={item.image} alt="" className="w-20 rounded" />
                </PhotoView>
              </PhotoProvider>
              <div>
                <p className="font-semibold text-sm ">{item.class}</p>
                <div className="flex gap-3">
                  <div className="flex gap-x-1 items-center text-green-700">
                    <Check size={16} />
                    <p className=" text-xs">
                      {((item.confidence / 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <p className="text-xs font-normal">
                    Frame #{item.frame_index}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm ">20:28:{index < 10 ? `0${index}` : index}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
