//server.js
const express = require("express");
const app = express();
const cors = require("cors");
const sequelize = require("./sequelize/sequelize");
const port = 3020;
const session = require("client-sessions");
const clientUrl = "http://localhost:3000";

const userRoutes = require("./routes/userRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const noteRoutes = require("./routes/noteRoutes");
const groupRoutes = require("./routes/groupRoutes");
const User = require("./sequelize/User");
const Subject = require("./sequelize/Subject");
const Note = require("./sequelize/Note");
const Group = require("./sequelize/Group");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(port, () => console.log("Server up on http://localhost:" + port));

Note.belongsToMany(User, { through: "users-notes", as: "sharedUsers" });
User.belongsToMany(Note, { through: "users-notes", as: "sharedNotes" });

User.hasMany(Note, { foreignKey: "creatorId", as: "createdNotes" });
Note.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

Subject.hasMany(Note, { foreignKey: "subjectId", as: "notes" });
Note.belongsTo(Subject, { foreignKey: "subjectId", as: "subject" });

Group.belongsToMany(User, { through: "users-groups", as: "members" });
User.belongsToMany(Group, { through: "users-groups", as: "groups" });

User.hasMany(Group, { foreignKey: "admin", as: "adminGroups" });
Group.belongsTo(User, { foreignKey: "admin", as: "adminUser" });

Group.belongsToMany(Note, { through: 'group-note' });
Note.belongsToMany(Group, { through: 'group-note' });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", clientUrl);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.options("*", cors({ origin: clientUrl }));

app.get("/*", (req, res, next) => {
  res.header("Cache-Control", "no-cache, no-store");
  next();
});

app.use(
  session({
    cookieName: "session",
    cookie: { secure: false },
    secret:
      "eg[isfd-8yF9-7w2315dfergergpok123+Ijsli;;termgerdfkhmdkrherhhehwemgro8",
    duration: 7200000,
    activeDuration: 300000,
    httpOnly: true,
    ephemeral: true,
  })
);


app.get("/initialize", async (req, res, next) => {
  try {
    await sequelize.sync({ alter: true })
    .then(() => console.log('Database synchronized'))
    .catch(err => console.error('Error synchronizing database:', err));  
  } catch (err) {
    next(err);
  }
});

app.use("/users", userRoutes);
app.use("/notes", noteRoutes);
app.use("/subjects", subjectRoutes);
app.use("/groups", groupRoutes);
