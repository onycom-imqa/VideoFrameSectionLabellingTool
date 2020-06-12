import { remote } from "electron";

import videoCapture from "../../../../../helpers/video/videoCapture";

import jsonControl from "../../../../../helpers/json/json_control";

import mainViewContainer from "../../../frame/main/mainViewContainer";
import frameListContainer from "../../../frame/list/frameListContainer";
import resultContainer from "../../result/resultContainer";

import globalVideoData from "../../../../../model/global/globalVideoData";
import globalFrame from "../../../../../model/global/globalFrame";
import JSONFileDTO from "../../../../../model/dto/JSONFile";

const videoFilesContainerTag = document.getElementById("video-files-container");

videoFilesContainerTag.onclick = async (event) => {

  if (event.target.className != "video-file") {
    return false;
  }

  if (!confirm(`'${event.target.dataset.title}' 에 대한 작업을 시작하시겠습니까? \n` +
    `(작업 시작 시, 비디오 제원에 대한 미리보기는 중단 됩니다.)`)) {
    return false;
  }

  const title = event.target.dataset.title;

  const JSONFileObj = new JSONFileDTO();
  const JSONFileVideoList = JSONFileObj.getVideos();

  if (JSONFileVideoList.length > 0 && jsonControl.hasVideoData(JSONFileVideoList, title)) {
    alert("동일한 비디오에 대한 데이터가 존재 합니다.");
    return false;
  }

  mainViewContainer.initialize();
  frameListContainer.initialize();
  resultContainer.initialize();

  const mainViewImageWidth = document.querySelector("#main-view-image").clientWidth;
  const hiddenVideo = document.querySelector("#hidden-video").clientWidth;

  const path = event.target.dataset.path;
  
  const GlobalVideoData = new globalVideoData();
  GlobalVideoData.setPATH(path);
  GlobalVideoData.setTITLE(title);
  
  const GlobalFrame = new globalFrame();
  GlobalFrame.setAT(0);
  
  const video = mainViewContainer.getVideoTag(path);
  
  mainViewContainer.setMainFrameRate(video);
  
  const viewWidth = (mainViewImageWidth == 0 ? hiddenVideo : mainViewImageWidth);

  const videoCaptureList = videoCapture.extractFrames(path, viewWidth);
  
  GlobalFrame.setLENGTH(videoCaptureList.length);
  
  frameListContainer.showFrameList(videoCaptureList);
  
  document.getElementById("main-view-image").hidden = false;
  document.getElementById("hidden-video").hidden = true;

  remote.getGlobal("sharedObject").COMPLETE_FLAG = false;

  return true;
}

videoFilesContainerTag.onmouseover = (event) => {

  // 'COMPLETE' 완료 시, 비디오 제원 미리보기 기능 활성화.
  if (!remote.getGlobal("sharedObject").COMPLETE_FLAG) {
    return false;
  }

  // 비디오 파일 명 위에 마우스 포인터 위치 시 제원 보여주기.
  if (event.target.className != "video-file") {
    return false;
  }

  // 비디오 제원 : '파일명', '재생 시간', 'FPS', '프레임 수'
  mainViewContainer.showVideoInfo(event);

  return true;
}

videoFilesContainerTag.onmouseleave = () => {

  // 'COMPLETE' 완료 시, 비디오 제원 미리보기 기능 활성화.
  if (!remote.getGlobal("sharedObject").COMPLETE_FLAG) {
    return false;
  }

  mainViewContainer.initVideoInfo();

  return true;
}