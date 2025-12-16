export default function DamageClassification() {
  return (
    <div className="border border-primary rounded-lg shadow-lg">
      <div className="px-6 py-3 border-b border-primary/50 rounded-t-lg font-semibold">
        Damage Classification
      </div>
      <div className="flex flex-col gap-3 px-6 py-5">
        <div className="flex justify-between items-center p-2 border border-primary rounded-sm">
          <div>
            <p className="font-semibold text-sm ">Longitudinal Crack</p>
            <p className="font-light text-xs">Wheel path crack</p>
          </div>
          <p className="text-xl font-bold mr-2">30</p>
        </div>
        <div className="flex justify-between items-center p-2 border border-primary rounded-sm">
          <div>
            <p className="font-semibold text-sm ">Transverse Crack</p>
            <p className="font-light text-xs">Perpendicular crack</p>
          </div>
          <p className="text-xl font-bold mr-2">10</p>
        </div>
        <div className="flex justify-between items-center p-2 border border-primary rounded-sm">
          <div>
            <p className="font-semibold text-sm ">Aligator Crack</p>
            <p className="font-light text-xs">Fatigue cracking</p>
          </div>
          <p className="text-xl font-bold mr-2">40</p>
        </div>
        <div className="flex justify-between items-center p-2 border border-primary rounded-sm">
          <div>
            <p className="font-semibold text-sm ">Pothole</p>
            <p className="font-light text-xs">Road surface hole</p>
          </div>
          <p className="text-xl font-bold mr-2">230</p>
        </div>
      </div>
    </div>
  );
}
