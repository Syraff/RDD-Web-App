import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./Store";
import { decremented, incremented } from "./features/counterSlice";

export default function ExampleStore() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <>
      <div>
        <h1>Count: {count}</h1>
        <button onClick={() => dispatch(incremented())}>+1</button>
        <button onClick={() => dispatch(decremented())}>-1</button>
      </div>
    </>
  );
}
