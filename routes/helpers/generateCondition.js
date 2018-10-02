const generateCondition = (date, kinds) => {
  const condition = {
    // date: new Date(date).getTime(),
  };

  Object.keys(kinds).forEach(kind => {
    switch (kinds[kind]) {
      case '1':
        condition[`no.${kind}`] = false;
        break;
      case '2':
        condition[`must.${kind}`] = false;
        break;
      default:
        break;
    }
  });

  return condition;
};

module.exports = generateCondition;
