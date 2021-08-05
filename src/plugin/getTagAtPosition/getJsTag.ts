/*
 * @Date: 2021-07-26 18:58:47
 * @LastEditors: E'vils
 * @LastEditTime: 2021-08-05 13:40:52
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
    // 暂时排除;后的匹配
    if (
      /;$/.test(
        doc
          .lineAt(pos.line)
          .text.slice(0, index)
          .trim()
      )
    ) {
      return null;
    }
    // const inputWordRange = doc.getWordRangeAtPosition(pos, /\b[\w-:.]+\b/); // 正在输入的词的范围
    // const posWord = inputWordRange ? doc.getText(inputWordRange) : ""; // 正在输入的词
    // if (!posWord) return null;
    // let name = posWord.replace("^uni.", "");
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
    // 暂时排除;后的匹配
    if (
      /;$/.test(
        doc
          .lineAt(pos.line)
          .text.slice(0, index)
          .trim()
      )
    ) {
      return null;
    }
    let name = RegExp.$1;
    return { name, attrs: {}, index };
  } else {
    let startLine = pos.line;
    let name = searchUp(doc, startLine, index);
    if (!name) return null;
    // 判断是否是在函数的传参之中
    let atend = searchDown(doc, startLine + 1, index);
    if (
      !atend ||
      codeNum.bracketsAmount ||
      codeNum.codeBlockAmount ||
      codeNum.quotesAmount ||
      codeNum.singleQuotesAmount
    ) {
      return null;
    }
    // return { name: JSON.stringify(codeNum), attrs: {}, index };
    return { name, attrs: {}, index };
  }
}
function searchUp(doc: TextDocument, lineNum: number, index: number) {
  const startLine = lineNum;
  let name = "";
  while (lineNum >= 0 && !name) {
    let text = doc.lineAt(lineNum).text.trim();
    if (text) {
      codeAnalysis("{", "}", text, "codeBlock", true);
      if (lineNum == startLine) {
        let str = doc
          .lineAt(lineNum)
          .text.slice(0, index)
          .trim();
        codeQuotes('"', str, "quotes");
        codeQuotes("'", str, "singleQuotes");
        codeQuotes("]", str, "brackets", "[");
      } else {
        codeQuotes('"', text, "quotes");
        codeQuotes("'", text, "singleQuotes");
        codeQuotes("]", text, "brackets", "[");
      }
      if (SINGLE_LINE_REGEXP.test(text) && codeNum.codeBlockAmount == 1) {
        name = RegExp.$1;
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
      codeAnalysis("{", "}", text, "codeBlock", false);
      if (END_REGEXP.test(text) && codeNum.codeBlockAmount === 0) {
        atEnd = true;
      } else if (/<\/script\>/.test(text)) {
        atEnd = false;
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
  let arr1;
  let arr2;
  if (start) {
    if ((arr2 = regex2[Symbol.matchAll](text)) !== null) {
      Array.from(arr2, (x) => x[0]).forEach((f) => {
        codeNum[ne]++;
      });
    }
    if ((arr1 = regex1[Symbol.matchAll](text)) !== null) {
      Array.from(arr1, (x) => x[0]).forEach((f) => {
        codeNum[ns]++;
      });
    }
  } else {
    // 如果是结束行
    if ((arr1 = regex1[Symbol.matchAll](text)) !== null) {
      Array.from(arr1, (x) => x[0]).forEach((f) => {
        codeNum[ns]++;
      });
    }
    if ((arr2 = regex2[Symbol.matchAll](text)) !== null) {
      Array.from(arr2, (x) => x[0]).forEach((f) => {
        codeNum[ne]++;
      });
    }
  }
  codeNum[na] = codeNum[ns] - codeNum[ne];
}
/**
 * 计算向上取到的空格
 */
function codeQuotes(REP1: string, str: string, name: string, REP2?: string) {
  var regex1 = new RegExp(REP1, "g");
  let ns = `${name}Start`;
  let ne = `${name}End`;
  let na = `${name}Amount`;
  let arr1;
  let arr2;
  if (REP2) {
    if ((arr1 = /\]/[Symbol.matchAll](str)) !== null) {
      Array.from(arr1, (x) => x[0]).forEach((f) => {
        codeNum[ne]++;
      });
    }
    if ((arr2 = /\[/[Symbol.matchAll](str)) !== null) {
      Array.from(arr2, (x) => x[0]).forEach((f) => {
        codeNum[ns]++;
      });
    }
    codeNum[na] = codeNum[ns] - codeNum[ne];
  } else {
    if ((arr1 = regex1[Symbol.matchAll](str)) !== null) {
      Array.from(arr1, (x) => x[0]).forEach((f) => {
        codeNum[ns]++;
      });
      codeNum[na] = codeNum[ns] % 2;
    }
  }
}
