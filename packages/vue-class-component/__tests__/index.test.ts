import Component from "../src";
import Vue from "src";

describe("vue-class-component", () => {
  it("base", () => {
    @Component
    class Child extends Vue {
      msg = "Hello World";
      people = {age: 11, name: "Tom"};

      say() {
        this.msg = "hello";
      }
    }

    const vm = new Child();

    expect(vm.msg).toBe("Hello World");
    expect(vm.people).toEqual({age: 11, name: "Tom"});
    vm.say();
    expect(vm.msg).toBe("hello");
  });

  it("hooks", () => {
    let created = false;
    let destroyed = false;

    @Component({
      created() {
        created = true;
      },
      destroyed() {
        destroyed = true;
      }
    })
    class MyComp extends Vue {}

    const c = new MyComp();
    expect(created).toBe(true);
    expect(destroyed).toBe(false);
    c.$destroy();
    expect(destroyed).toBe(true);
  });

  it("data: should collect custom property defined on beforeCreate", () => {
    @Component
    class MyComp extends Vue {
      $store: any;
      foo: string = "Hello, " + this.$store.state.msg;

      beforeCreate() {
        this.$store = {
          state: {
            msg: "world"
          }
        };
      }
    }
    const c = new MyComp();
    expect(c.foo).toBe("Hello, world");
  });
  it("methods", () => {
    let msg: string = "";

    @Component
    class MyComp extends Vue {
      hello() {
        msg = "hi";
      }
    }

    const c = new MyComp();
    c.hello();
    expect(msg).toBe("hi");
  });

  it("computed", () => {
    @Component
    class MyComp extends Vue {
      a!: number;
      data() {
        return {
          a: 1
        };
      }
      get b() {
        return this.a + 1;
      }
    }

    const c = new MyComp();

    expect(c.a).toBe(1);
    expect(c.b).toBe(2);
    c.a = 2;
    expect(c.b).toBe(3);
  });

  describe("name", () => {
    it("via name option", () => {
      @Component({name: "test"})
      class MyComp extends Vue {}

      const c = new MyComp();
      expect(c.$options.name).toBe("test");
    });

    it("via _componentTag", () => {
      @Component
      class MyComp extends Vue {
        static _componentTag = "test";
      }

      const c = new MyComp();
      expect(c.$options.name).toBe("test");
    });

    it("via class name", () => {
      @Component
      class MyComp extends Vue {}

      const c = new MyComp();
      expect(c.$options.name).toBe("MyComp");
    });
  });

  it("other options", done => {
    let v: number;

    @Component({
      watch: {
        a: val => (v = val)
      }
    })
    class MyComp extends Vue {
      a!: number;
      data() {
        return {a: 1};
      }
    }

    const c = new MyComp();
    c.a = 2;
    c.$nextTick(() => {
      expect(v).toBe(2);
      done();
    });
  });

  it("extending", function() {
    @Component
    class Base extends Vue {
      a!: number;
      data(): any {
        return {a: 1};
      }
    }

    @Component
    class A extends Base {
      b!: number;
      data(): any {
        return {b: 2};
      }
    }

    const a = new A();
    expect(a.a).toBe(1);
    expect(a.b).toBe(2);
  });

  it("forwardStatics", function() {
    @Component
    class MyComp extends Vue {
      static myValue = 52;

      static myFunc() {
        return 42;
      }
    }

    expect(MyComp.myValue).toBe(52);
    expect(MyComp.myFunc()).toBe(42);
  });
});
