import { DeepAR } from "deepar";
/*
import deeparWasmPath from "deepar/wasm/deepar.wasm";
import faceTrackingModelPath from "deepar/models/face/models-68-extreme.bin";
import segmentationModelPath from "deepar/models/segmentation/segmentation-160x160-opt.bin";
import poseEstimationWasmPath from "deepar/wasm/libxzimgPoseEstimation.wasm";
import footDetectorPath from "deepar/models/foot/foot-detector-android.bin";
import footTrackerPath from "deepar/models/foot/foot-tracker-android.bin";
import footObjPath from "deepar/models/foot/foot-model.obj";
*/
import * as effects from "./effects";

const canvas = document.getElementById("deepar-canvas");
canvas.width = 1280;
canvas.height = 720;

var camSelect = document.querySelector("select#cam");
var videoInTag = document.querySelector("video#video-in");
var videoOutTag = document.querySelector("video#video-out");

window.startCamera = async function () {
  const cameraStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  videoInTag.srcObject = cameraStream;
  const outputStream = canvas.captureStream();
  console.log("captured stream: ", outputStream);
  videoOutTag.srcObject = outputStream;
};

const deepAR = new DeepAR({
  licenseKey:
    "4c023d48043cd1e7ff86b2e307c7304a4f0841c85ee2d7de9f835e6620db396d1aa277c8f8f0464c",
  deeparWasmPath: "http://localhost:3939/deepar.wasm",
  canvas,
  segmentationConfig: {
    modelPath: "http://localhost:3939/segmentation-160x160-opt.bin",
  },
  callbacks: {
    onInitialize: () => {
      // start video immediately after the initalization, mirror = true
      deepAR.setVideoElement(videoInTag);
      // or we can setup the video element externally and call deepAR.setVideoElement (see startExternalVideo function below)

      deepAR.switchEffect(
        0,
        "slot",
        "http://localhost:3939/effects/Snail.deepar",
        () => {
          // effect loaded
        }
      );
    },
  },
});

deepAR.callbacks.onCameraPermissionAsked = () => {
  console.log("camera permission asked");
};

deepAR.callbacks.onCameraPermissionGranted = () => {
  console.log("camera permission granted");
};

deepAR.callbacks.onCameraPermissionDenied = () => {
  console.log("camera permission denied");
};

deepAR.callbacks.onScreenshotTaken = (photo) => {
  console.log("screenshot taken " + photo);
};

deepAR.callbacks.onImageVisibilityChanged = (visible) => {
  console.log("image visible " + visible);
};

deepAR.callbacks.onFaceVisibilityChanged = (visible) => {
  console.log("face visible " + visible);
};

deepAR.callbacks.onError = (e, msg) => {
  console.error("deepAR error, message: ", message);
};

deepAR.downloadFaceTrackingModel("http://localhost:3939/models-68-extreme.bin");

let isRecording = false;
document.getElementById("recording-btn").onclick = (e) => {
  if (!isRecording) {
    isRecording = true;
    deepAR.startVideoRecording();
    console.log("Recording started!");
  } else {
    deepAR.finishVideoRecording((video) => {
      window.open(URL.createObjectURL(video), "_blank").focus();
      console.log("Recording finished!");
      isRecording = false;
    });
  }
};
