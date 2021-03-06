const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const path = require("path");
const users = require("./routes/api/users");
const recipients = require("./routes/api/recipients");
const messages = require("./routes/api/messages");
const cron = require("node-cron")
// Bodyparser middleware
app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(express.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
require("./mailing/mailing2test")
// Routes
app.use("/api/users", users);
app.use("/api/recipients", recipients);
app.use("/api/messages", messages);

// Serve static assets if in production
if(process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 8080; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !!`));