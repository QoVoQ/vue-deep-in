import {warn} from "src/shared/debug";
import {isDef} from "src/shared/util";

const asyncJobQueue: Array<Function> = [];

let isAsyncJobQueueRegistered = false;

function flushQueue() {
  const fns = asyncJobQueue.slice(0).filter(fn => typeof fn === "function");
  asyncJobQueue.length = 0;
  isAsyncJobQueueRegistered = false;
  fns.forEach(fn => {
    fn();
  });
}

function nextTick(cb?: Function, ctx?: object): Promise<any> | undefined {
  let _resolve;
  asyncJobQueue.push(() => {
    if (isDef(cb)) {
      try {
        cb.call(ctx);
      } catch (e) {
        warn("Exception in nextTick callback", e, ctx);
      }
    } else if (isDef(_resolve)) {
      _resolve(ctx);
    }
  });

  if (!isAsyncJobQueueRegistered) {
    isAsyncJobQueueRegistered = true;
    Promise.resolve().then(flushQueue);
  }

  if (!isDef(cb)) {
    return new Promise(resolve => {
      _resolve = resolve;
    });
  }
}

export {nextTick};
