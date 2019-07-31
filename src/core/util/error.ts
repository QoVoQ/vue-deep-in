export function invokeWithErrorHandler(
  fn: Function,
  ctx?: object,
  args?: Array<any>,
  info?: string
) {
  let res;
  try {
    res = fn.apply(ctx, args);
  } catch (e) {
    console.error(`Exception: ${info}`);
    console.error(e);
  }
  return res;
}
