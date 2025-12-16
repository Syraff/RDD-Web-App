import CardMonitor from "@/components/Monitor/CardMonitor";

export default function MonitorPage() {
  return (
    <>
      <div>
        <p className="text-2xl font-semibold mb-5">Dashboard</p>
        <div className="grid grid-cols-4 gap-5">
          {Array(3)
            .fill(null)
            .map((_, index) => (
              <CardMonitor index={index} key={index} />
            ))}
        </div>
      </div>
    </>
  );
}
