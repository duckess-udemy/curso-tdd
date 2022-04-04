const { compilerOptions } = require("./tsconfig.json");
const pathModule = require("path");
const { paths } = compilerOptions;
const fs = require("fs");
const path = require("path");

const isFolder = (fileName) => {
  return !fileName.match(/\./);
};

const isFile = (fileName) => {
  return fileName.match(/\./);
};

const concatPaths = (files, path) => {
  const result = [];
  for (let file of files) {
    result.push(pathModule.join(path, file));
  }
  return result;
};

const getFiles = (path, fileList = []) => {
  const fileNames = fs.readdirSync(path);
  const folders = fileNames.filter(isFolder);
  const files = fileNames.filter(isFile);

  for (let folder of folders) {
    const newPath = pathModule.join(path, folder);
    getFiles(newPath, fileList);
  }
  fileList.push(...concatPaths(files, path));
  return fileList;
};

const parse = (string) => {
  return string.replace(/\/\*$/, "");
};

const files = getFiles("./dist/src");

Object.entries(paths).forEach(([key, [value]]) => {
  const regex = new RegExp(`.*require\\("(${parse(key)}).*"\\)`, "gi");

  for (let file of files) {
    const fileData = fs.readFileSync(file);
    const newFile = fileData
      .toString()
      .replace(regex, (matchedResult, capturedGroup) => {
        const reg = new RegExp(capturedGroup);

        const dir = __dirname.replace(/\\/g, "/");
        return matchedResult
          .replace(reg, `${dir}/dist/${parse(value)}`)
          .replace(/\.ts$/, ".js");
      });
    const buffer = new Buffer.from(newFile);
    fs.writeFileSync(file, buffer, {
      flag: "w",
    });
  }
});
