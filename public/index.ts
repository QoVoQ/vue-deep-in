import Vue from "src";
import Component from "packages/vue-class-component/src";

@Component
class MyComp extends Vue {
  $store: any;
  foo: string = "Hello, " + this.$store.state.msg;
  name: string;
  age: number;

  beforeCreate() {
    this.$store = {
      state: {
        msg: "world"
      }
    };
  }
}
const c = new MyComp();

console.log(c);
