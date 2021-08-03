/*
 * @Date: 2021-07-19 11:31:48
 * @LastEditors: E'vils
 * @LastEditTime: 2021-08-03 16:57:08
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
  Range,
} from "vscode";
import { getJsApi } from "./getTagAtPosition";
import { Config } from "./lib/config";

import { autoApiAttr, autoApiName, TagItem } from "evils-uniapp";

import { getCustomOptions, getLanguage, getLastChar } from "./lib/helper";
import { LanguageConfig } from "./lib/language";

export default class implements CompletionItemProvider {
  constructor(public config: Config) {}
  id = "wxml" as "wxml";
  skip(document: TextDocument, position: Position) {
    return /[\w\d\$_\}'"]/.test(
      getLastChar(document, new Position(position.line, position.character + 1))
    );
  }
  getuni(document: TextDocument, position: Position) {
    return /^uni./.test(document.lineAt(position.line).text.trim());
  }
  getCustomOptions(doc: TextDocument) {
    return getCustomOptions(this.config, doc);
  }
  provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken,
    context: CompletionContext
  ): Promise<CompletionItem[]> {
    if (token.isCancellationRequested) {
      return Promise.resolve([]);
    }
    let language = getLanguage(document, position);
    if (!language) return [] as any;
    let char = context.triggerCharacter || getLastChar(document, position);

    switch (char) {
      case ".": // 点
        // 如果后面紧跟字母数字或_不触发自动提示
        return this.skip(document, position)
          ? Promise.resolve([])
          : this.getuni(document, position)
          ? this.createApiItems(language, document, position)
          : Promise.resolve([]);
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
    if (!this.config.jsAutoApi) return [] as any;
    let tag = getJsApi(doc, pos);
    if (!tag) return [];
    let res = await autoApiAttr(tag.name, tag.attrs, lc);
    let { natives } = res;
    if (!natives.length) return [];
    return natives.map((v) => {
      let it = new CompletionItem(v.attr.name, CompletionItemKind.Value);
      it.documentation = new MarkdownString(v.markdown);
      let types = v.attr.type.name;
      let insert = "";
      if (types == "Function" || types == "function") {
        insert = `(result)=>{$0}`;
      }
      if (types == "String" || types == "string") {
        insert = `'$0'`;
      }
      if (types == "Object" || types == "Object") {
        insert = `{$0}`;
      }
      if (types == "Number" || types == "number") {
        insert = `0$0`;
      }
      if (types == "Boolean" || types == "boolean") {
        insert = `true$0`;
      }
      it.insertText = new SnippetString(`${v.attr.name}:${insert},`);
      it.sortText = "a";
      return it;
    });
  }
  /**
   * 创建api名称的自动补全
   */
  async createApiItems(
    lc: LanguageConfig,
    doc: TextDocument,
    pos: Position,
    prefix?: string
  ) {
    if (!this.config.jsAutoCompletion) return [] as any;
    let res = await autoApiName(lc, this.getCustomOptions(doc));
    let filter = (key: string) =>
      key && (!prefix || prefix.split("").every((c) => key.includes(c)));
    let filterComponent = (t: TagItem) => filter(t.component.name);

    let items = [
      ...res.natives
        .filter(filterComponent)
        .map((t: any) => this.renderTag(t, "a")),
    ];
    if (prefix) {
      items.forEach((it) => {
        it.range = new Range(
          new Position(pos.line, pos.character - prefix.length),
          pos
        );
      });
    }
    return items;
  }

  renderTag(tag: TagItem, sortText: string) {
    let c = tag.component;
    let item = new CompletionItem(c.name, CompletionItemKind.Module);
    let snippet: string;
    snippet = `${c.name}({$0})`;
    item.insertText = new SnippetString(snippet);
    item.documentation = new MarkdownString(tag.markdown);
    item.sortText = sortText;
    return item;
  }
}
