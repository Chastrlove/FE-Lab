#!/usr/bin/env node

const babel = require("@babel/core");
const { join, dirname: dirName } = require("path");
const { readdirSync, writeFileSync, existsSync, statSync, mkdirSync: fsMkdirSync, realpathSync } = require("fs");
const appDirectory = realpathSync(process.cwd());

// const argv = require("yargs").argv
const argv = {path:'./fixture'};

const { path: fileDir } = argv;

const inputDir = join(__dirname,fileDir);
const outputDir = join(appDirectory, "babel");

function mkdirSync(dirname) {
    //递归创建文件目录
    if (existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(dirName(dirname))) {
            fsMkdirSync(dirname);
            return true;
        }
    }
    return false;
}

function readFileList(dir, filesList = []) {
    const files = readdirSync(dir);
    files.forEach((item, index) => {
        const fullPath = join(dir, item);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
            readFileList(join(dir, item), filesList); //递归读取文件
        } else {
            filesList.push(fullPath);
        }
    });
    return filesList;
}

const babelFile = (file, inputDir, outputDir) => {
    const relateFilePath = file.replace(inputDir, "");
    const outFilePath = join(outputDir, relateFilePath);
    babel
        .transformFileAsync(file, {
            babelrc: true,
            parserOpts:{
                plugins:['jsx',"typescript"]
            }
        })
        .then((res) => {
            mkdirSync(dirName(outFilePath));
            writeFileSync(outFilePath, res.code);
        });
};

const filesList = [];

readFileList(inputDir, filesList);

filesList.forEach((file) => {
    babelFile(file, inputDir, outputDir);
});
