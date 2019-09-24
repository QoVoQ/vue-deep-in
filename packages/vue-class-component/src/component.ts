import Vue, {ICtorUserOpt} from "src";
import {VueClass} from "./definitions";
import {collectDataFromCtor} from "./data";
import {ComponentLifecycleName} from "src/core/instance/lifecycle";

/**
 * because vue options like props, methods, computed, data can be access through
 * vue instance, so they need to define on class definition
 */
// @Component({
//   // $options.watch
//   watch: {
//     msg(newVal, oldVal) {...}
// },
//   // $options.created
//   created() { ...}
//   // $options.render
//   render() {...}
// })
// class VueIns extends Vue {
//   // i) instance properties are defined as `$options.data`
//   // ii) getter are defined as `$options.computed`
//   // iii) instance methods are defined as `$options.methods`
//   msg = "Hello World"
//   age = 123

//   /**
//    * data () {
//    *  return {
//    *    msg: 'Hello World',
//    *    age: 123
//    *  }
//    * }
//    */

//   say() {... }
//   /**
//    * methods: {
//    *  say() {}
//    * }
//    */

//   get ageStr() {
//     return this.age + 'years old'
//   }

//   /**
//    * computed: {
//    *  ageStr() {
//    *    return this.age + 'years old'
//    *  }
//    * }
//    */
// }

export const $innerHooks = ["data", ...Object.keys(ComponentLifecycleName)];
export function componentFactory(
  Ctor: VueClass<Vue>,
  options: Partial<ICtorUserOpt> = {}
): VueClass<Vue> {
  options.name =
    options.name || (Ctor as any)._componentTag || (Ctor as any).name;
  const ctorProto = Ctor.prototype;
  options.methods = options.methods || {};
  // computed
  options.computed = options.computed || {};
  options.mixins = options.mixins || [];

  Object.getOwnPropertyNames(ctorProto).forEach(key => {
    if (key === "constructor") {
      return;
    }

    if ($innerHooks.indexOf(key) > -1) {
      options[key] = ctorProto[key];
      return;
    }

    const descriptor = Object.getOwnPropertyDescriptor(ctorProto, key)!;

    if (descriptor.value !== undefined) {
      if (typeof descriptor.value !== "function") {
        return;
      }
      //extract option methods
      options.methods[key] = descriptor.value;
    } else {
      // extract option computed
      if (descriptor.get) {
        options.computed[key] = descriptor.get;
      }
    }
  });
  // extract option data
  options.mixins.push({
    data(this: Vue) {
      return collectDataFromCtor(this, Ctor);
    }
  });

  const superProto = Object.getPrototypeOf(Ctor.prototype);
  const Super = superProto instanceof Vue ? Ctor : Vue;

  const Extended = Super.extend(options);

  forwardStaticMembers(Extended, Ctor);

  return Extended;
}

const ignoredKeys = ["prototype", "arguments", "callee", "caller"];

function forwardStaticMembers(Extended: typeof Vue, Original: typeof Vue) {
  Object.getOwnPropertyNames(Original).forEach(key => {
    if (ignoredKeys.indexOf(key) > -1) {
      return;
    }

    const extendedKeyDescriptor = Object.getOwnPropertyDescriptor(
      Extended,
      key
    );

    if (extendedKeyDescriptor && !extendedKeyDescriptor.configurable) {
      return;
    }
    const originalKeyDescriptor = Object.getOwnPropertyDescriptor(
      Original,
      key
    );

    Object.defineProperty(Extended, key, originalKeyDescriptor);
  });
}
