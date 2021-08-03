/*
 * @Date: 2021-07-19 11:31:48
 * @LastEditors: E'vils
 * @LastEditTime: 2021-08-03 10:34:09
 * @Description:
 * @FilePath: /src/plugin/JsAutoCompletion.ts
 */
/******************************************************************
MIT License http://www.opensource.org/licenses/mit-license.php
Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

// import { autocompleteTagAttrValue, autocompleteTagAttr } from "@minapp/common";
import {
  Position,
  CancellationToken,
  CompletionItemProvider,
  TextDocument,
  CompletionItem,
  CompletionContext,
  CompletionItemKind,
  MarkdownString,
  // Range,
  SnippetString,
} from "vscode";
import { getJsApi } from "./getTagAtPosition";
import { Config } from "./lib/config";

import { autoApiAttr } from "evils-uniapp";

import { getLanguage, getLastChar } from "./lib/helper";
import { LanguageConfig } from "./lib/language";

export default class implements CompletionItemProvider {
  constructor(public config: Config) {}
  id = "wxml" as "wxml";
  skip(document: TextDocument, position: Position) {
    return /[\w\d\$_\}'"]/.test(
      getLastChar(document, new Position(position.line, position.character + 1))
    );
  }
  provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[]> {
    if (!this.config.jsAutoCompletion) return [] as any;
    if (token.isCancellationRequested) {
      return Promise.resolve([]);
    }
    let language = getLanguage(document, position);
    if (!language) return [] as any;
    let char = context.triggerCharacter || getLastChar(document, position);

    switch (char) {
      case "\n": // 换行
        return this.skip(document, position)
          ? Promise.resolve([])
          : this.createApiSnippetItems(language, document, position);
      /// @ts-ignore
      case " ": // 空格
        // 如果后面紧跟字母数字或_不触发自动提示
        // (常用于手动调整缩进位置)
        return this.skip(document, position)
          ? Promise.resolve([])
          : this.createApiSnippetItems(language, document, position);
      default:
        if (char >= "a" && char <= "z") {
          // 输入属性时自动提示
          return this.createApiSnippetItems(language, document, position);
        }
        return [] as any;
    }
  }

  /**
   * 创建api属性的自动补全
   */
  async createApiSnippetItems(
    lc: LanguageConfig,
    doc: TextDocument,
    pos: Position
  ) {
    let tag = getJsApi(doc, pos);
    if (!tag) return [];

    let res = await autoApiAttr(tag.name, tag.attrs, lc);
    let { natives } = res;
    if (!natives.length) return [];
    return natives.map((v) => {
      let it = new CompletionItem(v.attr.name, CompletionItemKind.Value);
      it.documentation = new MarkdownString(v.markdown);
      it.insertText = new SnippetString(
        `${v.attr.name}:${v.attr.defaultValue || ""},$0`
      );
      it.sortText = "a";
      return it;
    });
  }
}
