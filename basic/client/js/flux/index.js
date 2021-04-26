/**
 * Dispatcher
 */
class Dispatcher extends EventTarget {
  dispatch() {
    this.dispatchEvent(new CustomEvent("event"));
  }

  subscribe(subscriber) {
    this.addEventListener("event", subscriber);
  }
}

/**
 * Action Creator and Action Types
 */
const FETCH_TODO_ACTION_TYPE = "Fetch todo list from server";
export const createFetchTodoListAction = () => ({
  type: FETCH_TODO_ACTION_TYPE,
  paylaod: undefined,
});

// add list in todo list
const ADD_TODO_ACTION_TYPE = "A todo addition to store";
export const createAddTodoAction = (todo) => ({
  type: ADD_TODO_ACTION_TYPE,
  payload: todo,
});

const PATCH_TODO_ACTION_TYPE = "patch: change done";
export const patchTodoAction = (todo) => ({
  type: PATCH_TODO_ACTION_TYPE,
  payload: todo,
});

const CLEAR_ERROR = "Clear error from state";
export const clearError = () => ({
  type: CLEAR_ERROR,
  payload: undefined,
});

/**
 * Store Creator
 */
const api = "http://localhost:3000/todo";

const defaultState = {
  todoList: [],
  error: null,
};

const headers = {
  "Content-Type": "application/json; charset=utf-8",
};

const httpMethod = {
  post: "POST",
  get: "GET",
  patch: "PATCH",
  delete: "DELETE"
}

const reducer = async (prevState, { type, payload }) => {
  switch (type) {
    case FETCH_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(api).then((d) => d.json());
        return { todoList: resp.todoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case ADD_TODO_ACTION_TYPE: {
      try {
        const resp = await fetch(api, { 
          method: httpMethod.post,
          body: JSON.stringify(payload),
          headers: headers 
        }).then((d) => d.json());
        const nextTodoList = prevState.todoList.concat()
        nextTodoList.push(resp)
        return { todoList: nextTodoList, error: null };
      } catch (err) {
        return { ...prevState, error: err };
      }
    }
    case PATCH_TODO_ACTION_TYPE: {
      const url = api + '/' + payload.id;
      payload.done = !payload.done
      try {
          const resp = await fetch(url, { 
            method: httpMethod.patch,
            body: JSON.stringify(payload),
            headers: headers
          }).then((d) => d.json());
          const index = prevState.todoList.findIndex(todo => todo.id === payload.id);
          // 一応確認。存在しない要素に代入とかはしたくないなーって
          if (prevState[index] === null){
            return prevState;
          }
          // アドレスじゃなくて配列のコピーを！
          const nextTodoList = prevState.todoList.concat();
          nextTodoList[index] = resp
          return { todoList: nextTodoList, error: null };
      }
      catch (err) {
          return { ...prevState, error: err };
      }
    }
    case CLEAR_ERROR: {
      return { ...prevState, error: null };
    }
    default: {
      throw new Error("unexpected action type: %o", { type, payload });
    }
  }
};

export function createStore(initialState = defaultState) {
  const dispatcher = new Dispatcher();
  let state = initialState;

  const dispatch = async ({ type, payload }) => {
    console.group(type);
    console.log("prev", state);
    state = await reducer(state, { type, payload });
    console.log("next", state);
    console.groupEnd();
    dispatcher.dispatch();
  };

  const subscribe = (subscriber) => {
    dispatcher.subscribe(() => subscriber(state));
  };

  return {
    dispatch,
    subscribe,
  };
}
