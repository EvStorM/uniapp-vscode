/*
 * @Date: 2021-07-26 18:58:47
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-28 00:21:29
 * @Description:
 * @FilePath: /src/plugin/getTagAtPosition/getJsTag.ts
 */
/******************************************************************
MIT License http://www.opensource.org/licenses/mit-license.php
Author Mora <qiuzhongleiabc^126.com> (https://github.com/qiu8310)
*******************************************************************/

import { TextDocument, Position } from "vscode";
// import { Tag, getAttrs } from "./base";
interface funcName {
  name: string;
  index: number;
}
const SINGLE_LINE_REGEXP = /^uni.([a-zA-Z]+)\(/;
const END_REGEXP = /^\}\)/;
export function getJsTagFunc(
  doc: TextDocument,
  pos: Position
): null | funcName {
  let line = doc.lineAt(pos.line).text.trim();
  let index = pos.character;
  // 处理uni.(xxxxxx)的匹配
  if (SINGLE_LINE_REGEXP.test(line)) {
    let name = RegExp.$1;
    return { name, index };
  } else {
    return null;
  }
}
export function getJsAPIFunc(
  doc: TextDocument,
  pos: Position
): null | funcName {
  let line = doc.lineAt(pos.line).text.trim();
  let index = pos.character;
  // 处理uni.(xxxxxx)的匹配
  if (SINGLE_LINE_REGEXP.test(line)) {
    let name = RegExp.$1;
    return { name, index };
  } else {
    let startLine = pos.line;
    let attrs: any = {};
    let name = searchUp(doc, startLine, attrs);
    if (!name) return null;
    // 判断是否是在函数的传参之中
    if (!searchDown(doc, startLine + 1, attrs)) return null;
    return { name, index };
  }
}
function searchUp(
  doc: TextDocument,
  lineNum: number,
  attrs: { [key: string]: any }
) {
  let name = "";
  let atEnd = null;
  while (lineNum >= 0 && !name && atEnd === null) {
    let text = doc.lineAt(lineNum).text.trim();
    if (text) {
      if (END_REGEXP.test(text)) {
        atEnd = false;
      } else if (SINGLE_LINE_REGEXP.test(text)) {
        name = RegExp.$1;
      }
    }
    lineNum--;
  }
  return name;
}
function searchDown(
  doc: TextDocument,
  lineNum: number,
  attrs: { [key: string]: any }
) {
  let atEnd = null;
  while (lineNum < doc.lineCount && atEnd === null) {
    let text = doc.lineAt(lineNum).text.trim();
    if (text) {
      // 匹配到下一个uni函数
      if (SINGLE_LINE_REGEXP.test(text)) {
        atEnd = false;
      } else if (END_REGEXP.test(text)) {
        atEnd = true;
      }
    }
    lineNum++;
  }
  return atEnd;
}
