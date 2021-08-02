/*
 * @Date: 2021-07-19 11:31:48
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-30 18:40:12
 * @Description:
 * @FilePath: /src/extension.ts
 */
/******************************************************************
MIT License http://www.opensource.org/licenses/mit-license.php
Author Mora <qiuzhongleiabc@126.com> (https://github.com/qiu8310)
*******************************************************************/

import { ExtensionContext, languages, workspace } from "vscode";

import LinkProvider from "./plugin/LinkProvider";
import ActiveTextEditorListener from "./plugin/ActiveTextEditorListener";

import HoverProvider from "./plugin/HoverProvider";
import JsHoverProvider from "./plugin/JsHoverProvider";
import WxmlFormatter from "./plugin/WxmlFormatter";

import WxmlAutoCompletion from "./plugin/WxmlAutoCompletion";
import PugAutoCompletion from "./plugin/PugAutoCompletion";
import JsAutoCompletion from "./plugin/JsAutoCompletion";
// import VueAutoCompletion from "./plugin/VueAutoCompletion";
import WxmlDocumentHighlight from "./plugin/WxmlDocumentHighlight";

import { config, configActivate, configDeactivate } from "./plugin/lib/config";
import { PropDefinitionProvider } from "./plugin/PropDefinitionProvider";

export function activate(context: ExtensionContext) {
  // console.log('minapp-vscode is active!')
  configActivate();

  if (!config.disableAutoConfig) {
    autoConfig();
  }

  const formatter = new WxmlFormatter(config);
  const autoCompletionWxml = new WxmlAutoCompletion(config);
  const hoverProvider = new HoverProvider(config);
  const jsHoverProvider = new JsHoverProvider(config);
  const linkProvider = new LinkProvider(config);
  const autoCompletionPug = new PugAutoCompletion(config);
  const jsAutoCompletion = new JsAutoCompletion(config);
  // const autoCompletionVue = new VueAutoCompletion(
  //   autoCompletionPug,
  //   autoCompletionWxml
  // );
  const documentHighlight = new WxmlDocumentHighlight(config);
  const propDefinitionProvider = new PropDefinitionProvider(config);

  const wxml = config.documentSelector.map((l) => schemes(l));
  const pug = schemes("wxml-pug");
  const vue = schemes("vue");
  const html = schemes("html");
  const enter = config.showSuggestionOnEnter ? ["\n"] : [];

  context.subscriptions.push(
    //todo 给模板中的 脚本 添加特殊颜色
    new ActiveTextEditorListener(config),

    //todo 添加 link
    languages.registerDocumentLinkProvider(
      [pug, vue].concat(wxml),
      linkProvider
    ),

    // hover 效果
    languages.registerHoverProvider(
      [pug, vue, html].concat(wxml),
      hoverProvider
    ),

    languages.registerHoverProvider([vue], jsHoverProvider),

    // 高亮匹配的标签
    languages.registerDocumentHighlightProvider(wxml, documentHighlight),

    // 格式化
    languages.registerDocumentFormattingEditProvider(wxml, formatter),
    languages.registerDocumentRangeFormattingEditProvider(wxml, formatter),

    // DefinitionProvider
    languages.registerDefinitionProvider(
      [pug, vue].concat(wxml),
      propDefinitionProvider
    ),

    // 自动补全
    languages.registerCompletionItemProvider(
      wxml,
      autoCompletionWxml,
      "<",
      " ",
      ":",
      "@",
      ".",
      "-",
      '"',
      "'",
      "/",
      ...enter
    ),
    languages.registerCompletionItemProvider(
      pug,
      autoCompletionPug,
      "\n",
      " ",
      "(",
      ":",
      "@",
      ".",
      "-",
      '"',
      "'"
    ),
    // trigger 需要是上两者的和
    languages.registerCompletionItemProvider(
      vue,
      autoCompletionWxml,
      "<",
      " ",
      ":",
      "@",
      ".",
      "-",
      '"',
      "'",
      ...enter
    ),
    languages.registerCompletionItemProvider(
      vue,
      jsAutoCompletion,
      "\n",
      " ",
      ...enter
    )
  );
}

export function deactivate() {
  configDeactivate();
}

function autoConfig() {
  let c = workspace.getConfiguration();
  const updates: { key: string; map: any }[] = [
    {
      key: "files.associations",
      map: {
        "*.cjson": "jsonc",
        "*.wxss": "css",
        "*.wxs": "javascript",
      },
    },
    {
      key: "emmet.includeLanguages",
      map: {
        wxml: "html",
      },
    },
  ];

  updates.forEach(({ key, map }) => {
    let oldMap = c.get(key, {}) as any;
    let appendMap: any = {};
    Object.keys(map).forEach((k) => {
      if (!oldMap.hasOwnProperty(k)) appendMap[k] = map[k];
    });
    if (Object.keys(appendMap).length) {
      c.update(key, { ...oldMap, ...appendMap }, true);
    }
  });

  c.update("uniapp-vscode.disableAutoConfig", true, true);
}

export function schemes(key: string) {
  return { scheme: "file", language: key };
}
