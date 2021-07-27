/*
 * @Date: 2021-07-19 11:31:48
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-27 23:38:44
 * @Description:
 * @FilePath: /src/plugin/JsHoverProvider.ts
 */
/******************************************************************
MIT License http://www.opensource.org/licenses/mit-license.php
Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import {
  HoverProvider,
  TextDocument,
  Position,
  CancellationToken,
  Hover,
  MarkdownString,
} from "vscode";
// import {
//   hoverComponentAttrMarkdown,
//   hoverComponentMarkdown,
// } from "@minapp/common";
import { getJsTag } from "./getTagAtPosition";
import { Config } from "./lib/config";
import // getLanguage,
//  getCustomOptions
"./lib/helper";

export default class implements HoverProvider {
  constructor(public config: Config) {}
  async provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ) {
    let language = document.languageId === "vue";
    if (!language) return;
    let name = getJsTag(document, position);
    if (!name) return;
    return new Hover(new MarkdownString(JSON.stringify(name)));
  }

  getAtPosition() {}
}
