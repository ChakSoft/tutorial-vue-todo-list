Vue.component('todo-item', {
  props : {
    todo : {
      required : true,
    },
  },
  template : `
    <div
      :class="{ done: todo.done }"
      class="todo-item">
      <a @click="setDone">
        {{ todo.title }}
      </a>
    </div>
  `,
  methods : {
    setDone () {
      this.$emit('done')
    },
  },
})

Vue.component('todo-list', {
  data () {
    return {
      todos : [
        {
          id : 1,
          title : 'Buy milk',
          done : false,
        },
        {
          id : 2,
          title : 'Buy toilet paper',
          done : false,
        },
      ],
    }
  },
  template : `
    <div
      v-if="todos.length"
      class="todo-list">
      <todo-item
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @done="todo.done = !todo.done" />
    </div>
  `,
})

new Vue({
  el : '#app',
  template : `
    <div class="flex">
      <todo-list />
    </div>
  `
})
