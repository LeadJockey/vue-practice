
var app = new Vue({
  el: '#app',
  data: {
    message : '내 위에 잠시 마우스를 올리면 동적으로 바인딩 된 title 을 볼 수 있습니다!',
    // 할일 #1
    // 새로운 데이터 속성을 1개 추가하고, data bindings 를 이용하여 화면에 표시해보세요.
    bind:'Hello Vue.js Hello Vue.js Hello Vue.js Hello Vue.js Hello Vue.js Hello Vue.js',
    uid: '1s0',
    // 할일 #2
    // uid 를 변경하고 해당 uid 의 변경 여부를 크롬 개발자 도구의 "화면 요소 검사" 기능으로 p 태그의 id 값을 확인해보세요.

    flag: false
    // 할일 #4
    // 위 flag 값을 false 로 변경하였을 때 화면에 어떤 영향을 주는지 확인해보세요.
  },
  methods: {
    // ES6
    // clickBtn() {
    //   console.log("hi");
    // },
    // ES5
    clickBtn: function() {
      console.log("hi");
    },
    reverseMessage:function(){
      this.message = this.message.split('').reverse().join('');
    }


    // 할일 #3
    // eventMethod 를 하나 추가하고 template 에서 해당 이벤트를 실행할 수 있는 button 을 하나 추가하세요.
    
  }
});

