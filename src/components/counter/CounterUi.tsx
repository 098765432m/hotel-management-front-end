"use client";

import {
  decrement,
  increByAmount,
  increment,
  incrementAsync,
  reset,
} from "@/state/counter/counterSlice";
import { AppDispatch, RootState } from "@/state/store";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

export default function CounterUi() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <div>Test Field</div>
      <div>Counter: {count}</div>{" "}
      <div>
        <>
          <button onClick={() => dispatch(reset())}>Reset Count</button>
        </>
      </div>
      <div className="flex justify-around">
        <Button type="primary" onClick={() => dispatch(incrementAsync(5))}>
          Add 1
        </Button>
        <Button type="primary" onClick={() => dispatch(decrement())}>
          Minus 1
        </Button>
        <Button type="primary" onClick={() => dispatch(increByAmount(34))}>
          Add 34
        </Button>
      </div>
    </div>
  );
}
