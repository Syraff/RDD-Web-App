import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import SessionInformation from "../admin/monitor/section/SessionInformation";
import { Pause, Play } from "lucide-react";
import { IconCheckbox } from "@tabler/icons-react";
import VideoDriver from "./section/VideoDriver";

export default function DashboardDriver() {
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [devices, setDevices] = useState<any>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getDevices = useCallback(async () => {
    try {
      // Meminta izin awal untuk mendapatkan label perangkat
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      setDevices(deviceInfos);

      // Set default devices jika belum ada
      const videoDevs = deviceInfos.filter((d) => d.kind === "videoinput");

      if (videoDevs.length > 0 && !selectedVideoDevice)
        setSelectedVideoDevice(videoDevs[0].deviceId);

      // Matikan stream sementara yang hanya digunakan untuk izin
      // (Opsional, tergantung UX yang diinginkan, di sini kita biarkan user menekan 'Mulai')
    } catch (err) {
      console.warn(
        "Izin mungkin belum diberikan atau perangkat tidak ditemukan",
        err
      );
      // Tetap lanjutkan agar user bisa mencoba lagi lewat tombol
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      setDevices(deviceInfos);
    }
  }, [selectedVideoDevice]);

  const startStream = async () => {
    stopStream(); // Hentikan stream sebelumnya jika ada
    setError(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    const constraints = {
      video: selectedVideoDevice
        ? {
            deviceId: { exact: selectedVideoDevice },
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            frameRate: { ideal: 30 },
          }
        : {
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
      }
      intervalRef.current = setInterval(captureFrame, 50);
    } catch (err: any) {
      setError(`Gagal mengakses kamera/mikrofon: ${err.message}`);
    }
  };

  const ws = useRef<any>(null);

  // Menghentikan Stream
  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (ws) ws.current.close();
  };

  useEffect(() => {
    getDevices();
  }, []);

  useEffect(() => {
    // Inisialisasi WebSocket connection
    connectWebSocket();

    // Cleanup pada unmount
    return () => {
      disconnectWebSocket();
    };
  }, []);
  const disconnectWebSocket = () => {
    if (ws.current) {
      const state = ws.current.readyState;
      if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
        ws.current.close(1000, "Manual disconnect");
      }
      ws.current = null;
    }
  };

  const connectWebSocket = () => {
    disconnectWebSocket();

    const socketUrl = import.meta.env.VITE_RUNPOD_URL + "ws/broadcast/3";

    try {
      ws.current = new WebSocket(socketUrl);

      const connectionTimeout = setTimeout(() => {
        if (ws.current?.readyState === WebSocket.CONNECTING) {
          console.error("❌ WebSocket connection timeout");
          ws.current.close(4000, "Connection timeout");
        }
      }, 10000);

      ws.current.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("✅ WebSocket Connected");
      };

      ws.current.onerror = (error: any) => {
        clearTimeout(connectionTimeout);
        console.error("❌ WebSocket Error:", error);
      };

      ws.current.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          console.log("📨 Received from server:", data);
        } catch (error) {
          console.log("Raw message from server:", event.data);
        }
      };

      ws.current.onclose = (event: CloseEvent) => {
        clearTimeout(connectionTimeout);
        console.log("🔌 WebSocket closed:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });

        // Auto reconnect jika bukan normal closure
        if (event.code !== 1000) {
          console.log("🔄 Will attempt reconnect in 3 seconds...");
          setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
    }
  };

  // Ubah captureFrame untuk langsung mengirim ke WebSocket
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Cek jika video sudah ready
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    // Set canvas size sama dengan video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame ke canvas
    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas ke base64
    const base64 = canvas.toDataURL("image/jpeg", 0.8);

    // Kirim ke WebSocket jika sudah connected
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(base64); // Langsung kirim base64 string
      } catch (error) {
        console.error("Failed to send frame to WebSocket:", error);
      }
    }
  };

  // Di startStream, tetap panggil interval:
  intervalRef.current = setInterval(captureFrame, 50);

  // Di stopStream, hapus baris ini:
  // if (ws) ws.current.close();
  return (
    <>
      <div className="grid grid-cols-7 gap-5">
        <div className="col-span-5">
          <VideoDriver
            canvasRef={canvasRef as RefObject<HTMLCanvasElement>}
            videoRef={videoRef as RefObject<HTMLVideoElement>}
            stream={stream}
            error={error}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="py-4 px-5 border border-primary shadow-lg rounded-md">
              <p className="font-semibold text-3xl">
                50<span className="text-xs">km/h</span>
              </p>
              <p className="font-light text-sm mb-2">Speed Car</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => startStream()}
                disabled={stream ? true : false}
                className={`w-full h-[50%] flex gap-x-2 items-center justify-center border rounded-md shadow-lg ${
                  stream
                    ? "border border-primary"
                    : "border-green-700 text-green-700 bg-green-100 "
                }`}
              >
                <Play size={20} /> Start
              </button>
              <button
                onClick={() => stopStream()}
                disabled={stream ? false : true}
                className={`w-full h-[50%] flex gap-x-2 items-center justify-center border rounded-md shadow-lg ${
                  !stream
                    ? "border border-primary"
                    : "border-red-700 text-red-700 bg-red-100 "
                }`}
              >
                <Pause size={20} /> Stop
              </button>
            </div>
          </div>
          {/* Session Information */}
          <SessionInformation />
          <div className="border border-primary rounded-lg shadow-lg">
            <div className="px-6 py-3 border-b border-primary/50 rounded-t-lg font-semibold">
              Video Source
            </div>
            <div className="flex flex-col gap-3 px-3 py-5">
              {devices
                .filter((d: any) => d.kind === "videoinput")
                .map((device: any) => (
                  <div
                    className={`flex justify-between items-center p-2 rounded-sm hover:cursor-pointer ${
                      device.deviceId === selectedVideoDevice
                        ? "border border-blue-600 bg-blue-100 text-blue-600"
                        : "border border-primary"
                    }`}
                    key={device.deviceId}
                    onClick={() => {
                      setSelectedVideoDevice(device.deviceId), stopStream();
                    }}
                  >
                    {device.label}
                    {device.deviceId === selectedVideoDevice && (
                      <IconCheckbox />
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
