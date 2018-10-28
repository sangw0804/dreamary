const generateCondition = (date, kinds, gender, region) => {
  const condition = {
    // requireGender: { $in: [gender, 'both'] }
    // date: new Date(date).getTime(),
  };
  if (gender) condition.requireGender = { $in: [gender, 'both'] };
  if (region) condition.region = region;

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
