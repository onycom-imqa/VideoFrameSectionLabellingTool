import fs from "fs";
import path from "path";

import criteriaContainer from "../../../../src/page/labelling/list/criteria/criteriaContainer";

const displayControl = () => {
  document.querySelector("#open-directory-page").style.display = "none";
  document.querySelector("#open-file-page").style.display = "none";
  document.querySelector("#form-criteria-page").style.display = "none";
  document.querySelector("#labelling-page").style.display = "";
}

const showCriterias = () => {
  displayControl();

  const resources = fs.readFileSync(path.join(__dirname, "../test/helpers/resources.json"));

  const jsonMockPath = JSON.parse(resources).json.criterias_only_json_mock;

  const jsonContents = fs.readFileSync(path.join(__dirname, jsonMockPath));
  const criterias = JSON.parse(jsonContents).criterias;

  Array.prototype.forEach.call(criterias, (criteria) => {
    const type = String.fromCharCode(criteria.type + 64);
    const text = criteria.text;

    criteriaContainer.setCheckbox(type, text);
  })
};

export default {
  showCriterias
}

