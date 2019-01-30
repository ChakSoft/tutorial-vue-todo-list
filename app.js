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
      <small v-if="todo.done">
        {{ doneAt }}
      </small>
    </div>
  `,
  computed : {
    doneAt () {
      if (!this.todo.doneAt) {
        return ''
      }
      return this.todo.doneAt.toLocaleString()
    }
  },
  methods : {
    setDone () {
      this.$emit('done')
    },
  },
})

Vue.component('todo-list', {
  template : `
    <div
      v-if="todos.length"
      class="todo-list">
      <todo-item
        v-for="todo in displayedTodos"
        :key="todo.id"
        :todo="todo"
        @done="setDone(todo)" />
    </div>
  `,
  props : {
    todos : {
      type : Array,
      required : true,
      default : () => [],
    },
    doneFiltered : {
      type : Boolean,
      default : false,
    },
  },
  computed : {
    displayedTodos () {
      return this.todos.filter((todo) => todo.done === this.doneFiltered)
    },
  },
  methods : {
    setDone (todo) {
      this.$emit('done', todo)
    },
  },
})

Vue.component('todo-manager', {
  data () {
    return {
      active : 'todo-list',
      todos : [
        {
          id : 1,
          title : 'Buy milk',
          done : false,
          doneAt : null,
        },
        {
          id : 2,
          title : 'Buy toilet paper',
          done : false,
          doneAt : null,
        },
      ],
    }
  },
  template : `
    <div class="flex tabber">
      <div class="tab-headers">
        <ul>
          <li
            :class="{ active: active === 'todo-list' }"
            class="tab"
            @click="display('todo-list')">
            To Do
          </li>
          <li
            :class="{ active: active === 'todo-done' }"
            class="tab"
            @click="display('todo-done')">
            Done
          </li>
        </ul>
      </div>
      <div class="tab-pages">
        <todo-list
          :done-filtered="active === 'todo-done'"
          :todos="todos"
          @done="setDone" />
      </div>
    </div>
  `,
  methods : {
    display (page) {
      this.active = page
    },
    setDone (todo) {
      todo.done = !todo.done
      if (!todo.doneAt) {
        todo.doneAt = new Date()
      }
    },
  },
})

new Vue({
  el : '#app',
  template : `
    <div class="flex">
      <todo-manager />
    </div>
  `,
})
