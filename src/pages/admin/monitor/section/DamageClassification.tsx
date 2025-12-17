export default function DamageClassification({ data }: any) {
  return (
    <div className="border border-primary rounded-lg shadow-lg">
      <div className="px-6 py-3 border-b border-primary/50 rounded-t-lg font-semibold">
        Damage Classification
      </div>
      <div className="flex flex-col gap-3 px-6 py-5">
        {data?.map((item: any, index: number) => (
          <div
            className="flex justify-between items-center p-2 border border-primary rounded-sm"
            key={index}
          >
            <div>
              <p className="font-semibold text-sm ">{item.class}</p>
              <p className="font-light text-xs">{item.desc}</p>
            </div>
            <p className="text-xl font-bold mr-2">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
