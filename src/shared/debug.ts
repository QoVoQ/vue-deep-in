import {isDev} from "./env";

export function warn(msg: string, exception?: any, target?: any) {
  if (isDev()) {
    console.log(msg, target);
    exception && console.error(exception);
  }
}
