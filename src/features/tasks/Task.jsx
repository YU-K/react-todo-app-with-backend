// @ts-check

import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';

import { tasksActions } from './tasksSlice.js';
import routes from '../../api/routes.js';

const taskStates = {
  idle: 'idle',
  loading: 'loading',
};

const Task = ({ task }) => {
  const dispatch = useDispatch();
  const [state, setState] = useState(taskStates.idle);

  const checkboxRef = useRef();
  const buttonRef = useRef();

  const remove = async () => {
    try {
      setState(taskStates.loading);
      const url = routes.task(task.id);
      await axios.delete(url);
      setState(taskStates.idle);
      dispatch(tasksActions.remove(task.id));
    } catch (err) {
      setState(taskStates.idle);
      buttonRef.current?.focus();
      toast('Network error');
    }
  };

  const toggleCompleted = async ({ target }) => {
    try {
      setState(taskStates.loading);
      const url = routes.task(task.id);
      const { data } = await axios.patch(url, { completed: target.checked });
      dispatch(tasksActions.update(data));
    } catch (err) {
      toast('Network error');
    }
    setState(taskStates.idle);
    checkboxRef.current?.focus();
  };

  return (
    <div className="row align-items-center justify-content-between">
      <div className="col-8">
        <label className="pointer" htmlFor={`task-${task.id}`}>
          <input
            id={`task-${task.id}`}
            className="me-2"
            type="checkbox"
            onChange={toggleCompleted}
            disabled={state === taskStates.loading}
            ref={checkboxRef}
            checked={task.completed}
          />
          {task.completed ? <s>{task.text}</s> : task.text}
        </label>
      </div>
      <div className="col-4 d-flex justify-content-end">
        <button
          onClick={remove}
          className="btn btn-sm btn-danger"
          type="button"
          disabled={state === taskStates.loading}
          ref={buttonRef}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default Task;
