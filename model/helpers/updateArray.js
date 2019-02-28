const updatePrimateArray = (arr, val) => {
  if (arr.includes(val)) return arr;

  return [...arr, val];
};

const updateIdArray = (arr, val) => {
  const newArr = arr.map(a => a.toHexString());
  const newVal = val.toHexString();

  if (newArr.includes(newVal)) return arr;

  return [...arr, val];
};

const updateTimeArray = (arr, val) => {
  const newArr = arr.map(a => a.since);
  const newVal = val.since;

  if (newArr.includes(newVal)) return arr;

  return [...arr, val];
};

module.exports = { updateIdArray, updatePrimateArray, updateTimeArray };
