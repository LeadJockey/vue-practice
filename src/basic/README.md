# Vue Basic

### MVVM 패턴

백앤드 로지과 클라이언트의 마크업을 분리하기 위한 구조로 전통적인 MVC 패턴의 방식에 기인함.
화면 동작 로직 과 데이터 처리 로직 & 서버 로직을 분리 함.
데이터로 modal 에 담아서 view 로 쏴줌.

### Vue Instance

Vue.js 를 이용하여 UI 화면을 개발하기 위해서는 아래 절차를 따른다.
* Vue 라이브러리를 로딩했을때 존재하는 Vue 생성자로 인스턴스를 생성해야 한다.
* 뷰라는 객체에 옵션값을 넣어줌으로서 해당 인스턴스를 받아서 사용 ( ? )

```javascript
// vm 은 vueModel 을 뜻함 관행적인 컨벤션
var vm = new Vue({
  //...options
  template:'...',
  el:'...',
  methods:{
    
  },
  created:{
    
  }
  //...
});


var MyComponet = Vue.extend({
  // template, el, methods 와 같은 options 정의
  template:'<p>Hello {{ message }}</p>',
  data:{
    message:'Vue.js'
  }
});
```

### LifeCycle

initiating life cycle in Vue instance
뷰 객체가 생성될 때 아래의 초기화 작업을 수행한다.

1. 데이터 관찰
2. 템플릿 컴파일
3. 돔에 객체 연결
4. 데이터 변경시 돔 업데이트

라이브 싸이클의 단계

* mounted
* updated
* destroyed

뷰는 초기회 메서드를 사용하기 때문에 별도로 Controller 를 가지고 있지 않다.

### Component

전역 컴포넌트와 지역 컴포넌트 차이점

뷰 모델을 여러개 만들어서 사용한다고 했을때 전역에 설정해둔 컴포넌트들은 바로 재사용이 가능하지만,

로컬 스코프에서 설정된 컴포넌트는 지정된 인스턴스 안에서만 인식되게 된다.


```javascript
        // global component
        Vue.component('my-component',{ template:'<div>A custom pomponent!</div>' });
        Vue.component('my-component2',{ template:'<div>A custom pomponent2!</div>' });

        // local component
        var cmp = {
          template:'<div>A local component</div>'
        };

        new Vue({
          el:'#app',
          components:{
            'my-local-component':cmp
          }
        })

        new Vue({
          el:'#app2'
        })
```