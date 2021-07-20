import { TextDocument, Position } from "vscode";
import { Tag } from "./base";
// import { getLangForVue } from '../lib/helper'
import { getPugTag } from "./getPugTag";
import { getWxmlTag } from "./getWxmlTag";
// import { getvuemlTag } from "./getvuemlTag";

export function getVueTag(doc: TextDocument, pos: Position): null | Tag {
  let lang = doc.languageId;
  if (lang === "vue") {
    // lang = getLangForVue(doc, pos) as string
    // if (!lang) return null
    return getWxmlTag(doc, pos);
  }
  if (lang.includes("pug")) return getPugTag(doc, pos);
  if ("wxml" === lang) return getWxmlTag(doc, pos);
  if ("html" === lang) return getWxmlTag(doc, pos);
  return null;
}
