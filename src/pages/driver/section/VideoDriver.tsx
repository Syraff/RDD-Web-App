import type { RefObject } from "react";

type videoRefProps = {
  videoRef: RefObject<HTMLVideoElement> | null;
  canvasRef: RefObject<HTMLCanvasElement> | null;
  stream: MediaStream | null;
  error: string | null;
};
export default function VideoDriver({
  videoRef,
  canvasRef,
  stream,
  error,
}: videoRefProps) {
  return (
    <>
      <div className="border border-primary rounded-lg shadow-lg">
        <div className="px-6 py-3 rounded-t-lg font-semibold border-b border-b-primary/50">
          Video Input
        </div>
        <div className="p-3 flex justify-center items-center aspect-video rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            //   muted // Mute local preview to avoid feedback loop
            className={`w-full rounded-lg h-full ${!stream && "hidden"}`}
          />
          <canvas ref={canvasRef} className="hidden"></canvas>
          {!stream && <p className="text-xl">{error || "No Source"}</p>}
        </div>
      </div>
    </>
  );
}
