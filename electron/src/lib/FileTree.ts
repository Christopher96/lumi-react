import React, { Component } from "react";
import * as fse from "fs-extra";
import * as path from "path";
import { Tree } from "./types";
import Meta from "antd/lib/card/Meta";

export default class FileTree {
  private isDirectory(path: string) {
    return fse.lstatSync(path).isDirectory();
  }

  private isFile(path: string) {
    return !fse.lstatSync(path).isDirectory();
  }

  private buildObject(filePath: string, indecies: number[]): Tree {
    return {
      isLeaf: true,
      key: indecies.join("-"),
      title: path.basename(filePath),
      icon: "T1",
    };
  }

  private recTree(dirPath: string, indecies: number[]): Tree {
    const allEntitiesInDir = fse
      .readdirSync(dirPath)
      .map((name) => path.join(dirPath, name));
    const dirs = allEntitiesInDir.filter(this.isDirectory);
    const files = allEntitiesInDir.filter(this.isFile);

    const children: Tree[] = [];

    let nrOfFiles = 0;
    for (const i in files) {
      children.push(
        this.buildObject(files[i], [...indecies, Number.parseInt(i)])
      );
      nrOfFiles++;
    }

    for (const i in dirs) {
      children.push(
        this.recTree(dirs[i], [...indecies, nrOfFiles + Number.parseInt(i)])
      );
    }

    return {
      isLeaf: false,
      children,
      key: indecies.join("-"),
      title: path.basename(dirPath),
      icon: "T2",
    };
  }

  public make(dir: string) {
    return [this.recTree(dir, [0])];
  }
}
