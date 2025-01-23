const User = require('../sequelize/User');

const verifyLogIn = async (req, res, next) => {
  const { id } = req.session; 
  if (!id) {
    return res.status(403).send({ message: "User not logged in." });
  }

  const user = await User.findByPk(id);
  if (!user) {
    return res.status(403).send({ message: "User not found in the session." });
  }
  req.user = user;
  next();
};

module.exports = { verifyLogIn };
