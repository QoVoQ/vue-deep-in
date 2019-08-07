import Vue, {ICtorOptions} from "src";
import {VueClass} from "./definitions";

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
export function componentFactory(
  Ctor: VueClass<Vue>,
  options: Partial<ICtorOptions> = {}
): VueClass<Vue> {
  const ctorProto = Ctor.prototype;

  Object.entries(ctorProto).forEach(([key, val]) => {
    // methods
    options.methods = options.methods || {};
    if (typeof val !== "function") {
      return;
    }
    options.methods[key] = val;

    // computed
    options.computed = options.computed || {};
    const descriptor = Object.getOwnPropertyDescriptor(ctorProto, key)!;
    if (descriptor.get) {
      options.computed[key] = descriptor.get;
    }
  });

  // data
  const originalInit = Ctor.prototype._init;
  Ctor.prototype._init = function() {};
  const insData = new Ctor();
  const ownProps = {};
  const ownKeys = Object.getOwnPropertyNames(insData).filter(
    key => key.charAt(0) !== "_"
  );
  console.log(ownKeys);
  ownKeys.forEach(key => {
    ownProps[key] = insData[key];
  });

  options.data = function() {
    return JSON.parse(JSON.stringify(ownProps));
  };

  Ctor.prototype._init = originalInit;

  return class extends Ctor {
    constructor(opt: Partial<ICtorOptions> = {}) {
      super({...options, ...opt});
    }
  };
}
