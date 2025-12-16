import { AdvancedVideo } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";

import InputFile from "@/components/input/InputFile";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ChevronLeft, CircleAlert, CircleCheck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { Spinner } from "@/components/ui/spinner";

export default function ToolsPage() {
  const navigate = useNavigate();
  const [predict, setPredict] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoadig] = useState<boolean>(false);

  const handlePredict = async () => {
    try {
      setIsLoadig(true);
      const formData = new FormData();

      if (file) formData.append("file", file);

      // const { data: res } = await axios.post(
      //   "https://rdd-basic.zeabur.app/predict",
      //   formData
      // );
      const { data: res } = await axios.post(
        import.meta.env.VITE_RUNPOD_ID + "predict",
        formData
        // {
        //   headers: {
        //     Authorization: `Bearer ${import.meta.env.VITE_RUNPOD_API_KEY}`,
        //   },
        // }
      );

      res.countCrack = [
        {
          level: "Alligator Crack",
          count: 0,
        },
        {
          level: "Longitudinal Crack",
          count: 0,
        },
        { level: "Transverse Crack", count: 0 },
        { level: "Potholes", count: 0 },
      ];

      if (res.metadata.type === "image") {
        for (const x of res.countCrack) {
          x.count = res.data.filter((i: any) => i.class === x.level).length;
        }
      } else {
        for (const x of res.countCrack) {
          for (const y of res.data) {
            for (const z of y.detections) {
              if (z.class === x.level) x.count += 1;
            }
          }
        }
      }

      setPredict(res);

      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadig(false);
    }
  };

  const CloudinaryReactPlayer = ({ publicId }: any) => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: import.meta.env.VITE_CLOUD_NAME,
      },
    });

    const myVideo = cld.video(publicId);

    return (
      <AdvancedVideo
        cldVid={myVideo}
        controls
        className="w-full aspect-video"
        // onError={(e) => {
        //   console.error("Cloudinary React player error:", e);
        //   // Fallback ke iframe
        //   const iframeUrl = `https://player.cloudinary.com/embed/?cloud_name=${
        //     import.meta.env.VITE_CLOUD_NAME
        //   }&public_id=${publicId}`;

        //   window.open(iframeUrl, "_blank");
        // }}
      />
    );
  };

  return (
    <>
      {!predict ? (
        <p className="text-3xl font-bold text-[#071123] mb-2">
          Lets Check Your Road 👋🏻
        </p>
      ) : (
        <div
          className="flex items-center gap-x-4 mb-2 font-semibold hover:cursor-pointer"
          onClick={() => {
            navigate("/demo"), setPredict({});
          }}
        >
          <ChevronLeft size={24} />
          <p className="text-xl">Upload Again 🫨</p>
        </div>
      )}
      <div className="grid grid-cols-5 gap-8">
        {!predict ? (
          <div className="col-span-3 ">
            <InputFile val={file} setValue={setFile} disabled={isLoading} />
            <Button
              className="w-full py-5 mt-5 font-bold text-md"
              disabled={file && !isLoading ? false : true}
              onClick={() => handlePredict()}
            >
              {isLoading ? (
                <div className="flex gap-x-3 items-center">
                  <Spinner /> Predict Process...
                </div>
              ) : (
                "Predict"
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="col-span-3">
              {predict && predict.metadata.type === "image" ? (
                <img src={predict.cloudinary_url} />
              ) : (
                <CloudinaryReactPlayer
                  publicId={predict.cloudinary_public_id}
                />
                // <iframe
                //   src={`https://player.cloudinary.com/embed/?cloud_name=${
                //     import.meta.env.VITE_CLOUD_NAME
                //   }&public_id=${predict.cloudinary_public_id}&profile=${
                //     import.meta.env.VITE_CLOUD_PROFILE
                //   }`}
                //   className="aspect-video w-full"
                //   allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                //   allowFullScreen
                // ></iframe>
              )}
            </div>
            <div className="col-span-2 flex flex-col gap-3">
              <div
                className={`w-full flex gap-x-3 items-center py-3 px-5 mb-3 rounded-sm ${
                  predict.data.length > 0
                    ? "bg-red-100 border border-red-700 text-red-700"
                    : "bg-green-100 text-green-700 border border-green-700"
                }`}
              >
                {predict.data.length > 0 ? (
                  <CircleAlert size={24} />
                ) : (
                  <CircleCheck size={24} />
                )}
                <p className="text-md">{predict.data_summary}</p>
              </div>
              {predict.countCrack.map((x: any, i: any) => (
                <div
                  className={`px-5 py-3 bg-white border rounded-sm ${
                    (x.count / predict.data.length) * 100 > 70
                      ? "border-red-700 "
                      : (x.count / predict.data.length) * 100 > 40
                      ? "border-orange-700 "
                      : x.count > 0
                      ? "border-yellow-700 "
                      : "border-green-700"
                  }`}
                  key={i}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="">{x.level}</p>
                    <p
                      className={`px-3 py-1 rounded-full text-sm ${
                        (x.count / predict.data.length) * 100 > 70
                          ? "bg-red-100 border border-red-700 text-red-700"
                          : (x.count / predict.data.length) * 100 > 40
                          ? "bg-orange-100 border border-orange-700 text-orange-700"
                          : x.count > 0
                          ? "bg-yellow-100 border border-yellow-700 text-yellow-700"
                          : "bg-green-100 text-green-700 border border-green-700"
                      }`}
                    >
                      {(x.count / predict.data.length) * 100 > 70
                        ? "Critical"
                        : (x.count / predict.data.length) * 100 > 40
                        ? "Warning"
                        : x.count > 0
                        ? "Moderate"
                        : "Good"}
                    </p>
                  </div>
                  <p className="text-2xl">{x.count}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {predict && predict.video && (
        <div className="grid grid-cols-5 gap-5">
          {predict.data.map((x: any, i: number) => {
            const classCounts = x.detections.reduce(
              (acc: any, detection: any) => {
                acc[detection.class] = (acc[detection.class] || 0) + 1;
                return acc;
              },
              {}
            );

            // Dapatkan unique classes
            const uniqueClasses = Object.keys(classCounts);
            return (
              <div
                className="p-3 py-4 border border-[#071123] rounded-sm"
                key={i}
              >
                <div className="mb-3">
                  <PhotoProvider>
                    <PhotoView src={x.frame_url}>
                      <img src={x.frame_url} alt="" />
                    </PhotoView>
                  </PhotoProvider>
                </div>
                {uniqueClasses.map((className: string, index: number) => (
                  <p key={index} className="text-sm">
                    {className}: {classCounts[className]} box.
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// {
//     "status": "success",
//     "file_url": "/static/a6cfb3d6-7d1c-4162-948d-18dffb3f04bb_processed.mp4",
//     "s3_url": "https://pub-0ccce103f38e4902912534cdb3973783.r2.dev/a6cfb3d6-7d1c-4162-948d-18dffb3f04bb_processed.mp4",
//     "filename": "a6cfb3d6-7d1c-4162-948d-18dffb3f04bb_processed.mp4",
//     "metadata": {
//         "width": 898,
//         "height": 502,
//         "fps": 27.124867746820737,
//         "total_frames": 523
//     },
//     "data_summary": "Found 237 frames/items with detections",
//     "data": [
//         {
//             "frame": 0,
//             "timestamp": 0,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.44037628173828125,
//                     "bbox": [
//                         146.88087463378906,
//                         2.086360454559326,
//                         508.3465270996094,
//                         444.49713134765625
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4335591495037079,
//                     "bbox": [
//                         159.68727111816406,
//                         7.659936904907227,
//                         319.71673583984375,
//                         440.41558837890625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 1,
//             "timestamp": 0.036866539196940724,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.445529043674469,
//                     "bbox": [
//                         146.77955627441406,
//                         1.9862474203109741,
//                         509.9250183105469,
//                         444.7187805175781
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4351404905319214,
//                     "bbox": [
//                         159.63267517089844,
//                         7.518502712249756,
//                         319.96417236328125,
//                         440.4972229003906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 2,
//             "timestamp": 0.07373307839388145,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.44571179151535034,
//                     "bbox": [
//                         146.7825927734375,
//                         1.9789252281188965,
//                         509.9479675292969,
//                         444.67333984375
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.43520647287368774,
//                     "bbox": [
//                         159.63543701171875,
//                         7.507112503051758,
//                         319.97393798828125,
//                         440.4474792480469
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 3,
//             "timestamp": 0.11059961759082218,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.44583606719970703,
//                     "bbox": [
//                         146.783447265625,
//                         1.9689053297042847,
//                         509.9706726074219,
//                         444.5885009765625
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4351702332496643,
//                     "bbox": [
//                         159.6377716064453,
//                         7.491440296173096,
//                         319.97369384765625,
//                         440.3425598144531
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 4,
//             "timestamp": 0.1474661567877629,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4459465742111206,
//                     "bbox": [
//                         146.81082153320312,
//                         1.959442138671875,
//                         509.8907775878906,
//                         444.4407958984375
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4351840615272522,
//                     "bbox": [
//                         159.6480255126953,
//                         7.472085952758789,
//                         319.9773254394531,
//                         440.1696472167969
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 5,
//             "timestamp": 0.18433269598470364,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4459015727043152,
//                     "bbox": [
//                         146.81591796875,
//                         1.963167428970337,
//                         509.84521484375,
//                         444.4461669921875
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.43520790338516235,
//                     "bbox": [
//                         159.6515655517578,
//                         7.475596904754639,
//                         319.9740905761719,
//                         440.1768493652344
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 6,
//             "timestamp": 0.22119923518164436,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4458915591239929,
//                     "bbox": [
//                         146.8236541748047,
//                         1.9624395370483398,
//                         509.8186950683594,
//                         444.4148864746094
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4351942539215088,
//                     "bbox": [
//                         159.652587890625,
//                         7.4741411209106445,
//                         319.9734191894531,
//                         440.1468811035156
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 7,
//             "timestamp": 0.2580657743785851,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4459150731563568,
//                     "bbox": [
//                         146.82374572753906,
//                         1.9603841304779053,
//                         509.7857666015625,
//                         444.3725280761719
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4351983666419983,
//                     "bbox": [
//                         159.64813232421875,
//                         7.469259738922119,
//                         319.9770812988281,
//                         440.0989074707031
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 8,
//             "timestamp": 0.2949323135755258,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4458979070186615,
//                     "bbox": [
//                         146.82208251953125,
//                         1.961240530014038,
//                         509.79144287109375,
//                         444.3899230957031
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.43518736958503723,
//                     "bbox": [
//                         159.64695739746094,
//                         7.471486568450928,
//                         319.9764709472656,
//                         440.12054443359375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 9,
//             "timestamp": 0.33179885277246657,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4458979070186615,
//                     "bbox": [
//                         146.82208251953125,
//                         1.961240530014038,
//                         509.79144287109375,
//                         444.3899230957031
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.43518736958503723,
//                     "bbox": [
//                         159.64695739746094,
//                         7.471486568450928,
//                         319.9764709472656,
//                         440.12054443359375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 10,
//             "timestamp": 0.3686653919694073,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.5003727674484253,
//                     "bbox": [
//                         158.74081420898438,
//                         19.36576271057129,
//                         296.0825500488281,
//                         458.8177490234375
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.26085036993026733,
//                     "bbox": [
//                         140.29000854492188,
//                         10.68384075164795,
//                         420.3751525878906,
//                         454.5810241699219
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 11,
//             "timestamp": 0.405531931166348,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.5011576414108276,
//                     "bbox": [
//                         158.56698608398438,
//                         19.415433883666992,
//                         295.9757995605469,
//                         458.8658142089844
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.26102396845817566,
//                     "bbox": [
//                         140.25987243652344,
//                         10.734025955200195,
//                         420.9205017089844,
//                         454.652587890625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 12,
//             "timestamp": 0.4423984703632887,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.5168986320495605,
//                     "bbox": [
//                         137.80673217773438,
//                         28.744321823120117,
//                         293.6346740722656,
//                         455.0788879394531
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.2752825617790222,
//                     "bbox": [
//                         122.11463165283203,
//                         7.444381237030029,
//                         336.2945861816406,
//                         442.0863342285156
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 13,
//             "timestamp": 0.47926500956022944,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.5905270576477051,
//                     "bbox": [
//                         129.02769470214844,
//                         47.24246597290039,
//                         285.0163269042969,
//                         456.4900817871094
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 14,
//             "timestamp": 0.5161315487571702,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4675067365169525,
//                     "bbox": [
//                         106.16255950927734,
//                         52.16094207763672,
//                         283.1763610839844,
//                         459.8680419921875
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.3946879506111145,
//                     "bbox": [
//                         406.7566223144531,
//                         295.7724914550781,
//                         493.8147888183594,
//                         439.0685119628906
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.33531704545021057,
//                     "bbox": [
//                         88.94912719726562,
//                         24.841623306274414,
//                         374.0979309082031,
//                         454.407958984375
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.30802759528160095,
//                     "bbox": [
//                         58.80535888671875,
//                         20.576112747192383,
//                         552.2539672851562,
//                         454.8499755859375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 15,
//             "timestamp": 0.5529980879541109,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.6762422919273376,
//                     "bbox": [
//                         76.45890045166016,
//                         58.805660247802734,
//                         287.11297607421875,
//                         462.83355712890625
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.2832295596599579,
//                     "bbox": [
//                         293.9988708496094,
//                         20.315723419189453,
//                         872.3453369140625,
//                         452.388427734375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 16,
//             "timestamp": 0.5898646271510516,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.5185047388076782,
//                     "bbox": [
//                         104.26448059082031,
//                         84.96331024169922,
//                         281.96588134765625,
//                         469.02984619140625
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3694416880607605,
//                     "bbox": [
//                         339.5263671875,
//                         31.019947052001953,
//                         763.0654296875,
//                         449.0359802246094
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3202434778213501,
//                     "bbox": [
//                         69.62448120117188,
//                         30.881553649902344,
//                         292.192138671875,
//                         467.0225830078125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 17,
//             "timestamp": 0.6267311663479923,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.5224401354789734,
//                     "bbox": [
//                         103.43936920166016,
//                         84.58983612060547,
//                         282.5369873046875,
//                         469.0555114746094
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3573009669780731,
//                     "bbox": [
//                         333.72882080078125,
//                         31.31386375427246,
//                         754.7224731445312,
//                         452.14776611328125
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.332575261592865,
//                     "bbox": [
//                         69.19296264648438,
//                         30.03470230102539,
//                         292.8744201660156,
//                         467.1711730957031
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 18,
//             "timestamp": 0.6635977055449331,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4302823841571808,
//                     "bbox": [
//                         349.3522033691406,
//                         83.31598663330078,
//                         854.6307983398438,
//                         454.34454345703125
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.28284186124801636,
//                     "bbox": [
//                         373.92742919921875,
//                         79.90965270996094,
//                         823.0344848632812,
//                         437.76629638671875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 19,
//             "timestamp": 0.7004642447418739,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.43605607748031616,
//                     "bbox": [
//                         349.4049987792969,
//                         83.12059783935547,
//                         854.0043334960938,
//                         454.2618408203125
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.2819094955921173,
//                     "bbox": [
//                         373.5291748046875,
//                         79.85086059570312,
//                         822.8626098632812,
//                         437.6773986816406
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 20,
//             "timestamp": 0.7373307839388146,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.2553882896900177,
//                     "bbox": [
//                         116.7776107788086,
//                         117.44158172607422,
//                         728.321044921875,
//                         464.3507995605469
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 21,
//             "timestamp": 0.7741973231357553,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.5970107913017273,
//                     "bbox": [
//                         66.49832916259766,
//                         227.8489532470703,
//                         333.8040771484375,
//                         460.1199951171875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 22,
//             "timestamp": 0.811063862332696,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.397953599691391,
//                     "bbox": [
//                         106.50465393066406,
//                         277.0108947753906,
//                         226.2703399658203,
//                         462.8879699707031
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 23,
//             "timestamp": 0.8479304015296367,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.4340667426586151,
//                     "bbox": [
//                         439.1809997558594,
//                         275.6421203613281,
//                         546.4075317382812,
//                         450.674072265625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 24,
//             "timestamp": 0.8847969407265774,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.5570783019065857,
//                     "bbox": [
//                         455.5532531738281,
//                         315.3701171875,
//                         531.6337280273438,
//                         459.90252685546875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 25,
//             "timestamp": 0.9216634799235182,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.559502899646759,
//                     "bbox": [
//                         455.5138854980469,
//                         315.6650085449219,
//                         531.6552734375,
//                         460.05242919921875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 26,
//             "timestamp": 0.9585300191204589,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6222174763679504,
//                     "bbox": [
//                         307.2071533203125,
//                         3.454838752746582,
//                         378.69793701171875,
//                         44.73247528076172
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 27,
//             "timestamp": 0.9953965583173996,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6118579506874084,
//                     "bbox": [
//                         303.4473571777344,
//                         14.230566024780273,
//                         380.87109375,
//                         58.59749984741211
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.34226831793785095,
//                     "bbox": [
//                         129.77099609375,
//                         221.49009704589844,
//                         215.2455291748047,
//                         469.5316467285156
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 28,
//             "timestamp": 1.0322630975143403,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.51238614320755,
//                     "bbox": [
//                         299.59625244140625,
//                         27.37114906311035,
//                         384.08795166015625,
//                         79.87619018554688
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.4569859504699707,
//                     "bbox": [
//                         136.23214721679688,
//                         263.01171875,
//                         202.03907775878906,
//                         446.362060546875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 29,
//             "timestamp": 1.069129636711281,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2569306492805481,
//                     "bbox": [
//                         290.40447998046875,
//                         39.78925323486328,
//                         386.5666809082031,
//                         99.61778259277344
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 30,
//             "timestamp": 1.1059961759082217,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.630148708820343,
//                     "bbox": [
//                         289.2616271972656,
//                         60.501136779785156,
//                         386.484375,
//                         120.63725280761719
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6181719303131104,
//                     "bbox": [
//                         250.5683135986328,
//                         24.338973999023438,
//                         316.57171630859375,
//                         63.06597900390625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.44347330927848816,
//                     "bbox": [
//                         562.6306762695312,
//                         0,
//                         662.8965454101562,
//                         32.447731018066406
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 31,
//             "timestamp": 1.1428627151051625,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6407886743545532,
//                     "bbox": [
//                         565.3836059570312,
//                         3.6255245208740234,
//                         679.9700317382812,
//                         46.52688217163086
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4818904995918274,
//                     "bbox": [
//                         243.5091552734375,
//                         39.42819595336914,
//                         314.0434265136719,
//                         78.5423355102539
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3869296908378601,
//                     "bbox": [
//                         283.7889709472656,
//                         79.51200866699219,
//                         385.84130859375,
//                         148.6088409423828
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 32,
//             "timestamp": 1.1797292543021032,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7018226385116577,
//                     "bbox": [
//                         582.23291015625,
//                         19.26346778869629,
//                         702.917724609375,
//                         69.00092315673828
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5803171992301941,
//                     "bbox": [
//                         280.3233642578125,
//                         101.81509399414062,
//                         389.0630798339844,
//                         177.87054443359375
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3724610507488251,
//                     "bbox": [
//                         235.19960021972656,
//                         57.21527099609375,
//                         311.0155334472656,
//                         98.36259460449219
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 33,
//             "timestamp": 1.216595793499044,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7019888162612915,
//                     "bbox": [
//                         582.2592163085938,
//                         19.262636184692383,
//                         702.7672119140625,
//                         68.97393798828125
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5787932276725769,
//                     "bbox": [
//                         280.3538513183594,
//                         101.80933380126953,
//                         389.06842041015625,
//                         177.8072967529297
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3701152205467224,
//                     "bbox": [
//                         235.18191528320312,
//                         57.228267669677734,
//                         310.99810791015625,
//                         98.35993957519531
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 34,
//             "timestamp": 1.2534623326959846,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7366567254066467,
//                     "bbox": [
//                         603.2288208007812,
//                         36.40241622924805,
//                         724.701904296875,
//                         91.14996337890625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.42634621262550354,
//                     "bbox": [
//                         250.13926696777344,
//                         128.70742797851562,
//                         392.12139892578125,
//                         239.9810028076172
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.28099530935287476,
//                     "bbox": [
//                         228.17762756347656,
//                         74.6209716796875,
//                         307.08154296875,
//                         119.19729614257812
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 35,
//             "timestamp": 1.2903288718929256,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7060860991477966,
//                     "bbox": [
//                         618.478271484375,
//                         55.635128021240234,
//                         746.7262573242188,
//                         116.7368392944336
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.45791783928871155,
//                     "bbox": [
//                         220.35987854003906,
//                         96.5495834350586,
//                         300.7873229980469,
//                         144.39305114746094
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 36,
//             "timestamp": 1.3271954110898663,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.516802191734314,
//                     "bbox": [
//                         640.8526000976562,
//                         80.09228515625,
//                         768.8094482421875,
//                         143.69618225097656
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 37,
//             "timestamp": 1.364061950286807,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5716806650161743,
//                     "bbox": [
//                         354.9195251464844,
//                         0,
//                         402.5341491699219,
//                         23.83946990966797
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5508272647857666,
//                     "bbox": [
//                         661.4473876953125,
//                         105.82083892822266,
//                         795.9873657226562,
//                         173.7545166015625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.49733999371528625,
//                     "bbox": [
//                         576.365234375,
//                         0,
//                         646.5582885742188,
//                         31.74489974975586
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 38,
//             "timestamp": 1.4009284894837477,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7539297938346863,
//                     "bbox": [
//                         584.6640014648438,
//                         2.2556867599487305,
//                         663.6221313476562,
//                         49.62043762207031
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6101808547973633,
//                     "bbox": [
//                         353.6717834472656,
//                         5.1309356689453125,
//                         405.42022705078125,
//                         36.89107894897461
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5132611989974976,
//                     "bbox": [
//                         689.29345703125,
//                         134.02146911621094,
//                         826.6513671875,
//                         217.0467987060547
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 39,
//             "timestamp": 1.4377950286806884,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8091437816619873,
//                     "bbox": [
//                         598.6820068359375,
//                         16.538530349731445,
//                         681.9639892578125,
//                         66.76113891601562
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6631994247436523,
//                     "bbox": [
//                         350.5355529785156,
//                         13.263916015625,
//                         407.23785400390625,
//                         54.147830963134766
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6095321178436279,
//                     "bbox": [
//                         714.6396484375,
//                         168.63795471191406,
//                         860.4886474609375,
//                         258.50372314453125
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3239721655845642,
//                     "bbox": [
//                         637.8455810546875,
//                         113.6526107788086,
//                         740.675537109375,
//                         187.81153869628906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 40,
//             "timestamp": 1.4746615678776291,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8503888249397278,
//                     "bbox": [
//                         613.5448608398438,
//                         30.622684478759766,
//                         702.3306884765625,
//                         85.9864273071289
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.726134181022644,
//                     "bbox": [
//                         351.19000244140625,
//                         28.591690063476562,
//                         408.99560546875,
//                         64.18054962158203
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.37698379158973694,
//                     "bbox": [
//                         664.077880859375,
//                         143.5471649169922,
//                         769.6234741210938,
//                         227.52938842773438
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 41,
//             "timestamp": 1.5115281070745699,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8785424828529358,
//                     "bbox": [
//                         627.294677734375,
//                         46.830352783203125,
//                         727.5616455078125,
//                         109.09791564941406
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7088215351104736,
//                     "bbox": [
//                         352.05682373046875,
//                         42.34588623046875,
//                         410.9540100097656,
//                         81.0097885131836
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 42,
//             "timestamp": 1.5483946462715106,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8909693360328674,
//                     "bbox": [
//                         645.674560546875,
//                         65.53579711914062,
//                         751.5563354492188,
//                         134.07691955566406
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7595942616462708,
//                     "bbox": [
//                         349.7177734375,
//                         57.19686508178711,
//                         414.54541015625,
//                         101.04898071289062
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3968510925769806,
//                     "bbox": [
//                         546.4968872070312,
//                         0,
//                         645.2951049804688,
//                         69.50900268554688
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.33550506830215454,
//                     "bbox": [
//                         293.7713623046875,
//                         7.546555042266846,
//                         361.9985046386719,
//                         44.46070861816406
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2818533480167389,
//                     "bbox": [
//                         550.294921875,
//                         0,
//                         602.504638671875,
//                         25.4896240234375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 43,
//             "timestamp": 1.5852611854684513,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.9005852937698364,
//                     "bbox": [
//                         666.5792846679688,
//                         85.62329864501953,
//                         780.2017211914062,
//                         163.8389129638672
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.820006251335144,
//                     "bbox": [
//                         350.028076171875,
//                         76.39655303955078,
//                         417.37774658203125,
//                         123.54995727539062
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5591546297073364,
//                     "bbox": [
//                         559.1770629882812,
//                         3.7404212951660156,
//                         618.7730712890625,
//                         43.02671813964844
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.46538570523262024,
//                     "bbox": [
//                         564.719970703125,
//                         36.50082015991211,
//                         667.1372680664062,
//                         92.78939819335938
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4062884747982025,
//                     "bbox": [
//                         291.3995666503906,
//                         18.187517166137695,
//                         361.896240234375,
//                         54.36668395996094
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 44,
//             "timestamp": 1.622127724665392,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.831972062587738,
//                     "bbox": [
//                         348.6815490722656,
//                         97.96945190429688,
//                         422.0824890136719,
//                         148.8321990966797
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8248047828674316,
//                     "bbox": [
//                         689.96826171875,
//                         108.92877197265625,
//                         808.1838989257812,
//                         197.66445922851562
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7819126844406128,
//                     "bbox": [
//                         286.05584716796875,
//                         28.631288528442383,
//                         361.5225524902344,
//                         68.89521026611328
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.49501433968544006,
//                     "bbox": [
//                         573.0391845703125,
//                         14.650678634643555,
//                         632.0739135742188,
//                         58.398006439208984
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.29012876749038696,
//                     "bbox": [
//                         573.9818115234375,
//                         55.02354049682617,
//                         688.88427734375,
//                         113.06370544433594
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 45,
//             "timestamp": 1.6589942638623327,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8210722804069519,
//                     "bbox": [
//                         348.0502624511719,
//                         122.88452911376953,
//                         427.5589294433594,
//                         180.96006774902344
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.802437961101532,
//                     "bbox": [
//                         716.8811645507812,
//                         139.71774291992188,
//                         841.08837890625,
//                         239.6493682861328
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.641897976398468,
//                     "bbox": [
//                         281.1563415527344,
//                         40.84366226196289,
//                         362.6544494628906,
//                         86.47710418701172
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 46,
//             "timestamp": 1.6958608030592734,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8061680197715759,
//                     "bbox": [
//                         746.7916870117188,
//                         172.6902313232422,
//                         873.697265625,
//                         287.02880859375
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7832357287406921,
//                     "bbox": [
//                         347.6772155761719,
//                         153.5952606201172,
//                         431.43841552734375,
//                         216.8209228515625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6549940705299377,
//                     "bbox": [
//                         599.5899047851562,
//                         40.558021545410156,
//                         669.3037109375,
//                         99.0885009765625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5340427756309509,
//                     "bbox": [
//                         274.7890930175781,
//                         57.133995056152344,
//                         362.0110778808594,
//                         104.24512481689453
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4694897532463074,
//                     "bbox": [
//                         617.52392578125,
//                         108.09247589111328,
//                         735.629638671875,
//                         176.0335693359375
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.31913888454437256,
//                     "bbox": [
//                         599.6181640625,
//                         47.75654220581055,
//                         735.4337158203125,
//                         175.06771850585938
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 47,
//             "timestamp": 1.7327273422562142,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8072072863578796,
//                     "bbox": [
//                         746.8585205078125,
//                         172.7384796142578,
//                         873.701171875,
//                         287.04931640625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7835648655891418,
//                     "bbox": [
//                         347.68292236328125,
//                         153.604248046875,
//                         431.43768310546875,
//                         216.78726196289062
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6527949571609497,
//                     "bbox": [
//                         599.6007690429688,
//                         40.59101486206055,
//                         669.2950439453125,
//                         99.06050109863281
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5330438017845154,
//                     "bbox": [
//                         274.8165588378906,
//                         57.164554595947266,
//                         361.9779052734375,
//                         104.2257308959961
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4712652862071991,
//                     "bbox": [
//                         617.3283081054688,
//                         108.072998046875,
//                         735.727294921875,
//                         176.07150268554688
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.32632341980934143,
//                     "bbox": [
//                         599.4242553710938,
//                         47.50743103027344,
//                         735.4717407226562,
//                         175.1314697265625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 48,
//             "timestamp": 1.7695938814531549,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.737587034702301,
//                     "bbox": [
//                         267.7614440917969,
//                         75.40381622314453,
//                         360.6842956542969,
//                         125.38385009765625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6901760101318359,
//                     "bbox": [
//                         350.8485107421875,
//                         188.03883361816406,
//                         437.4768981933594,
//                         259.7916564941406
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6889468431472778,
//                     "bbox": [
//                         615.5750732421875,
//                         60.62590789794922,
//                         690.713134765625,
//                         120.71215057373047
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 49,
//             "timestamp": 1.8064604206500956,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7035925984382629,
//                     "bbox": [
//                         260.3880615234375,
//                         94.38473510742188,
//                         361.23712158203125,
//                         149.4099884033203
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5386080741882324,
//                     "bbox": [
//                         636.548583984375,
//                         80.97105407714844,
//                         715.461669921875,
//                         151.4568634033203
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3651677966117859,
//                     "bbox": [
//                         817.2160034179688,
//                         260.06951904296875,
//                         898,
//                         392.8466491699219
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 50,
//             "timestamp": 1.8433269598470363,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.746226966381073,
//                     "bbox": [
//                         252.75904846191406,
//                         118.19281005859375,
//                         360.1713562011719,
//                         177.89816284179688
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6228290796279907,
//                     "bbox": [
//                         658.283935546875,
//                         109.40587615966797,
//                         744.3264770507812,
//                         183.5951690673828
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4598475396633148,
//                     "bbox": [
//                         658.8516845703125,
//                         106.17172241210938,
//                         836.77685546875,
//                         316.60357666015625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.37075600028038025,
//                     "bbox": [
//                         342.9248352050781,
//                         286.21917724609375,
//                         457.2303466796875,
//                         380.80584716796875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 51,
//             "timestamp": 1.880193499043977,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6721215844154358,
//                     "bbox": [
//                         245.89024353027344,
//                         145.99951171875,
//                         358.51824951171875,
//                         210.05886840820312
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5076884031295776,
//                     "bbox": [
//                         683.3182983398438,
//                         137.0902557373047,
//                         770.2565307617188,
//                         226.0641326904297
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3246994614601135,
//                     "bbox": [
//                         674.8700561523438,
//                         130.42245483398438,
//                         875.540771484375,
//                         378.09503173828125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 52,
//             "timestamp": 1.9170600382409178,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5677271485328674,
//                     "bbox": [
//                         240.2273406982422,
//                         176.28182983398438,
//                         356.4393005371094,
//                         247.97686767578125
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4098580777645111,
//                     "bbox": [
//                         712.9491577148438,
//                         175.78187561035156,
//                         800.057373046875,
//                         243.2661590576172
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 53,
//             "timestamp": 1.9539265774378585,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5521145462989807,
//                     "bbox": [
//                         228.99497985839844,
//                         215.50965881347656,
//                         355.4112854003906,
//                         292.0893249511719
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 61,
//             "timestamp": 2.248858891013384,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3682408332824707,
//                     "bbox": [
//                         382.40936279296875,
//                         48.60013961791992,
//                         479.09686279296875,
//                         110.91876983642578
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 64,
//             "timestamp": 2.3594585086042064,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3414367437362671,
//                     "bbox": [
//                         397.18109130859375,
//                         105.07855224609375,
//                         512.9456787109375,
//                         199.01025390625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 65,
//             "timestamp": 2.396325047801147,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3424285054206848,
//                     "bbox": [
//                         391.1033630371094,
//                         128.17807006835938,
//                         520.9212036132812,
//                         252.122802734375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 66,
//             "timestamp": 2.433191586998088,
//             "detections": [
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.28217166662216187,
//                     "bbox": [
//                         288.4096984863281,
//                         72.62548828125,
//                         406.3800354003906,
//                         99.20829772949219
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 67,
//             "timestamp": 2.4700581261950285,
//             "detections": [
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.34278184175491333,
//                     "bbox": [
//                         172.85240173339844,
//                         289.851806640625,
//                         375.2463073730469,
//                         334.2684631347656
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.31146878004074097,
//                     "bbox": [
//                         382.0760498046875,
//                         191.44717407226562,
//                         553.4714965820312,
//                         359.5306396484375
//                     ]
//                 },
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.26984867453575134,
//                     "bbox": [
//                         278.67132568359375,
//                         91.16218566894531,
//                         412.1054992675781,
//                         120.01895904541016
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 68,
//             "timestamp": 2.5069246653919692,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.5438205599784851,
//                     "bbox": [
//                         403.8385314941406,
//                         245.41416931152344,
//                         535.4285888671875,
//                         416.1609802246094
//                     ]
//                 },
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.49007946252822876,
//                     "bbox": [
//                         163.6686553955078,
//                         346.7146301269531,
//                         380.33160400390625,
//                         393.365966796875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 69,
//             "timestamp": 2.5437912045889104,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.55449378490448,
//                     "bbox": [
//                         403.8587341308594,
//                         245.44766235351562,
//                         535.3140258789062,
//                         415.9835205078125
//                     ]
//                 },
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.48495689034461975,
//                     "bbox": [
//                         163.6844482421875,
//                         346.6378173828125,
//                         380.40997314453125,
//                         393.3369445800781
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 70,
//             "timestamp": 2.580657743785851,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.3552649915218353,
//                     "bbox": [
//                         435.2284851074219,
//                         292.79815673828125,
//                         564.1708984375,
//                         459.6936340332031
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 71,
//             "timestamp": 2.617524282982792,
//             "detections": [
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.363037109375,
//                     "bbox": [
//                         254.25894165039062,
//                         169.2096405029297,
//                         426.4822998046875,
//                         205.92884826660156
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.26721689105033875,
//                     "bbox": [
//                         449.0209655761719,
//                         5.467939853668213,
//                         676.6634521484375,
//                         104.55565643310547
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 72,
//             "timestamp": 2.6543908221797325,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6373494863510132,
//                     "bbox": [
//                         452.0527038574219,
//                         16.92074203491211,
//                         695.5946044921875,
//                         129.4417724609375
//                     ]
//                 },
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.45545580983161926,
//                     "bbox": [
//                         250.6085968017578,
//                         199.77232360839844,
//                         493.4384765625,
//                         242.76734924316406
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 73,
//             "timestamp": 2.6912573613766733,
//             "detections": [
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.4193236529827118,
//                     "bbox": [
//                         241.67384338378906,
//                         243.22483825683594,
//                         440.21759033203125,
//                         291.1667175292969
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 74,
//             "timestamp": 2.728123900573614,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3741418719291687,
//                     "bbox": [
//                         463.2320861816406,
//                         43.591636657714844,
//                         745.3799438476562,
//                         186.3877716064453
//                     ]
//                 },
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.2736065983772278,
//                     "bbox": [
//                         230.42837524414062,
//                         295.0113830566406,
//                         448.9990234375,
//                         348.0372619628906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 75,
//             "timestamp": 2.7649904397705547,
//             "detections": [
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.6459683179855347,
//                     "bbox": [
//                         222.1416015625,
//                         350.7276306152344,
//                         464.2979431152344,
//                         409.4807434082031
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.567425549030304,
//                     "bbox": [
//                         467.21551513671875,
//                         53.99253845214844,
//                         766.6048583984375,
//                         224.7932891845703
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 76,
//             "timestamp": 2.8018569789674954,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5245785713195801,
//                     "bbox": [
//                         480.4147033691406,
//                         73.10863494873047,
//                         798.61767578125,
//                         267.75909423828125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 77,
//             "timestamp": 2.838723518164436,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5180308222770691,
//                     "bbox": [
//                         480.5594177246094,
//                         72.85386657714844,
//                         798.7097778320312,
//                         267.695556640625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 98,
//             "timestamp": 3.612920841300191,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5388822555541992,
//                     "bbox": [
//                         360.7339782714844,
//                         0,
//                         430.11346435546875,
//                         44.58218002319336
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 99,
//             "timestamp": 3.649787380497132,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6044924259185791,
//                     "bbox": [
//                         357.54119873046875,
//                         0,
//                         436.0731201171875,
//                         59.02056121826172
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 100,
//             "timestamp": 3.6866539196940726,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.607639491558075,
//                     "bbox": [
//                         357.5964050292969,
//                         0,
//                         436.052001953125,
//                         58.99522399902344
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 101,
//             "timestamp": 3.7235204588910134,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4504220485687256,
//                     "bbox": [
//                         360.6313781738281,
//                         8.381863594055176,
//                         442.00628662109375,
//                         71.78450012207031
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 102,
//             "timestamp": 3.760386998087954,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.673479437828064,
//                     "bbox": [
//                         361.2374572753906,
//                         20.31864356994629,
//                         443.8123474121094,
//                         87.32422637939453
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 103,
//             "timestamp": 3.797253537284895,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.31603366136550903,
//                     "bbox": [
//                         363.019287109375,
//                         31.294445037841797,
//                         448.7063293457031,
//                         102.86715698242188
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 104,
//             "timestamp": 3.8341200764818355,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3191141188144684,
//                     "bbox": [
//                         332.9324951171875,
//                         1.7390544414520264,
//                         404.8080749511719,
//                         41.05972671508789
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.31637337803840637,
//                     "bbox": [
//                         356.83343505859375,
//                         39.74008560180664,
//                         460.637939453125,
//                         125.7806396484375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 108,
//             "timestamp": 3.9815862332695984,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.30125221610069275,
//                     "bbox": [
//                         352.9002380371094,
//                         93.93587493896484,
//                         472.47015380859375,
//                         205.9488067626953
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 115,
//             "timestamp": 4.239652007648184,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5590468645095825,
//                     "bbox": [
//                         688.0485229492188,
//                         285.1653137207031,
//                         894.1766967773438,
//                         497.84698486328125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 116,
//             "timestamp": 4.276518546845124,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.26542744040489197,
//                     "bbox": [
//                         748.59423828125,
//                         343.36517333984375,
//                         896.8483276367188,
//                         498.3385314941406
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 123,
//             "timestamp": 4.53458432122371,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.40525758266448975,
//                     "bbox": [
//                         343.9342346191406,
//                         195.18624877929688,
//                         567.791259765625,
//                         273.7678527832031
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2679913640022278,
//                     "bbox": [
//                         41.415950775146484,
//                         349.5972595214844,
//                         220.43649291992188,
//                         498.9864807128906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 124,
//             "timestamp": 4.57145086042065,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3962763547897339,
//                     "bbox": [
//                         443.2271728515625,
//                         231.85446166992188,
//                         602.8621215820312,
//                         487.0411376953125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 125,
//             "timestamp": 4.608317399617591,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5222471356391907,
//                     "bbox": [
//                         444.0118103027344,
//                         271.1959533691406,
//                         610.9312133789062,
//                         497.0791320800781
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 147,
//             "timestamp": 5.419381261950287,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2561708092689514,
//                     "bbox": [
//                         621.0238647460938,
//                         14.069798469543457,
//                         665.69140625,
//                         49.0938835144043
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 154,
//             "timestamp": 5.677447036328872,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.31007423996925354,
//                     "bbox": [
//                         694.177734375,
//                         79.4559097290039,
//                         746.1423950195312,
//                         127.04646301269531
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 155,
//             "timestamp": 5.7143135755258125,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4340210556983948,
//                     "bbox": [
//                         648.4612426757812,
//                         39.00180435180664,
//                         702.77294921875,
//                         79.59799194335938
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 156,
//             "timestamp": 5.751180114722754,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6393553018569946,
//                     "bbox": [
//                         661.5899047851562,
//                         53.697364807128906,
//                         725.2589111328125,
//                         101.04358673095703
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 157,
//             "timestamp": 5.788046653919694,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6611123085021973,
//                     "bbox": [
//                         682.9944458007812,
//                         71.96175384521484,
//                         747.6824340820312,
//                         122.66737365722656
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 158,
//             "timestamp": 5.824913193116635,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.676145613193512,
//                     "bbox": [
//                         704.6503295898438,
//                         93.97083282470703,
//                         773.5923461914062,
//                         146.9940185546875
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3533604145050049,
//                     "bbox": [
//                         791.0852661132812,
//                         187.1666717529297,
//                         860.641845703125,
//                         261.45196533203125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 159,
//             "timestamp": 5.861779732313575,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7960315346717834,
//                     "bbox": [
//                         726.5247192382812,
//                         115.80713653564453,
//                         799.8488159179688,
//                         176.99586486816406
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.38416898250579834,
//                     "bbox": [
//                         824.3986206054688,
//                         225.1787109375,
//                         894.301025390625,
//                         307.72711181640625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 160,
//             "timestamp": 5.898646271510517,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8168530464172363,
//                     "bbox": [
//                         750.5640258789062,
//                         142.289794921875,
//                         831.1887817382812,
//                         211.69224548339844
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2621106803417206,
//                     "bbox": [
//                         334.6874694824219,
//                         190.34104919433594,
//                         407.3010559082031,
//                         279.0846862792969
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 161,
//             "timestamp": 5.935512810707457,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7698871493339539,
//                     "bbox": [
//                         777.529052734375,
//                         175.0902862548828,
//                         863.1751708984375,
//                         250.31495666503906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 162,
//             "timestamp": 5.972379349904398,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.735873818397522,
//                     "bbox": [
//                         807.1735229492188,
//                         211.1658935546875,
//                         896.204833984375,
//                         295.195556640625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 163,
//             "timestamp": 6.009245889101338,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.33806112408638,
//                     "bbox": [
//                         840.6660766601562,
//                         250.07089233398438,
//                         898,
//                         338.7931213378906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 164,
//             "timestamp": 6.046112428298279,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3609951138496399,
//                     "bbox": [
//                         414.5295715332031,
//                         142.4659423828125,
//                         476.9407043457031,
//                         185.17556762695312
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 166,
//             "timestamp": 6.119845506692161,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5642335414886475,
//                     "bbox": [
//                         418.1119689941406,
//                         212.58131408691406,
//                         500.43133544921875,
//                         271.76605224609375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 171,
//             "timestamp": 6.304178202676864,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4867575466632843,
//                     "bbox": [
//                         312.08477783203125,
//                         0,
//                         380.3669738769531,
//                         32.03883361816406
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 172,
//             "timestamp": 6.341044741873805,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6360346078872681,
//                     "bbox": [
//                         307.7541809082031,
//                         0,
//                         384.1600646972656,
//                         42.470115661621094
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3551121950149536,
//                     "bbox": [
//                         308.57745361328125,
//                         0,
//                         385.083740234375,
//                         29.10886001586914
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 173,
//             "timestamp": 6.3779112810707455,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7178449034690857,
//                     "bbox": [
//                         301.7794494628906,
//                         7.017744541168213,
//                         384.9884948730469,
//                         58.069252014160156
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2652602195739746,
//                     "bbox": [
//                         307.70196533203125,
//                         7.773875713348389,
//                         386.3957824707031,
//                         38.16301345825195
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 174,
//             "timestamp": 6.414777820267687,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7161806225776672,
//                     "bbox": [
//                         301.78448486328125,
//                         7.017190456390381,
//                         384.9972839355469,
//                         58.053077697753906
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.26477065682411194,
//                     "bbox": [
//                         307.94525146484375,
//                         7.790917873382568,
//                         386.38818359375,
//                         38.06328582763672
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 175,
//             "timestamp": 6.451644359464627,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6135432124137878,
//                     "bbox": [
//                         292.36358642578125,
//                         28.843032836914062,
//                         387.03692626953125,
//                         83.04149627685547
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.25963538885116577,
//                     "bbox": [
//                         294.9895935058594,
//                         29.67401885986328,
//                         387.0356750488281,
//                         68.08976745605469
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 176,
//             "timestamp": 6.488510898661568,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.582217812538147,
//                     "bbox": [
//                         284.3290100097656,
//                         40.439090728759766,
//                         387.3217468261719,
//                         107.60220336914062
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3165885806083679,
//                     "bbox": [
//                         288.0160827636719,
//                         40.09630584716797,
//                         388.68609619140625,
//                         81.4040298461914
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 177,
//             "timestamp": 6.525377437858508,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5189852118492126,
//                     "bbox": [
//                         279.17724609375,
//                         59.428123474121094,
//                         366.90045166015625,
//                         129.83578491210938
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.29803377389907837,
//                     "bbox": [
//                         290.6259460449219,
//                         57.5482177734375,
//                         388.5131530761719,
//                         96.13715362548828
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 178,
//             "timestamp": 6.5622439770554495,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5626538991928101,
//                     "bbox": [
//                         275.4828186035156,
//                         72.63211822509766,
//                         388.3158264160156,
//                         115.69869995117188
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4040897786617279,
//                     "bbox": [
//                         316.4435729980469,
//                         73.97608947753906,
//                         387.4145812988281,
//                         113.01737213134766
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 179,
//             "timestamp": 6.59911051625239,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6591898798942566,
//                     "bbox": [
//                         266.3545837402344,
//                         91.5837631225586,
//                         386.9632263183594,
//                         141.19635009765625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.37646397948265076,
//                     "bbox": [
//                         310.90496826171875,
//                         92.85694122314453,
//                         386.96234130859375,
//                         138.2046661376953
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3735658824443817,
//                     "bbox": [
//                         258.2560119628906,
//                         91.9497299194336,
//                         390.34954833984375,
//                         186.5065460205078
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 180,
//             "timestamp": 6.635977055449331,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6515878438949585,
//                     "bbox": [
//                         258.6234436035156,
//                         116.07159423828125,
//                         384.5321960449219,
//                         168.60018920898438
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5028883814811707,
//                     "bbox": [
//                         307.8561096191406,
//                         115.99081420898438,
//                         385.329345703125,
//                         165.80491638183594
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4690546989440918,
//                     "bbox": [
//                         257.98687744140625,
//                         133.7998504638672,
//                         332.9043884277344,
//                         222.95188903808594
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.36379474401474,
//                     "bbox": [
//                         252.2167205810547,
//                         118.33861541748047,
//                         387.9326171875,
//                         220.2283172607422
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3094324469566345,
//                     "bbox": [
//                         256.4355773925781,
//                         126.78971099853516,
//                         322.2364807128906,
//                         168.02719116210938
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 181,
//             "timestamp": 6.672843594646271,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3561670184135437,
//                     "bbox": [
//                         245.72898864746094,
//                         152.94046020507812,
//                         315.9569091796875,
//                         199.9910430908203
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3496316075325012,
//                     "bbox": [
//                         288.2674255371094,
//                         144.0066375732422,
//                         385.2944030761719,
//                         199.88206481933594
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.30357834696769714,
//                     "bbox": [
//                         237.081787109375,
//                         142.13955688476562,
//                         390.85711669921875,
//                         265.4423828125
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.27060094475746155,
//                     "bbox": [
//                         251.03236389160156,
//                         144.11729431152344,
//                         386.68109130859375,
//                         201.87905883789062
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 182,
//             "timestamp": 6.709710133843212,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4925282895565033,
//                     "bbox": [
//                         295.7513122558594,
//                         174.38494873046875,
//                         385.0390625,
//                         240.08213806152344
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.43482065200805664,
//                     "bbox": [
//                         225.45089721679688,
//                         173.40501403808594,
//                         388.48175048828125,
//                         315.7066650390625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 183,
//             "timestamp": 6.746576673040153,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.39504995942115784,
//                     "bbox": [
//                         283.6473083496094,
//                         212.79306030273438,
//                         389.6180114746094,
//                         281.00390625
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.2634440064430237,
//                     "bbox": [
//                         144.25746154785156,
//                         204.4405975341797,
//                         394.8869323730469,
//                         490.65496826171875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 184,
//             "timestamp": 6.783443212237094,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2821360230445862,
//                     "bbox": [
//                         209.435546875,
//                         258.1531982421875,
//                         387.78692626953125,
//                         336.4449462890625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 194,
//             "timestamp": 7.152108604206501,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.3952391445636749,
//                     "bbox": [
//                         334.5767822265625,
//                         0,
//                         402.3179931640625,
//                         134.6133575439453
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 195,
//             "timestamp": 7.188975143403442,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.4745498299598694,
//                     "bbox": [
//                         337.0519104003906,
//                         1.938583493232727,
//                         405.19281005859375,
//                         158.4022216796875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 196,
//             "timestamp": 7.225841682600382,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.5218489170074463,
//                     "bbox": [
//                         334.9152526855469,
//                         0.8310714960098267,
//                         407.60687255859375,
//                         194.62692260742188
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 197,
//             "timestamp": 7.262708221797324,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.440127432346344,
//                     "bbox": [
//                         336.5777893066406,
//                         0.8130229115486145,
//                         409.78607177734375,
//                         226.0093536376953
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 199,
//             "timestamp": 7.336441300191205,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.27863645553588867,
//                     "bbox": [
//                         326.2872314453125,
//                         21.762407302856445,
//                         410.8975524902344,
//                         370.59344482421875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 201,
//             "timestamp": 7.410174378585086,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.33146876096725464,
//                     "bbox": [
//                         232.9808349609375,
//                         4.713034152984619,
//                         370.4006652832031,
//                         138.89024353027344
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.2604938745498657,
//                     "bbox": [
//                         349.040771484375,
//                         14.055764198303223,
//                         417.7308044433594,
//                         249.46676635742188
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 202,
//             "timestamp": 7.447040917782027,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3652041554450989,
//                     "bbox": [
//                         220.6345977783203,
//                         17.59623146057129,
//                         367.7308044433594,
//                         166.60940551757812
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3537067770957947,
//                     "bbox": [
//                         308.3341979980469,
//                         0.3614300489425659,
//                         395.6241149902344,
//                         69.18944549560547
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 203,
//             "timestamp": 7.483907456978968,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3128337562084198,
//                     "bbox": [
//                         300.55419921875,
//                         0,
//                         411.67535400390625,
//                         87.5754623413086
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 204,
//             "timestamp": 7.520773996175908,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.29879218339920044,
//                     "bbox": [
//                         291.0281982421875,
//                         0,
//                         412.5829772949219,
//                         107.66153717041016
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 205,
//             "timestamp": 7.557640535372849,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.40770837664604187,
//                     "bbox": [
//                         288.87841796875,
//                         0,
//                         419.6399230957031,
//                         128.39813232421875
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2765534222126007,
//                     "bbox": [
//                         308.5087585449219,
//                         1.9693496227264404,
//                         369.38018798828125,
//                         51.20713424682617
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 206,
//             "timestamp": 7.59450707456979,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.31745168566703796,
//                     "bbox": [
//                         261.84271240234375,
//                         3.291785717010498,
//                         426.928955078125,
//                         149.31031799316406
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3118878901004791,
//                     "bbox": [
//                         300.4765625,
//                         7.815882205963135,
//                         374.150390625,
//                         67.72672271728516
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 207,
//             "timestamp": 7.631373613766731,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.45598191022872925,
//                     "bbox": [
//                         296.44891357421875,
//                         20.39792823791504,
//                         370.16766357421875,
//                         82.94109344482422
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 210,
//             "timestamp": 7.741973231357552,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.29454874992370605,
//                     "bbox": [
//                         207.58404541015625,
//                         48.59442138671875,
//                         442.9402770996094,
//                         343.4256286621094
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.27416232228279114,
//                     "bbox": [
//                         250.10467529296875,
//                         59.55321502685547,
//                         408.7355651855469,
//                         237.7146759033203
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 211,
//             "timestamp": 7.778839770554494,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3744761049747467,
//                     "bbox": [
//                         206.5069580078125,
//                         46.62504577636719,
//                         452.0785827636719,
//                         401.5185852050781
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 212,
//             "timestamp": 7.815706309751434,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4097689390182495,
//                     "bbox": [
//                         206.90818786621094,
//                         70.63363647460938,
//                         484.5327453613281,
//                         413.7466125488281
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 229,
//             "timestamp": 8.442437476099427,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6616261601448059,
//                     "bbox": [
//                         556.3922729492188,
//                         1.5944018363952637,
//                         635.8500366210938,
//                         57.85527038574219
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 230,
//             "timestamp": 8.479304015296368,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7678030729293823,
//                     "bbox": [
//                         560.845703125,
//                         11.23376750946045,
//                         650.7901000976562,
//                         75.88404083251953
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 231,
//             "timestamp": 8.516170554493309,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.683440089225769,
//                     "bbox": [
//                         570.4219360351562,
//                         25.548763275146484,
//                         666.2426147460938,
//                         94.30252838134766
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 232,
//             "timestamp": 8.553037093690248,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7006010413169861,
//                     "bbox": [
//                         579.29443359375,
//                         40.72178268432617,
//                         687.4389038085938,
//                         119.00106048583984
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 233,
//             "timestamp": 8.58990363288719,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6849003434181213,
//                     "bbox": [
//                         596.2056274414062,
//                         58.033355712890625,
//                         706.9519653320312,
//                         144.64849853515625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 234,
//             "timestamp": 8.62677017208413,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6429113149642944,
//                     "bbox": [
//                         612.4135131835938,
//                         79.4846420288086,
//                         731.580322265625,
//                         174.98361206054688
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 235,
//             "timestamp": 8.663636711281072,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7266857624053955,
//                     "bbox": [
//                         626.1351318359375,
//                         97.62142944335938,
//                         757.3485107421875,
//                         215.67373657226562
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 236,
//             "timestamp": 8.700503250478011,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.44527381658554077,
//                     "bbox": [
//                         645.4613647460938,
//                         122.1680908203125,
//                         784.7210083007812,
//                         257.1184997558594
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 237,
//             "timestamp": 8.737369789674952,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5379692912101746,
//                     "bbox": [
//                         666.5199584960938,
//                         147.38491821289062,
//                         815.6205444335938,
//                         309.32501220703125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 245,
//             "timestamp": 9.032302103250478,
//             "detections": [
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.2521216869354248,
//                     "bbox": [
//                         419.69476318359375,
//                         196.45921325683594,
//                         890.3505249023438,
//                         278.7008972167969
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 249,
//             "timestamp": 9.17976826003824,
//             "detections": [
//                 {
//                     "class": "Transverse Crack",
//                     "confidence": 0.49077436327934265,
//                     "bbox": [
//                         702.8004150390625,
//                         239.10263061523438,
//                         869.1884155273438,
//                         298.55072021484375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 270,
//             "timestamp": 9.953965583173996,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3732624351978302,
//                     "bbox": [
//                         237.4072723388672,
//                         65.08475494384766,
//                         310.4133605957031,
//                         114.45854949951172
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 275,
//             "timestamp": 10.1382982791587,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3176296353340149,
//                     "bbox": [
//                         189.64105224609375,
//                         139.90875244140625,
//                         319.7925720214844,
//                         218.35215759277344
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 276,
//             "timestamp": 10.175164818355642,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.320417582988739,
//                     "bbox": [
//                         375.96240234375,
//                         213.75364685058594,
//                         506.7767333984375,
//                         468.8271789550781
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 277,
//             "timestamp": 10.212031357552581,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4827709197998047,
//                     "bbox": [
//                         368.40679931640625,
//                         0,
//                         697.3045654296875,
//                         212.57028198242188
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 278,
//             "timestamp": 10.248897896749522,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4817429780960083,
//                     "bbox": [
//                         368.37744140625,
//                         0,
//                         697.2881469726562,
//                         212.7910919189453
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 281,
//             "timestamp": 10.359497514340344,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.28275683522224426,
//                     "bbox": [
//                         564.6483764648438,
//                         8.59979248046875,
//                         797.9982299804688,
//                         390.4651184082031
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.254975825548172,
//                     "bbox": [
//                         357.00213623046875,
//                         0,
//                         750.4375,
//                         303.36083984375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 282,
//             "timestamp": 10.396364053537285,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.29694148898124695,
//                     "bbox": [
//                         365.62457275390625,
//                         5.714791297912598,
//                         636.2655029296875,
//                         163.8922576904297
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 283,
//             "timestamp": 10.433230592734226,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.3363940715789795,
//                     "bbox": [
//                         605.4508666992188,
//                         54.48602294921875,
//                         873.7789306640625,
//                         490.11529541015625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.266033411026001,
//                     "bbox": [
//                         359.9913024902344,
//                         6.051790237426758,
//                         656.6463012695312,
//                         191.49269104003906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 284,
//             "timestamp": 10.470097131931167,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.3448563814163208,
//                     "bbox": [
//                         605.273193359375,
//                         54.5373649597168,
//                         875.1007080078125,
//                         491.1968688964844
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2728857100009918,
//                     "bbox": [
//                         360.7190246582031,
//                         6.074184894561768,
//                         656.6333618164062,
//                         191.40191650390625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 285,
//             "timestamp": 10.506963671128107,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.2804724872112274,
//                     "bbox": [
//                         617.9407958984375,
//                         63.79538345336914,
//                         862.1528930664062,
//                         492.83099365234375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 287,
//             "timestamp": 10.580696749521989,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4771104156970978,
//                     "bbox": [
//                         556.9874267578125,
//                         8.866941452026367,
//                         599.9391479492188,
//                         30.81244659423828
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2771643102169037,
//                     "bbox": [
//                         590.4860229492188,
//                         24.082534790039062,
//                         655.3008422851562,
//                         73.61573791503906
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2754501402378082,
//                     "bbox": [
//                         574.11474609375,
//                         17.198984146118164,
//                         656.0111083984375,
//                         74.42823028564453
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 288,
//             "timestamp": 10.61756328871893,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.43419089913368225,
//                     "bbox": [
//                         564.882080078125,
//                         21.628570556640625,
//                         611.2282104492188,
//                         47.39570999145508
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 289,
//             "timestamp": 10.65442982791587,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.41241541504859924,
//                     "bbox": [
//                         574.5867919921875,
//                         33.59477615356445,
//                         627.8157958984375,
//                         68.0592041015625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.28926217555999756,
//                     "bbox": [
//                         614.0596923828125,
//                         55.840782165527344,
//                         688.01904296875,
//                         119.18899536132812
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 290,
//             "timestamp": 10.69129636711281,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.41251498460769653,
//                     "bbox": [
//                         574.5863037109375,
//                         33.594478607177734,
//                         627.8283081054688,
//                         68.06265258789062
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.28820565342903137,
//                     "bbox": [
//                         614.0260009765625,
//                         55.78472900390625,
//                         688.0172119140625,
//                         119.20066833496094
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 291,
//             "timestamp": 10.728162906309752,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3244662284851074,
//                     "bbox": [
//                         588.2162475585938,
//                         52.61990737915039,
//                         639.5941772460938,
//                         85.46009063720703
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 292,
//             "timestamp": 10.765029445506693,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.562347412109375,
//                     "bbox": [
//                         354.67022705078125,
//                         48.66667938232422,
//                         465.62451171875,
//                         171.78970336914062
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.347644180059433,
//                     "bbox": [
//                         602.5484008789062,
//                         72.82826232910156,
//                         656.0225219726562,
//                         108.59852600097656
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 293,
//             "timestamp": 10.801895984703632,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.590576171875,
//                     "bbox": [
//                         353.90985107421875,
//                         62.79800033569336,
//                         470.5502624511719,
//                         203.5855712890625
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.31062301993370056,
//                     "bbox": [
//                         480.0865783691406,
//                         0,
//                         597.1792602539062,
//                         50.915618896484375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 294,
//             "timestamp": 10.838762523900574,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.660672128200531,
//                     "bbox": [
//                         482.875732421875,
//                         0,
//                         610.3294067382812,
//                         61.599876403808594
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.426986426115036,
//                     "bbox": [
//                         634.3466796875,
//                         120.10999298095703,
//                         694.9833984375,
//                         165.45069885253906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 295,
//             "timestamp": 10.875629063097515,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5415706634521484,
//                     "bbox": [
//                         495.7677917480469,
//                         0,
//                         621.8964233398438,
//                         77.97834777832031
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4655275046825409,
//                     "bbox": [
//                         339.98321533203125,
//                         104.85182189941406,
//                         481.6846923828125,
//                         282.5857238769531
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.26449424028396606,
//                     "bbox": [
//                         647.832763671875,
//                         147.62135314941406,
//                         720.1356811523438,
//                         202.16806030273438
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 296,
//             "timestamp": 10.912495602294456,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5430450439453125,
//                     "bbox": [
//                         495.7510070800781,
//                         0,
//                         621.9191284179688,
//                         77.99079895019531
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4654540419578552,
//                     "bbox": [
//                         339.9775390625,
//                         104.88661193847656,
//                         481.95111083984375,
//                         282.6665344238281
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2645455300807953,
//                     "bbox": [
//                         647.7824096679688,
//                         147.61691284179688,
//                         720.1728515625,
//                         202.1893310546875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 297,
//             "timestamp": 10.949362141491395,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6548961400985718,
//                     "bbox": [
//                         495.2392272949219,
//                         11.840087890625,
//                         632.7571411132812,
//                         96.54615783691406
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2894531786441803,
//                     "bbox": [
//                         672.7896118164062,
//                         188.9447784423828,
//                         743.2127075195312,
//                         238.07037353515625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 298,
//             "timestamp": 10.986228680688336,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6922876834869385,
//                     "bbox": [
//                         501.0364685058594,
//                         23.702730178833008,
//                         650.3219604492188,
//                         122.56110382080078
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3053394854068756,
//                     "bbox": [
//                         691.0261840820312,
//                         231.1240997314453,
//                         772.88427734375,
//                         289.9728698730469
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.25762131810188293,
//                     "bbox": [
//                         548.4464111328125,
//                         0,
//                         584.6902465820312,
//                         19.645061492919922
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 299,
//             "timestamp": 11.023095219885278,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5470308661460876,
//                     "bbox": [
//                         507.8486328125,
//                         33.680908203125,
//                         668.9683837890625,
//                         151.3814239501953
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4397258460521698,
//                     "bbox": [
//                         555.33447265625,
//                         2.329026699066162,
//                         596.3793334960938,
//                         32.73926544189453
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.31712445616722107,
//                     "bbox": [
//                         590.3349609375,
//                         172.84271240234375,
//                         653.9832763671875,
//                         218.5740966796875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 300,
//             "timestamp": 11.059961759082219,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.25285398960113525,
//                     "bbox": [
//                         563.4385375976562,
//                         56.056888580322266,
//                         697.3533935546875,
//                         179.9002685546875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 303,
//             "timestamp": 11.17056137667304,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4523574113845825,
//                     "bbox": [
//                         602.6546630859375,
//                         61.115814208984375,
//                         658.2907104492188,
//                         101.57987976074219
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.3130398392677307,
//                     "bbox": [
//                         718.7344970703125,
//                         233.98544311523438,
//                         834.35595703125,
//                         388.6319580078125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 304,
//             "timestamp": 11.207427915869982,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.45493409037590027,
//                     "bbox": [
//                         602.6273803710938,
//                         61.11308670043945,
//                         658.2698974609375,
//                         101.57888793945312
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.31107297539711,
//                     "bbox": [
//                         718.7308349609375,
//                         233.973876953125,
//                         834.3192138671875,
//                         388.703857421875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 305,
//             "timestamp": 11.244294455066921,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5624428987503052,
//                     "bbox": [
//                         621.1799926757812,
//                         81.71267700195312,
//                         678.7726440429688,
//                         125.93783569335938
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 310,
//             "timestamp": 11.428627151051625,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.3248355984687805,
//                     "bbox": [
//                         142.53274536132812,
//                         28.639070510864258,
//                         399.2803039550781,
//                         472.9085388183594
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 314,
//             "timestamp": 11.576093307839388,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.4501189589500427,
//                     "bbox": [
//                         175.83872985839844,
//                         126.51799774169922,
//                         386.9326477050781,
//                         491.7948913574219
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 315,
//             "timestamp": 11.612959847036329,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.42709627747535706,
//                     "bbox": [
//                         169.15248107910156,
//                         140.41453552246094,
//                         381.5420837402344,
//                         494.59490966796875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 316,
//             "timestamp": 11.64982638623327,
//             "detections": [
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.5046037435531616,
//                     "bbox": [
//                         161.46475219726562,
//                         160.15167236328125,
//                         365.75616455078125,
//                         496.55560302734375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 318,
//             "timestamp": 11.72355946462715,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4923383295536041,
//                     "bbox": [
//                         271.2647705078125,
//                         4.0192060470581055,
//                         361.49462890625,
//                         61.95143508911133
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3966139554977417,
//                     "bbox": [
//                         159.84014892578125,
//                         291.23663330078125,
//                         317.2783508300781,
//                         496.6479187011719
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 319,
//             "timestamp": 11.760426003824092,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6192743182182312,
//                     "bbox": [
//                         258.18780517578125,
//                         5.969701290130615,
//                         363.10882568359375,
//                         75.36262512207031
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 320,
//             "timestamp": 11.797292543021033,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5996142625808716,
//                     "bbox": [
//                         257.93524169921875,
//                         26.440593719482422,
//                         361.8912353515625,
//                         91.0187759399414
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 321,
//             "timestamp": 11.834159082217974,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.608612060546875,
//                     "bbox": [
//                         244.11175537109375,
//                         35.65415954589844,
//                         360.2745666503906,
//                         106.48238372802734
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 322,
//             "timestamp": 11.871025621414914,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.30057886242866516,
//                     "bbox": [
//                         240.75025939941406,
//                         53.47393035888672,
//                         357.41107177734375,
//                         129.87054443359375
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2915758192539215,
//                     "bbox": [
//                         79.74128723144531,
//                         276.2362060546875,
//                         298.5888366699219,
//                         496.1822204589844
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 323,
//             "timestamp": 11.907892160611855,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2668759524822235,
//                     "bbox": [
//                         227.71209716796875,
//                         78.24295043945312,
//                         352.7230529785156,
//                         153.07086181640625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 361,
//             "timestamp": 13.308820650095603,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.37280362844467163,
//                     "bbox": [
//                         321.95184326171875,
//                         200.60153198242188,
//                         384.4208068847656,
//                         267.5150146484375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 365,
//             "timestamp": 13.456286806883366,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.30056971311569214,
//                     "bbox": [
//                         195.20513916015625,
//                         281.8498229980469,
//                         279.19232177734375,
//                         495.1102600097656
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 393,
//             "timestamp": 14.488549904397706,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2626212537288666,
//                     "bbox": [
//                         226.68905639648438,
//                         0,
//                         293.83197021484375,
//                         49.92922592163086
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 403,
//             "timestamp": 14.857215296367112,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8220202326774597,
//                     "bbox": [
//                         490.08404541015625,
//                         2.389285087585449,
//                         676.2567749023438,
//                         152.5452880859375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 404,
//             "timestamp": 14.894081835564053,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6923127770423889,
//                     "bbox": [
//                         493.73992919921875,
//                         13.967255592346191,
//                         710.8101806640625,
//                         192.50491333007812
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 405,
//             "timestamp": 14.930948374760995,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8625210523605347,
//                     "bbox": [
//                         499.45330810546875,
//                         28.041303634643555,
//                         745.7889404296875,
//                         240.1855926513672
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 406,
//             "timestamp": 14.967814913957936,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.31251558661460876,
//                     "bbox": [
//                         521.3902587890625,
//                         48.66615676879883,
//                         754.1307983398438,
//                         289.2188415527344
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 407,
//             "timestamp": 15.004681453154875,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3423250913619995,
//                     "bbox": [
//                         533.3717041015625,
//                         70.60513305664062,
//                         781.0943603515625,
//                         358.8106384277344
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 416,
//             "timestamp": 15.336480305927342,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.33032655715942383,
//                     "bbox": [
//                         713.83154296875,
//                         29.01985740661621,
//                         766.6528930664062,
//                         66.2130355834961
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 435,
//             "timestamp": 16.036944550669215,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7295562624931335,
//                     "bbox": [
//                         466.4070739746094,
//                         0,
//                         577.1325073242188,
//                         43.443843841552734
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 436,
//             "timestamp": 16.073811089866158,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7274389863014221,
//                     "bbox": [
//                         466.4761657714844,
//                         0,
//                         577.264892578125,
//                         43.43314743041992
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 437,
//             "timestamp": 16.110677629063098,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6397338509559631,
//                     "bbox": [
//                         474.1194763183594,
//                         8.386923789978027,
//                         588.083984375,
//                         57.09031295776367
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 438,
//             "timestamp": 16.147544168260037,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5029639601707458,
//                     "bbox": [
//                         480.9122619628906,
//                         21.90147590637207,
//                         609.276611328125,
//                         76.2151870727539
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 440,
//             "timestamp": 16.22127724665392,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6134033799171448,
//                     "bbox": [
//                         473.3517150878906,
//                         3.309331178665161,
//                         634.6119384765625,
//                         128.7653350830078
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.26872649788856506,
//                     "bbox": [
//                         503.0553283691406,
//                         54.1655158996582,
//                         647.7987670898438,
//                         124.44371795654297
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 441,
//             "timestamp": 16.258143785850862,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6517032384872437,
//                     "bbox": [
//                         479.53485107421875,
//                         17.4591007232666,
//                         652.4605712890625,
//                         154.36680603027344
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3476722836494446,
//                     "bbox": [
//                         480.4901428222656,
//                         17.730113983154297,
//                         555.1119995117188,
//                         87.92962646484375
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2577340602874756,
//                     "bbox": [
//                         575.846923828125,
//                         0,
//                         634.390380859375,
//                         33.573890686035156
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 442,
//             "timestamp": 16.2950103250478,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5812441110610962,
//                     "bbox": [
//                         488.61968994140625,
//                         27.949241638183594,
//                         647.2005615234375,
//                         189.78041076660156
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 443,
//             "timestamp": 16.33187686424474,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7850785255432129,
//                     "bbox": [
//                         489.80804443359375,
//                         42.564170837402344,
//                         695.574462890625,
//                         238.33389282226562
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.42893922328948975,
//                     "bbox": [
//                         587.619384765625,
//                         17.666927337646484,
//                         673.2963256835938,
//                         68.53897857666016
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.40997347235679626,
//                     "bbox": [
//                         605.79443359375,
//                         24.076152801513672,
//                         674.552490234375,
//                         67.44223022460938
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.2550354301929474,
//                     "bbox": [
//                         498.1512451171875,
//                         51.126773834228516,
//                         582.869384765625,
//                         130.6688995361328
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 444,
//             "timestamp": 16.368743403441684,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7862412929534912,
//                     "bbox": [
//                         489.766845703125,
//                         42.55479049682617,
//                         695.6041870117188,
//                         238.41966247558594
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4287189245223999,
//                     "bbox": [
//                         587.323486328125,
//                         17.606800079345703,
//                         673.32373046875,
//                         68.56893157958984
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4141976833343506,
//                     "bbox": [
//                         604.2913208007812,
//                         22.986169815063477,
//                         673.6162719726562,
//                         67.45674133300781
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.25552794337272644,
//                     "bbox": [
//                         498.117431640625,
//                         51.1037483215332,
//                         582.893798828125,
//                         130.67965698242188
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 445,
//             "timestamp": 16.405609942638623,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.40239885449409485,
//                     "bbox": [
//                         624.34765625,
//                         42.26570510864258,
//                         694.3145141601562,
//                         87.48696899414062
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 446,
//             "timestamp": 16.442476481835563,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.37756970524787903,
//                     "bbox": [
//                         586.789306640625,
//                         28.282529830932617,
//                         711.8825073242188,
//                         114.19112396240234
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 447,
//             "timestamp": 16.479343021032506,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3851746618747711,
//                     "bbox": [
//                         672.88525390625,
//                         89.16285705566406,
//                         741.2627563476562,
//                         138.2685546875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 448,
//             "timestamp": 16.516209560229445,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.46535560488700867,
//                     "bbox": [
//                         695.2943115234375,
//                         116.5006103515625,
//                         768.7696533203125,
//                         172.57830810546875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 449,
//             "timestamp": 16.553076099426388,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3838355839252472,
//                     "bbox": [
//                         732.139892578125,
//                         149.61277770996094,
//                         806.121826171875,
//                         212.5139617919922
//                     ]
//                 },
//                 {
//                     "class": "Alligator Crack",
//                     "confidence": 0.25279346108436584,
//                     "bbox": [
//                         145.19093322753906,
//                         224.0437469482422,
//                         268.2355651855469,
//                         379.7183532714844
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 450,
//             "timestamp": 16.589942638623327,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.49601778388023376,
//                     "bbox": [
//                         760.4161376953125,
//                         191.71688842773438,
//                         835.4268188476562,
//                         258.6006164550781
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 452,
//             "timestamp": 16.66367571701721,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.3931039869785309,
//                     "bbox": [
//                         515.6826171875,
//                         61.21518325805664,
//                         733.366943359375,
//                         389.5910949707031
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 453,
//             "timestamp": 16.70054225621415,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.35908380150794983,
//                     "bbox": [
//                         524.3074951171875,
//                         99.79105377197266,
//                         749.0623779296875,
//                         433.07977294921875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 454,
//             "timestamp": 16.73740879541109,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.4780355393886566,
//                     "bbox": [
//                         543.5136108398438,
//                         134.218505859375,
//                         726.3901977539062,
//                         435.8263854980469
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 455,
//             "timestamp": 16.77427533460803,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.46500641107559204,
//                     "bbox": [
//                         559.1097412109375,
//                         182.4520263671875,
//                         712.4160766601562,
//                         418.1170349121094
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 456,
//             "timestamp": 16.81114187380497,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.25888147950172424,
//                     "bbox": [
//                         486.64996337890625,
//                         13.6873197555542,
//                         740.515380859375,
//                         451.3258972167969
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.25510600209236145,
//                     "bbox": [
//                         583.1470947265625,
//                         231.23814392089844,
//                         738.3352661132812,
//                         450.1353759765625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 457,
//             "timestamp": 16.848008413001914,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.28664639592170715,
//                     "bbox": [
//                         565.2017211914062,
//                         194.11065673828125,
//                         693.8455200195312,
//                         418.28680419921875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 458,
//             "timestamp": 16.884874952198853,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.2765471339225769,
//                     "bbox": [
//                         565.7261962890625,
//                         194.5537567138672,
//                         694.1173706054688,
//                         417.6068420410156
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.2529132664203644,
//                     "bbox": [
//                         462.5509033203125,
//                         0,
//                         549.2413940429688,
//                         137.081298828125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 459,
//             "timestamp": 16.921741491395792,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.2943328320980072,
//                     "bbox": [
//                         586.8069458007812,
//                         236.6278076171875,
//                         704.1163330078125,
//                         461.7101745605469
//                     ]
//                 },
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.25778624415397644,
//                     "bbox": [
//                         471.4845886230469,
//                         6.32767915725708,
//                         690.2940673828125,
//                         447.36126708984375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 460,
//             "timestamp": 16.958608030592735,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.2540445029735565,
//                     "bbox": [
//                         530.1859741210938,
//                         112.73853302001953,
//                         654.3101196289062,
//                         390.0484619140625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 461,
//             "timestamp": 16.995474569789675,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.27572906017303467,
//                     "bbox": [
//                         534.9570922851562,
//                         132.48252868652344,
//                         673.7989501953125,
//                         414.72064208984375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 462,
//             "timestamp": 17.032341108986618,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.4761399030685425,
//                     "bbox": [
//                         539.2582397460938,
//                         165.13827514648438,
//                         634.412109375,
//                         321.88507080078125
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.25217491388320923,
//                     "bbox": [
//                         624.0578002929688,
//                         103.426513671875,
//                         691.1151733398438,
//                         162.5747833251953
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 463,
//             "timestamp": 17.069207648183557,
//             "detections": [
//                 {
//                     "class": "Longitudinal Crack",
//                     "confidence": 0.5211148858070374,
//                     "bbox": [
//                         562.2507934570312,
//                         213.71055603027344,
//                         671.8721313476562,
//                         426.57208251953125
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.34349432587623596,
//                     "bbox": [
//                         646.6343994140625,
//                         135.1101531982422,
//                         718.9463500976562,
//                         202.47792053222656
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 464,
//             "timestamp": 17.106074187380496,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7031811475753784,
//                     "bbox": [
//                         443.59320068359375,
//                         0,
//                         508.886474609375,
//                         46.00497055053711
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 465,
//             "timestamp": 17.14294072657744,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7584013938903809,
//                     "bbox": [
//                         448.6665954589844,
//                         0,
//                         520.4296264648438,
//                         67.16496276855469
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 466,
//             "timestamp": 17.17980726577438,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7594532370567322,
//                     "bbox": [
//                         448.64111328125,
//                         0,
//                         520.4650268554688,
//                         67.20700073242188
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 467,
//             "timestamp": 17.216673804971318,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7915766835212708,
//                     "bbox": [
//                         455.9377746582031,
//                         13.188552856445312,
//                         532.3128662109375,
//                         85.92950439453125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 468,
//             "timestamp": 17.25354034416826,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7372817993164062,
//                     "bbox": [
//                         460.7380676269531,
//                         27.115610122680664,
//                         547.5372314453125,
//                         111.25275421142578
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.41127631068229675,
//                     "bbox": [
//                         538.591552734375,
//                         4.290502548217773,
//                         576.006591796875,
//                         30.885234832763672
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 469,
//             "timestamp": 17.2904068833652,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6693834662437439,
//                     "bbox": [
//                         466.3897399902344,
//                         42.63930130004883,
//                         564.9407958984375,
//                         134.88937377929688
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.4077812731266022,
//                     "bbox": [
//                         549.3870239257812,
//                         18.426137924194336,
//                         585.9325561523438,
//                         44.33855056762695
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 470,
//             "timestamp": 17.327273422562143,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6991727948188782,
//                     "bbox": [
//                         479.7704162597656,
//                         67.09950256347656,
//                         581.2954711914062,
//                         170.7694854736328
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.5724664926528931,
//                     "bbox": [
//                         559.1219482421875,
//                         33.77083969116211,
//                         602.6090698242188,
//                         63.152496337890625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 471,
//             "timestamp": 17.364139961759083,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7800707817077637,
//                     "bbox": [
//                         488.0390625,
//                         89.67977905273438,
//                         600.1482543945312,
//                         216.18577575683594
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.41532787680625916,
//                     "bbox": [
//                         573.1697998046875,
//                         50.67591094970703,
//                         622.139892578125,
//                         85.92756652832031
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 472,
//             "timestamp": 17.401006500956022,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7306355834007263,
//                     "bbox": [
//                         502.3198547363281,
//                         115.16516876220703,
//                         624.2133178710938,
//                         271.8089599609375
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.42414548993110657,
//                     "bbox": [
//                         590.9931030273438,
//                         73.2260971069336,
//                         641.4608764648438,
//                         111.38811492919922
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 474,
//             "timestamp": 17.474739579349905,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3002723753452301,
//                     "bbox": [
//                         634.654296875,
//                         132.1830596923828,
//                         693.0577392578125,
//                         175.9195098876953
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 475,
//             "timestamp": 17.511606118546844,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.30461135506629944,
//                     "bbox": [
//                         634.5741577148438,
//                         132.0996856689453,
//                         693.0907592773438,
//                         176.019775390625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 476,
//             "timestamp": 17.548472657743787,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.538241446018219,
//                     "bbox": [
//                         490.7758483886719,
//                         4.399581432342529,
//                         601.1460571289062,
//                         66.72911071777344
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 477,
//             "timestamp": 17.585339196940726,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6634307503700256,
//                     "bbox": [
//                         499.82586669921875,
//                         15.829712867736816,
//                         619.4111938476562,
//                         90.15880584716797
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 478,
//             "timestamp": 17.62220573613767,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7531185746192932,
//                     "bbox": [
//                         509.76849365234375,
//                         31.28034019470215,
//                         635.5430908203125,
//                         117.5047378540039
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 479,
//             "timestamp": 17.65907227533461,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.7891994118690491,
//                     "bbox": [
//                         524.798828125,
//                         44.43867874145508,
//                         661.4362182617188,
//                         150.47689819335938
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 480,
//             "timestamp": 17.695938814531548,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8138000965118408,
//                     "bbox": [
//                         537.4807739257812,
//                         65.56671905517578,
//                         687.5739135742188,
//                         193.14015197753906
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 481,
//             "timestamp": 17.73280535372849,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8126456141471863,
//                     "bbox": [
//                         537.4517211914062,
//                         65.58992767333984,
//                         687.5075073242188,
//                         193.14627075195312
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 482,
//             "timestamp": 17.76967189292543,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8269660472869873,
//                     "bbox": [
//                         554.4049072265625,
//                         92.929443359375,
//                         714.7206420898438,
//                         235.55320739746094
//                     ]
//                 },
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.351170152425766,
//                     "bbox": [
//                         746.8963623046875,
//                         183.63140869140625,
//                         825.5537109375,
//                         269.0177917480469
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 483,
//             "timestamp": 17.80653843212237,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8723962306976318,
//                     "bbox": [
//                         573.9964599609375,
//                         122.55030059814453,
//                         750.5581665039062,
//                         292.2371826171875
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 484,
//             "timestamp": 17.843404971319313,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8964378237724304,
//                     "bbox": [
//                         597.6010131835938,
//                         161.11769104003906,
//                         784.4108276367188,
//                         375.6562194824219
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 485,
//             "timestamp": 17.880271510516252,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.8884211778640747,
//                     "bbox": [
//                         622.4812622070312,
//                         202.24871826171875,
//                         823.22705078125,
//                         415.2353820800781
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 486,
//             "timestamp": 17.917138049713195,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.60806804895401,
//                     "bbox": [
//                         662.5418701171875,
//                         237.8470458984375,
//                         854.2188110351562,
//                         452.06549072265625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 487,
//             "timestamp": 17.954004588910134,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.45368918776512146,
//                     "bbox": [
//                         699.6710815429688,
//                         301.42620849609375,
//                         830.294921875,
//                         455.06060791015625
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 488,
//             "timestamp": 17.990871128107074,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.30460992455482483,
//                     "bbox": [
//                         349.4503479003906,
//                         194.80331420898438,
//                         416.94573974609375,
//                         275.10919189453125
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 489,
//             "timestamp": 18.027737667304017,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.3240298330783844,
//                     "bbox": [
//                         349.3585205078125,
//                         194.23355102539062,
//                         417.276123046875,
//                         275.3797302246094
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 510,
//             "timestamp": 18.801934990439772,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.436328262090683,
//                     "bbox": [
//                         310.5426330566406,
//                         187.68231201171875,
//                         584.9066772460938,
//                         288.8333740234375
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 520,
//             "timestamp": 19.170600382409177,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.36117440462112427,
//                     "bbox": [
//                         506.5670166015625,
//                         0,
//                         546.9337158203125,
//                         15.467458724975586
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 521,
//             "timestamp": 19.20746692160612,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.6686721444129944,
//                     "bbox": [
//                         510.88531494140625,
//                         1.3057363033294678,
//                         558.159912109375,
//                         28.48773956298828
//                     ]
//                 }
//             ]
//         },
//         {
//             "frame": 522,
//             "timestamp": 19.24433346080306,
//             "detections": [
//                 {
//                     "class": "Potholes",
//                     "confidence": 0.668377161026001,
//                     "bbox": [
//                         510.88934326171875,
//                         1.3048169612884521,
//                         558.1532592773438,
//                         28.488767623901367
//                     ]
//                 }
//             ]
//         }
//     ]
// }
