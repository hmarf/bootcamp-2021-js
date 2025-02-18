import store from '../store.js'
import {patchTodoAction, deleteTodoAction} from '../flux/index.js'

class Todo {
  constructor(parent, { id, name, done }) {
    this.parent = parent;
    this.element = document.createElement("li");
    this.element.className = "todo-item";
    this.props = {id, name, done};
  }

  mount() {
    // TODO: ここにTODOの削除ボタンが押されたときの処理を追記
    const deleteButton = this.element.querySelector('.todo-remove-button');
    deleteButton.addEventListener('click', () => {
      store.dispatch(deleteTodoAction(this.props));
    });
    
    // TODO: ここにTODOのチェックボックスが押されたときの処理を追記
    const checkBox = this.element.querySelector(".todo-toggle");
    checkBox.addEventListener('click', () => {
        store.dispatch(patchTodoAction(this.props));
    });
  }

  render() {
    const { id, name, done } = this.props;
    this.element.innerHTML = `
      <label class="todo-toggle__container">
        <input
          data-todo-id="${id}"
          type="checkbox"
          class="todo-toggle"
          value="checked"
          ${done ? "checked" : ""}
        />
        <span class="todo-toggle__checkmark"></span>
      </label>
      <div class="todo-name">${name}</div>
      <div data-todo-id="${id}" class="todo-remove-button">x</div>
    `;
    this.parent.appendChild(this.element)
    this.mount();
  }
}

export default Todo;
