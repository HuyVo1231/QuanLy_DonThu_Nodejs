const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const morgan = require("morgan");
const app = express();
const port = 3000;
const session = require("express-session");
const route = require("./routes/");
const db = require("./config/db");
const SortMiddleware = require("./app/middleware/SortMiddleware");
const methodOverride = require("method-override");
const flash = require("express-flash");

app.use(methodOverride("_method"));
// use Middleware
app.use(SortMiddleware);
app.use(express.urlencoded());
app.use(express.json());

// use Session
app.use(
    session({
        secret: "4444",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(flash());
// connect to database
db.connect();

app.use(express.static(path.join(__dirname, "public")));
// Use morgan
app.use(morgan("combined"));
// Use handlebars hỗ trợ render ra. (res.render)
app.engine(
    "hbs",
    hbs.engine({
        extname: ".hbs",
        helpers: require("./app/helpers/handlebar"),
    })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resources/views"));

// Route init
route(app);

app.listen(port, () => {
    console.log("post dang chay o host");
});
