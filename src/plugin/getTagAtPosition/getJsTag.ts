/*
 * @Date: 2021-07-26 18:58:47
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-28 14:29:42
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
  Start?: number;
  end?: number;
  amount?: number;
  atend?: boolean | null;
}
const SINGLE_LINE_REGEXP = /^uni.([a-zA-Z]+)\(/;
const END_REGEXP = /\}\)/;
let codeBlockStart = 0;
let codeBlockEnd = 0;
let amount = 0;
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
  codeBlockStart = 0;
  codeBlockEnd = 0;
  amount = 0;
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
    if (!name || amount !== 0) return null;
    // 判断是否是在函数的传参之中
    let atend = searchDown(doc, startLine + 1, attrs);
    if (atend) return null;
    return { name, index };
  }
}
function searchUp(
  doc: TextDocument,
  lineNum: number,
  attrs: { [key: string]: any }
) {
  let name = "";
  while (lineNum >= 0 && !name) {
    let text = doc.lineAt(lineNum).text.trim();
    if (text) {
      if (SINGLE_LINE_REGEXP.test(text)) {
        name = RegExp.$1;
      } else {
        if (/\}/.test(text)) {
          codeBlockEnd++;
        }
        if (/\{/.test(text)) {
          codeBlockStart++;
          amount = codeBlockEnd - codeBlockStart;
        }
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
      if (/\{/.test(text)) {
        codeBlockStart++;
      }
      if (/\}/.test(text)) {
        codeBlockEnd++;
        amount = codeBlockStart - codeBlockEnd;
      }
      if (END_REGEXP.test(text) && amount === 0) {
        atEnd = true;
      }
    }
    lineNum++;
  }
  return atEnd;
}
