export default function SummaryDetail({ data }: any) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="py-4 px-5 border border-primary shadow-lg rounded-md">
        <p className="font-semibold text-3xl">{data.totalDetections | 0}</p>
        <p className="font-light text-sm mb-2">Total Detections</p>
      </div>
      <div className="py-4 px-5 border border-primary shadow-lg rounded-md">
        <p className="font-semibold text-3xl">
          50<span className="text-xs">km/h</span>
        </p>
        <p className="font-light text-sm mb-2">Speed Car</p>
      </div>
      <div className="py-4 px-5 border border-primary shadow-lg rounded-md">
        <p className="font-semibold text-3xl">
          {data.latency}
          <span className="text-xs">ms</span>
        </p>
        <p className="font-light text-sm mb-2">Latency</p>
      </div>
      <div className="py-4 px-5 border border-primary shadow-lg rounded-md">
        <p className="font-semibold text-3xl">
          {data.fps?.toFixed(1)}
          <span className="text-xs">fps</span>
        </p>
        <p className="font-light text-sm mb-2">Processing Rate</p>
      </div>
    </div>
  );
}
