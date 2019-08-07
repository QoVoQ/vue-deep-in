import Vue from "src";

export type VueClass<T extends Vue> = {new (...args: any[]): T};
