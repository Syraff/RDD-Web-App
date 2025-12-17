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
  };

  useEffect(() => {
    getDevices();
  }, []);

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
    const socketUrl =
      import.meta.env.VITE_RUNPOD_URL + "ws/broadcast/FWE-FEAFFDSRG";
    ws.current = new WebSocket(socketUrl);

    ws.current.onopen = () => {
      console.log("WebSocket Connected");
    };

    ws.current.onerror = (error: any) => {
      console.error("WebSocket Error:", error);
    };

    // ws.current.onclose = (event: any) => {
    //   console.log("WebSocket Disconnected", event.code, event.reason);
    //   setConnectionStatus("Disconnected");

    //   // Reconnect setelah 3 detik
    //   setTimeout(() => {
    //     if (connectionStatus !== "Connected") {
    //       console.log("Attempting to reconnect...");
    //       connectWebSocket();
    //     }
    //   }, 3000);
    // };
  };

  // // Buat koneksi socket
  // const socket = io(import.meta.env.VITE_SOCKET_URL, {
  //   transports: ["websocket", "polling"],
  //   // withCredentials: true,
  // });

  // useEffect(() => {
  //   // Event listeners
  //   socket.on("connect", () => {
  //     console.log("Connected:", socket.id);
  //     socket.emit("register", { role: "driver" });
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Disconnected");
  //   });

  //   socket.on("stream_video_backend", (data) => {
  //     toast.success(data.message);
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size sama dengan video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame ke canvas
    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas ke base64
    const base64 = canvas.toDataURL("image/jpeg", 100);

    // socket.emit("stream_video", {
    //   base64,
    //   width: 1000,
    //   height: 1000,
    //   deviceId: "DI-DAFE21",
    //   sessionId: "SSD-FAFEAF31",
    // });
    ws.current.send(base64);
    return base64;
  };

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
