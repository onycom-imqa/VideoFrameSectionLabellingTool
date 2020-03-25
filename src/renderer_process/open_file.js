import { ipcRenderer } from "electron";
import fs from "fs";

import globalJSONFile from "../model/globalJSONFile";
import jsonFile from "../model/jsonFile";

import tagControl from "../helpers/tag_control";
import validation from "../helpers/validation";
import jsonControl from "../helpers/json_control";

const selectJsonBtn = document.getElementById("open-json");
const jsonFileContainer = document.getElementById("json-file-container");
const videoFilesContainer = document.getElementById("video-files-container");

selectJsonBtn.addEventListener("click", (event) => {
  ipcRenderer.send("open-file-dialog");
})

ipcRenderer.on("selected-file", (event, pathArr) => {
  const path = pathArr[0];
  const fileName = getFileName(path);

  tagControl.initialize(jsonFileContainer);

  selectJsonBtn.innerHTML = `${fileName}`;

  const openJSONFileContent = readJSONFile(path);
  const JSONFile = new jsonFile(openJSONFileContent);

  // Validate JSON
  if (validation.validationValue(openJSONFileContent)) {
    alert("유효한 JSON 파일 입니다.");

    const GlobalJSONFile = new globalJSONFile();
    GlobalJSONFile.setPATH(path);
    GlobalJSONFile.setNAME(fileName);

    showFileList(JSONFile.videos);

    jsonControl.markingDirectoryVideoFile(videoFilesContainer, jsonFileContainer);
  } else {
    alert("유효하지 않은 JSON 파일 입니다.");
    return;
  }
})

const showFileList = (videos) => {
  videos.forEach((video) => {
    const videoTitle = video.title;

    const videoTitleTag = tagControl.createNameTag("span","completed-video-title", "", "", videoTitle, videoTitle);

    jsonFileContainer.appendChild(videoTitleTag);
    jsonFileContainer.appendChild(document.createElement("br"));
  })
}

const readJSONFile = (path) => {
  return JSON.parse(fs.readFileSync(path));
}

const getFileName = (path) => {
  const pathElement = path.split("/");

  return pathElement[pathElement.length - 1];
}
