import {makeMap} from "src/shared/util";
export const isBooleanAttr = makeMap(
  "allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare," +
    "default,defaultchecked,defaultmuted,defaultselected,defer,disabled," +
    "enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple," +
    "muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly," +
    "required,reversed,scoped,seamless,selected,sortable,translate," +
    "truespeed,typemustmatch,visible"
);

export const isFalsyAttrValue = (val: any): boolean => {
  return val == null || val === false;
};
