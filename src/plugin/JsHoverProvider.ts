/*
 * @Date: 2021-07-19 11:31:48
 * @LastEditors: E'vils
 * @LastEditTime: 2021-08-02 19:18:43
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
import { hoverApiMarkdown } from "evils-uniapp";
import { getJsTag } from "./getTagAtPosition";
import { Config } from "./lib/config";

import { getLanguage } from "./lib/helper";

export default class implements HoverProvider {
  constructor(public config: Config) {}
  async provideHover(
    document: TextDocument,
    position: Position,
    token: CancellationToken
  ) {
    if (!this.config.jsHover) return null;
    let language = getLanguage(document, position);
    if (!language) return null;
    let tag = getJsTag(document, position);
    if (!tag) return;

    let markdown: string | undefined;
    markdown = await hoverApiMarkdown(tag.name, language);
    return markdown ? new Hover(new MarkdownString(markdown)) : null;
    // return new Hover(new MarkdownString(JSON.stringify(name)));
  }

  getAtPosition() {}
}
