/*
 * @Date: 2021-07-19 11:31:48
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-29 15:48:03
 * @Description: 
 * @FilePath: /src/plugin/WxmlFormatter.ts
 */
import {
  FormattingOptions,
  DocumentFormattingEditProvider,
  DocumentRangeFormattingEditProvider,
  TextDocument,
  TextEdit,
  Range,
  window,
} from 'vscode'
import * as Prettier from 'prettier'
import { parse } from '@minapp/wxml-parser'
import { Config } from './lib/config'
import { getEOL } from './lib/helper'
import { requireLocalPkg } from './lib/requirePackage'

type PrettierType = typeof Prettier
export default class implements DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider {
  constructor(public config: Config) {}

  async format(doc: TextDocument, range: Range, options: FormattingOptions, prefix = '') {
    let code = doc.getText(range)
    let content: string = code
    const resolveOptions = (prettier?: PrettierType) =>
      (prettier || requireLocalPkg<PrettierType>(doc.uri.fsPath, 'prettier')).resolveConfig(doc.uri.fsPath, {
        editorconfig: true,
      })

    try {
      if (this.config.wxmlFormatter === 'prettier') {
        const prettier: PrettierType = requireLocalPkg(doc.uri.fsPath, 'prettier')
        let prettierOptions = await resolveOptions(prettier)
        content = prettier.format(code, { ...this.config.prettier, ...prettierOptions })
      } else if (this.config.wxmlFormatter === 'prettyHtml') {
        let prettyHtmlOptions = this.config.prettyHtml
        if (prettyHtmlOptions.usePrettier) {
          const prettierOptions = await resolveOptions()
          prettyHtmlOptions = { ...prettyHtmlOptions, ...prettierOptions, prettier: prettierOptions }
        }

        /**
         * prettyHtml 会将 `<input />` 转化成 `<input>`，而
         * https://github.com/prettyhtml/pretty-html-web 中的版本
         * 不会，所以将它仓库中的版本生成的 js 移到了此处
         */
        content = require('../../res/prettyhtml.js')(code, prettyHtmlOptions).contents
      } else {
        content = parse(code).toXML({
          prefix,
          eol: getEOL(doc),
          preferSpaces: options.insertSpaces,
          tabSize: options.tabSize,
          maxLineCharacters: this.config.formatMaxLineCharacters,
          removeComment: false,
          reserveTags: this.config.reserveTags,
        })
      }
    } catch (e) {
      window.showErrorMessage(`${this.config.wxmlFormatter} format error: ` + e.message)
    }

    return [new TextEdit(range, content)]
  }

  provideDocumentFormattingEdits(doc: TextDocument, options: FormattingOptions): Promise<TextEdit[]> {
    let range = new Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end)
    return this.format(doc, range, options)
  }

  provideDocumentRangeFormattingEdits(
    doc: TextDocument,
    range: Range,
    options: FormattingOptions
  ): Promise<TextEdit[]> {
    let prefixRange = doc.getWordRangeAtPosition(range.start, /[ \t]+/)
    let prefix = prefixRange ? doc.getText(prefixRange) : ''
    return this.format(doc, range, options, prefix)
  }
}
