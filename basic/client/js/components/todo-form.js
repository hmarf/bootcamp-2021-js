import store from "../store.js";
import { createAddTodoAction } from "../flux/index.js";

class TodoForm {
  constructor() {
    this.button = document.querySelector(".todo-form__submit");
    this.form = document.querySelector(".todo-form__input");
  }

  mount() {
    // TODO:
    // ここに 作成ボタンが押されたら todo を作成するような処理を追記する
    this.button.addEventListener("click", (e) => {
      // ページのリロードをキャンセルさせるみたい。
      // https://qiita.com/yokoto/items/27c56ebc4b818167ef9e
      e.preventDefault();
      store.dispatch(createAddTodoAction({ name: this.form.value }));
      this.form.value = "";
    });
  }
}

export default TodoForm;
