import { maxBy } from "lodash";

const createNewLayerId = layers => {
  return maxBy(layers, "id").id + 1;
};

export default createNewLayerId;
