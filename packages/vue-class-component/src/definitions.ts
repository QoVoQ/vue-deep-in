import Vue from "src";
//@TODO use generics to define Ctor
export type VueClass = typeof Vue;
export type VueClassa<T extends Vue> = new (...args) => T;
