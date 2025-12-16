export default function SessionInformation() {
  return (
    <div className="border border-primary rounded-lg shadow-lg">
      <div className="px-6 py-3 border-b border-primary/50 rounded-t-lg font-semibold ">
        Session Info
      </div>
      <div className="grid grid-cols-2 gap-3 px-6 py-5">
        <div className="p-2 border border-primary rounded-sm">
          <p className="font-light text-xs mb-1">Session ID</p>
          <p className="font-semibold text-sm">RDD-MJ7HKC1V</p>
        </div>
        <div className="p-2 border border-primary rounded-sm">
          <p className="font-light text-xs mb-1">Started</p>
          <p className="font-semibold text-sm">20:27:19</p>
        </div>
        <div className="p-2 border border-primary rounded-sm">
          <p className="font-light text-xs mb-1">Duration</p>
          <p className="font-semibold text-sm">00:00:41</p>
        </div>
        <div className="p-2 border border-primary rounded-sm">
          <p className="font-light text-xs mb-1">Date</p>
          <p className="font-semibold text-sm">14 December 2025</p>
        </div>
      </div>
    </div>
  );
}
