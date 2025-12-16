import { AnimatedButton } from "@/components/AnimatedButton";
import { Check } from "lucide-react";
import { PhotoProvider, PhotoView } from "react-photo-view";

export default function DetectionLog() {
  return (
    <div className="border border-primary rounded-lg shadow-lg">
      <div className="px-4 py-3 border-b border-primary/50 rounded-t-lg flex justify-between items-center font-semibold">
        Detection Log
        <AnimatedButton>Clear</AnimatedButton>
      </div>
      <div className="flex flex-col max-h-72 h-full gap-3 px-4 py-5 overflow-scroll">
        {Array(30)
          .fill(null)
          .map((_, index) => (
            <div
              className="flex justify-between items-start p-2 border border-primary rounded-sm"
              key={index}
            >
              <div className="flex items-center gap-x-2">
                <PhotoProvider>
                  <PhotoView
                    src={
                      "https://res.cloudinary.com/dumgfj4nh/image/upload/fl_preserve_transparency/v1765804367/rdd-predict/uh27hxq9ffnzdnngaywh.jpg?_s=public-apps"
                    }
                  >
                    <img
                      src={
                        "https://res.cloudinary.com/dumgfj4nh/image/upload/fl_preserve_transparency/v1765804367/rdd-predict/uh27hxq9ffnzdnngaywh.jpg?_s=public-apps"
                      }
                      alt=""
                      className="w-20 rounded"
                    />
                  </PhotoView>
                </PhotoProvider>
                <div>
                  <p className="font-semibold text-sm ">Longitudinal Crack</p>
                  <div className="flex gap-3">
                    <div className="flex gap-x-1 items-center text-green-700">
                      <Check size={16} />
                      <p className=" text-xs">40.3%</p>
                    </div>
                    <p className="text-xs font-normal">Frame #110</p>
                  </div>
                </div>
              </div>
              <p className="text-sm ">
                20:28:{index < 10 ? `0${index}` : index}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
