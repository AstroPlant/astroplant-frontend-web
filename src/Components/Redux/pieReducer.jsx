import { createReducer } from "../../app/common/util/reducerUtil";

const initialPieData = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 }
];

export default createReducer(initialPieData, []);
