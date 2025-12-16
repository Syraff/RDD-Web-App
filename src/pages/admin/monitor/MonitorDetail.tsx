import SummaryDetail from "./section/SummaryDetail";
import SessionInformation from "./section/SessionInformation";
import DamageClassification from "./section/DamageClassification";
import DetectionLog from "./section/DetectionLog";

export default function MonitorDetail() {
  return (
    <>
      <div className="grid grid-cols-7 gap-5">
        <div className="col-span-5">
          {/* Summary */}
          <SummaryDetail />
          <div className="border border-primary rounded-lg shadow-lg mt-5">
            <div className="px-6 py-3 rounded-t-lg font-semibold border-b border-b-primary/50">
              Detection Result
            </div>
            <div className="p-3">
              <img
                src="https://res.cloudinary.com/dumgfj4nh/image/upload/fl_preserve_transparency/v1765804367/rdd-predict/uh27hxq9ffnzdnngaywh.jpg?_s=public-apps"
                alt=""
                className="aspect-video w-full rounded-lg"
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          {/* Session Information */}
          <SessionInformation />
          {/* Damage Classification */}
          <DamageClassification />
          {/* Detection Log */}
          <DetectionLog />
        </div>
      </div>
    </>
  );
}
