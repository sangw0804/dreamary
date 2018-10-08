const generateCondition = (date, kinds, gender, region) => {
  const condition = {
    // date: new Date(date).getTime(),
    requireGender: gender,
    region
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
