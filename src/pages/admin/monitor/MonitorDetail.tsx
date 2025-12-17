import SummaryDetail from "./section/SummaryDetail";
import SessionInformation from "./section/SessionInformation";
import DamageClassification from "./section/DamageClassification";
import DetectionLog from "./section/DetectionLog";
import { useEffect, useRef, useState } from "react";

export default function MonitorDetail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [detectionsLog, setDetectionsLog] = useState<any>([]);
  const [classCount] = useState<any>([
    {
      class: "Alligator Crack",
      desc: "Fatigue cracking",
      count: 0,
    },
    {
      class: "Longitudinal Crack",
      desc: "Wheel path crack",
      count: 0,
    },
    { class: "Transverse Crack", desc: "Perpendicular crack", count: 0 },
    { class: "Potholes", desc: "Road surface hole", count: 0 },
  ]);
  const [summary, setSummary] = useState<any>({
    totalDetections: 0,
    latency: 0,
    fps: 0,
  });
  let fpsTimestamps = [];

  const ws = useRef<any>(null);

  useEffect(() => {
    // Inisialisasi WebSocket connection
    connectWebSocket();

    // Cleanup pada unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const connectWebSocket = () => {
    const socketUrl = import.meta.env.VITE_RUNPOD_URL + "ws/watch/1";
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.current.onerror = (error: any) => {
      console.error("WebSocket Error:", error);
    };

    ws.current.onmessage = (event: any) => {
      // const data = JSON.stringify(event)
      const data = JSON.parse(event.data);
      const canvas = canvasRef.current;

      if (!canvas) return;

      const ctx = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });

      const img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;

        if (ctx) ctx.drawImage(img, 0, 0, img.width, img.height);
      };
      img.onerror = function () {
        console.error("Gagal memuat gambar");
      };
      img.src = data.processed_frame;

      setSummary((prev: any) => {
        return {
          ...prev, // Salin semua properti sebelumnya
          latency: data.latency_ms,
        };
      });

      if (data.detections && data.detections.length > 0) {
        for (const x of data.detections) {
          for (const y of classCount) {
            if (y.class === x.class) {
              y.count += 1;
            }
          }
          x.image = data.processed_frame;
          x.frame_index = data.frame_index;
          setDetectionsLog((prev: any) => {
            return [...prev, x];
          });
        }

        setSummary((prev: any) => {
          return {
            ...prev, // Salin semua properti sebelumnya
            totalDetections: prev.totalDetections + data.detections.length,
          };
        });
      }

      const now = Date.now();
      fpsTimestamps.push(now);
      while (fpsTimestamps.length > 0 && now - fpsTimestamps[0] > 2000) {
        fpsTimestamps.shift();
      }
      if (fpsTimestamps.length > 1) {
        const fps =
          (fpsTimestamps.length - 1) / ((now - fpsTimestamps[0]) / 1000);
        setSummary((prev: any) => {
          return {
            ...prev, // Salin semua properti sebelumnya
            fps,
          };
        });
      }
    };
  };

  return (
    <>
      <div className="grid grid-cols-7 gap-5">
        <div className="col-span-5">
          {/* Summary */}
          <SummaryDetail data={summary} />
          <div className="border border-primary rounded-lg shadow-lg mt-5">
            <div className="px-6 py-3 rounded-t-lg font-semibold border-b border-b-primary/50">
              Detection Result
            </div>
            <div className="p-3">
              {/* Tempat hasil video predict */}
              <canvas
                ref={canvasRef}
                className="aspect-video w-full rounded-lg object-contain"
              />
              <img src="" alt="" className="hidden" />
              {/* <img
                src="https://res.cloudinary.com/dumgfj4nh/image/upload/fl_preserve_transparency/v1765804367/rdd-predict/uh27hxq9ffnzdnngaywh.jpg?_s=public-apps"
                alt=""
                className="aspect-video w-full rounded-lg"
              /> */}
            </div>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          {/* Session Information */}
          <SessionInformation />
          {/* Damage Classification */}
          <DamageClassification data={classCount} />
          {/* Detection Log */}
          <DetectionLog data={detectionsLog} setData={setDetectionsLog} />
        </div>
      </div>
    </>
  );
}
