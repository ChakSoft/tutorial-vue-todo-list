const todoListMixin = {
  props : {
    data : {
      type : Array,
      default : () => [],
    },
  },
  methods : {
    setDone (todo) {
      this.$emit('done', todo)
    },
  },
}

const dateFormatMixin = {
  methods : {
    formatDate (date) {
      if (!date) {
        return ''
      }
      return date.toLocaleString()
    },
  },
}

Vue.component('todo-item', {
  mixins : [dateFormatMixin],
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
      return this.formatDate(this.todo.doneAt)
    },
  },
  methods : {
    setDone () {
      this.$emit('done')
    },
  },
})

Vue.component('todo-list', {
  mixins : [todoListMixin],
  template : `
    <div
      v-if="data.length"
      class="todo-list">
      <todo-item
        v-for="todo in displayedTodos"
        :key="todo.id"
        :todo="todo"
        @done="setDone(todo)" />
    </div>
  `,
  props : {
    doneFiltered : {
      type : Boolean,
      default : false,
    },
  },
  computed : {
    displayedTodos () {
      return this.data.filter((todo) => todo.done === this.doneFiltered)
    },
  },
})

Vue.component('todo-log', {
  mixins : [dateFormatMixin],
  props : {
    logs : {
      type : Array,
      default : () => [],
    },
  },
  template : `
    <div class="todo-logs">
      <div
        v-for="(log, index) in logs"
        :key="index"
        class="todo-log">
        {{ formatDate(log.at) }} : {{ log.event }}
      </div>
    </div>
  `,
})

Vue.component('tab-todo-list', {
  mixins : [todoListMixin],
  template : `
    <todo-list
      :data="data"
      @done="setDone" />
  `,
})
Vue.component('tab-todo-done', {
  mixins : [todoListMixin],
  template : `
    <todo-list
      :data="data"
      done-filtered
      @done="setDone" />
  `,
})
Vue.component('tab-todo-log', {
  props : {
    data : {
      type : Array,
      default : () => [],
    },
  },
  template : `
    <todo-log :logs="data" />
  `,
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
      logs : [],
    }
  },
  computed : {
    activeTab () {
      return `tab-${this.active}`
    },
    activeData () {
      if (this.active === 'todo-log') {
        return this.logs
      }
      return this.todos
    },
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
          <li
            :class="{ active: active === 'todo-log' }"
            class="tab"
            @click="display('todo-log')">
            Log
          </li>
        </ul>
      </div>
      <div class="tab-pages">
        <component
          :is="activeTab"
          :data="activeData"
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
      this.logs.unshift({
        at : new Date(),
        event : `${todo.title} set to ${todo.done ? 'done' : 'undone'}`,
      })
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
