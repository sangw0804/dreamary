const generateCondition = (date, kinds, gender, sido, sigungu) => {
  const condition = {
    // requireGender: { $in: [gender, 'both'] }
    // date: new Date(date).getTime(),
    reservable: true
  };
  if (gender) condition.requireGender = { $in: [gender, 'both'] };

  if (sido) condition.sido = sido;
  if (sigungu) condition.sigungu = sigungu;
  if (date) condition.date = date;

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
