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

export default function DashboardDriver() {
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [devices, setDevices] = useState<any>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

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

    const constraints = {
      video: selectedVideoDevice
        ? {
            deviceId: selectedVideoDevice,
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
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;

        // ⭐ TAMBAHKAN EVENT LISTENERS ⭐
        const handleLoadedMetadata = () => {
          console.log("✅ Video metadata loaded");
          console.log("Dimensions:", video.videoWidth, "x", video.videoHeight);

          // Force play setelah metadata loaded
          video
            .play()
            .then(() => console.log("🎬 Video playing successfully"))
            .catch((err) => console.error("Play error:", err));
        };

        const handleCanPlay = () => {
          console.log("✅ Video can play");
        };

        const handleError = (e: any) => {
          console.error("❌ Video error:", e);
        };

        // Attach events
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("error", handleError);

        // Fallback: jika events tidak trigger
        setTimeout(() => {
          if (video.readyState >= 1) {
            // HAVE_ENOUGH_DATA atau lebih
            video.play().catch((e) => {
              console.log("Auto-play blocked, trying muted...");
              video.muted = true;
              video.play();
            });
          }
        }, 500);

        // Cleanup function
        return () => {
          video.removeEventListener("loadedmetadata", handleLoadedMetadata);
          video.removeEventListener("canplay", handleCanPlay);
          video.removeEventListener("error", handleError);
        };
      }

      console.log("MediaStream active:", mediaStream.active);
      console.log("Video tracks:", mediaStream.getVideoTracks().length);
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
  };

  useEffect(() => {
    getDevices();
  }, []);

  return (
    <>
      <div className="grid grid-cols-7 gap-5">
        <div className="col-span-5">
          <div className="border border-primary rounded-lg shadow-lg">
            <div className="px-6 py-3 rounded-t-lg font-semibold border-b border-b-primary/50">
              Video Input
            </div>
            <div className="p-3 flex justify-center items-center aspect-video">
              {stream ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  //   muted // Mute local preview to avoid feedback loop
                  className={`w-full rounded-lg h-full`}
                />
              ) : (
                <p className="text-xl">No Source</p>
              )}
            </div>
          </div>
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
