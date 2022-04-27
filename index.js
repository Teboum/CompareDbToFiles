const express = require("express")
const path = require("path");
const Router = require("./routes/mainRouter")

const app = express()


app.use(express.static(path.join(__dirname, "assets")));
app.use(express.static(path.join(__dirname, "images")));



app.set("view engine", "ejs");
app.set("views", "views"); //2nd folder default

app.use('/',Router)




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("listen port :", PORT);
});