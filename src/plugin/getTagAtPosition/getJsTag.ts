/*
 * @Date: 2021-07-26 18:58:47
 * @LastEditors: E'vils
 * @LastEditTime: 2021-08-03 17:08:49
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
  attrs: { [key: string]: string | boolean };
  Start?: number;
  end?: number;
  amount?: number;
  atend?: boolean | null;
}
interface codeNum {
  codeBlockStart: number;
  codeBlockEnd: number;
  bracketsStart: number; //中括号
  singleQuotesStart: number; //单引号
  quotesStart: number; // 引号
  bracketsEnd: number;
  codeBlockAmount: number;
  bracketsAmount: number;
  singleQuotesAmount: number;
  quotesAmount: number;
  [key: string]: any; // 加这一行就好了
}

const SINGLE_LINE_REGEXP = /^uni.([a-zA-Z]+)\(/;
const END_REGEXP = /\}\)/;
let codeNum: codeNum = {
  codeBlockStart: 0,
  codeBlockEnd: 0,
  bracketsStart: 0, //中括号
  singleQuotesStart: 0, //单引号
  quotesStart: 0, // 引号
  bracketsEnd: 0,
  codeBlockAmount: 0,
  bracketsAmount: 0,
  singleQuotesAmount: 0,
  quotesAmount: 0,
};

export function getJsTagFunc(
  doc: TextDocument,
  pos: Position
): null | funcName {
  let line = doc.lineAt(pos.line).text.trim();
  let index = pos.character;
  // 处理uni.(xxxxxx)的匹配
  if (SINGLE_LINE_REGEXP.test(line)) {
    let name = RegExp.$1;
    return { name, attrs: {}, index };
  } else {
    return null;
  }
}
export function getJsAPIFunc(
  doc: TextDocument,
  pos: Position
): null | funcName {
  initcodeNum();
  let line = doc.lineAt(pos.line).text.trim();
  let index = pos.character;
  // 处理uni.(xxxxxx)的匹配
  if (SINGLE_LINE_REGEXP.test(line)) {
    let name = RegExp.$1;
    return { name, attrs: {}, index };
  } else {
    let startLine = pos.line;
    let name = searchUp(doc, startLine, index);
    if (
      !name ||
      codeNum.codeBlockAmount !== 0 ||
      codeNum.bracketsAmount !== 0 ||
      codeNum.singleQuotesAmount !== 0 ||
      codeNum.quotesAmount !== 0
    ) {
      return null;
    }
    // 判断是否是在函数的传参之中
    let atend = searchDown(doc, startLine + 1, index);
    if (atend) return null;
    return { name, attrs: {}, index };
  }
}
function searchUp(doc: TextDocument, lineNum: number, index: number) {
  let name = "";
  while (lineNum >= 0 && !name) {
    let text = doc.lineAt(lineNum).text.trim();
    let str = doc
      .lineAt(lineNum)
      .text.slice(0, index)
      .trim();
    if (text) {
      if (SINGLE_LINE_REGEXP.test(text)) {
        name = RegExp.$1;
      } else {
        codeAnalysis("{", "}", text, "codeBlock", true);
        codeQuotes('"', str, "quotes");
        codeQuotes("'", str, "singleQuotes");
        codeQuotes("]", str, "brackets", "[");
      }
    }
    lineNum--;
  }
  return name;
}
function searchDown(doc: TextDocument, lineNum: number, index: number) {
  let atEnd = null;
  while (lineNum < doc.lineCount && atEnd === null) {
    let text = doc.lineAt(lineNum).text.trim();
    if (text) {
      // if (/\{/.test(text)) {
      //   codeNum.codeBlockStart++;
      // }
      // if (/\}/.test(text)) {
      //   codeNum.codeBlockEnd++;
      //   codeNum.codeBlockAmount = codeNum.codeBlockStart - codeNum.codeBlockEnd;
      // }
      codeAnalysis("{", "}", text, "codeBlock", false);
      // codeAnalysis("[", "]", text, "brackets", false);
      if (END_REGEXP.test(text) && codeNum.codeBlockAmount === 0) {
        atEnd = true;
      }
    }
    lineNum++;
  }
  return atEnd;
}

function initcodeNum() {
  codeNum = {
    codeBlockStart: 0,
    codeBlockEnd: 0,
    bracketsStart: 0, //中括号
    singleQuotesStart: 0, //单引号
    quotesStart: 0, // 引号
    bracketsEnd: 0,
    codeBlockAmount: 0,
    bracketsAmount: 0,
    singleQuotesAmount: 0,
    quotesAmount: 0,
  };
}
function codeAnalysis(
  REP1: string,
  REP2: string,
  text: string,
  name: string,
  start: boolean
) {
  var regex1 = new RegExp(REP1);
  var regex2 = new RegExp(REP2);
  let ns = `${name}Start`;
  let ne = `${name}End`;
  let na = `${name}Amount`;
  if (start) {
    // 如果是开始行
    if (regex2.test(text)) {
      codeNum[ne]++;
    }
    if (regex1.test(text)) {
      codeNum[ns]++;
      codeNum[na] = codeNum[ne] - codeNum[ns];
    }
  } else {
    // 如果是结束行
    if (regex1.test(text)) {
      codeNum[ns]++;
    }
    if (regex2.test(text)) {
      codeNum[ne]++;
      codeNum[na] = codeNum[ns] - codeNum[ne];
    }
  }
}
/**
 * 计算向上取到的空格
 * @param {string} REP1
 * @param {string} str
 * @param {string} name
 * @param {string} REP2
 * @return {*}
 */
function codeQuotes(REP1: string, str: string, name: string, REP2?: string) {
  var regex1 = new RegExp(REP1, "g");
  let ns = `${name}Start`;
  let na = `${name}Amount`;
  let arr1;
  if (REP2) {
    if (/\]/.test(str)) {
      codeNum.bracketsEnd++;
    }
    if (/\[/.test(str)) {
      codeNum.bracketsStart++;
    }
    codeNum.bracketsAmount = codeNum.bracketsEnd - codeNum.bracketsStart;
  } else if ((arr1 = regex1[Symbol.matchAll](str)) !== null) {
    Array.from(arr1, (x) => x[0]).forEach((f) => {
      codeNum[ns]++;
    });
    codeNum[na] = codeNum[ns] % 2;
  }
}
