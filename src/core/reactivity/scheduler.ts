import {Watcher} from "./Watcher";
import {nextTick} from "../util/next-tick";
import {callHook, ComponentLifecycleName} from "../instance/lifecycle";
import Vue from "src";

const watcherQueue: Array<Watcher> = [];
let isWatcherQueueRegistered = false;
let isWatcherFlushing = false;
let has = Object.create(null);
let runningWatcherIdx;

function flushWatcherQueue() {
  isWatcherFlushing = true;
  /**
   * watchers are executed in uid's ascending order, with the following reasons:
   * i. guarantee parent component update before child components
   * ii.  guarantee A component's user defined watchers run before its render watcher
   * iii. if child component is destroyed during parent's watcher run, its watcher
   *      can be skipped
   */
  watcherQueue.sort((a, b) => a.uid - b.uid);

  for (
    runningWatcherIdx = 0;
    runningWatcherIdx < watcherQueue.length;
    runningWatcherIdx++
  ) {
    const curWatcher = watcherQueue[runningWatcherIdx];
    callBeforeUpdateHook(curWatcher);
    has[curWatcher.uid] = false;
    curWatcher.run();
  }
  const updatedQueue = watcherQueue.slice();
  resetQueue();
  // call component's update hook
  // @TODO may be same component's update hook be called multiple times?
  callUpdatedHook(updatedQueue);
}

function resetQueue() {
  has = Object.create(null);
  isWatcherQueueRegistered = isWatcherFlushing = false;
  watcherQueue.length = 0;
}

function shouldCallHook(watcher: Watcher) {
  const vm = watcher.target;
  // only call `updated` for component's render watcher
  return vm._watcher === watcher && vm._isMounted && !vm._isDestroyed;
}
function callUpdatedHook(watchers: Watcher[]) {
  watchers.forEach(watcher => {
    if (shouldCallHook(watcher)) {
      callHook(watcher.target, ComponentLifecycleName.updated);
    }
  });
}
function callBeforeUpdateHook(watcher: Watcher) {
  if (shouldCallHook(watcher)) {
    callHook(watcher.target, ComponentLifecycleName.beforeUpdate);
  }
}

/**
 * Push watcher into a async queue. Duplicated watcher will be ignored, unless
 * it's being push when queue is flushing
 */
export function queueWatcher(watcher: Watcher) {
  if (has[watcher.uid]) {
    return;
  }

  has[watcher.uid] = true;

  if (!isWatcherFlushing) {
    watcherQueue.push(watcher);
  } else {
    /**
     * watchers in queue has already been sorted in ascending order
     * i. If uid of the newly watcher being pushed is greater than the uid of
     *    running watcher, the newly one will be executed next immediately
     * ii. Else, insert the newly watcher into queue according to its uid
     */
    let i = watcherQueue.length - 1;
    while (i > runningWatcherIdx && watcher.uid < watcherQueue[i].uid) {
      i--;
    }
    watcherQueue.splice(i + 1, 0, watcher);
  }

  if (!isWatcherQueueRegistered) {
    isWatcherQueueRegistered = true;
    nextTick(flushWatcherQueue);
  }
}
