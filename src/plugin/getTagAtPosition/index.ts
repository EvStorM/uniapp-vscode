/*
 * @Date: 2021-07-19 11:31:48
 * @LastEditors: E'vils
 * @LastEditTime: 2021-07-30 18:49:01
 * @Description: 
 * @FilePath: /src/plugin/getTagAtPosition/index.ts
 */
import { getVueTag } from "./getVueTag";
import { getJsTagFunc, getJsAPIFunc } from "./getJsTag";

export { Tag } from "./base";

export const getTagAtPosition = getVueTag;
export const getJsTag = getJsTagFunc;
export const getJsApi = getJsAPIFunc;
