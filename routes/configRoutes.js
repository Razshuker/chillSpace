const indexR = require("./index");
const usersR = require("./users");
const placesR = require("./places");
const categoriesR = require("./categories");
const tagsR = require("./tags");
const postsR = require("./posts");




exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/places", placesR);
  app.use("/categories", categoriesR);
  app.use("/tags", tagsR);
  app.use("/posts", postsR);


  app.use("/*", (req, res) => {
    res.status(404).json({ msg: "Endpoint/page not found, 404" })
  })
}