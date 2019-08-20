import Vue from "src";
//@TODO use generics to define Ctor
// export type VueClass = typeof Vue;
export type VueClass<T extends Vue> = {new (...args): T} & typeof Vue;
