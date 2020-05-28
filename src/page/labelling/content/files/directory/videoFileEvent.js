import { remote } from "electron";

import videoCapture from "../../../../../helpers/video/videoCapture";

import jsonControl from "../../../../../helpers/json/json_control";

import mainViewContainer from "../../main/mainViewContainer";
import frameListContainer from "../../control1/frame/frameListContainer";
import labellingContainer from "../../control2/complete/labellingContainer";

import globalVideoData from "../../../../../model/global/globalVideoData";
import globalFrame from "../../../../../model/global/globalFrame";
import jsonFileDTO from "../../../../../model/dto/jsonFile";

const videoFilesContainer = document.getElementById("video-files-container");

videoFilesContainer.onclick = async (event) => {
  if (event.target.className == "video-file") {

    const title = event.target.dataset.title;

    document.getElementById("video-title").innerText = title;

    const path = event.target.dataset.path;

    const jsonFilePath = remote.getGlobal("sharedObject").JSON_FILE.PATH;
    const result = jsonControl.getJSONFile(jsonFilePath);

    if (!result.result) {
      alert("Error json file load");
      return;
    }

    const JSONContent = new jsonFileDTO(result.content);
    const JSONVideos = JSONContent.getVideos();

    if (JSONVideos.length > 0) {
      if (jsonControl.hasVideoData(JSONVideos, title)) {
        alert("동일한 비디오에 대한 데이터가 존재 합니다.");
        return;
      }
    }

    mainViewContainer.initialize();
    frameListContainer.initialize();
    labellingContainer.initialize();

    const GlobalVideoData = new globalVideoData();
    GlobalVideoData.setPATH(path);
    GlobalVideoData.setTITLE(title);

    const GlobalFrame = new globalFrame();
    GlobalFrame.setAT(0);

    const video = mainViewContainer.getVideoTag(path);

    mainViewContainer.setMainFrameRate(video);

    // let startTime = new Date().getTime();

    // 위에 'main-view' 를 초기화하는 코드들 때문에, 변경사항이 전달되지 않는다.
    console.log("client width: ", document.querySelector(`img[id="main-view-image"]`).clientWidth);

    const videoCaptureList = videoCapture.extractFrames(path, document.querySelector(`img[id="main-view-image"]`).clientWidth);

    GlobalFrame.setLENGTH(videoCaptureList.length);

    videoCaptureList.forEach((captureImage, index) => {
      const imgData = videoCapture.convertImageToMat(captureImage);
      const canvasElement = frameListContainer.createCanvas(imgData, index);

      document.getElementById("frame-list-container").appendChild(canvasElement);
    })

    // let endTime = new Date().getTime();

    // console.log(endTime - startTime);
  }
}