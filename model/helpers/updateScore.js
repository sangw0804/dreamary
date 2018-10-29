const addScore = (recruitScore, reviewScore, length) =>
  ((recruitScore * (length - 1) + reviewScore) / length).toFixed(1);

const removeScore = (recruitScore, reviewScore, length) => {
  if (length === 1) return 0.0;
  return ((recruitScore * length - reviewScore) / (length - 1)).toFixed(1);
};

module.exports = { removeScore, addScore };
