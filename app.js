if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const Listing = require("./models/listing.js");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const dbUrl = process.env.ATLAS_URL;

main()
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

const sessionOption = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize()); // to initialize passport middileware
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    return res.redirect("/listing");
});

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currentUser = req.user;
    next();
})


app.use("/listing", listingsRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

const stripMarkdownBold = (text) => {
    if (!text) return "";
    return text.replace(/\*\*(.*?)\*\*/g, "$1"); // removes **text**
};

app.post("/ask", async (req, res) => {
    try {
        const { question } = req.body;

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "Chatbot"
                },
                body: JSON.stringify({
                    model: "openrouter/auto",
                    max_tokens: 100,
                    temperature: 0.7,
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a travel assistant specialized in listings. " +
                                "Provide information about rooms, amenities, locations, and activities. " +
                                "Do not make bookings or guarantees. " +
                                "Always advise users to confirm details before planning trips."

                        },
                        {
                            role: "user",
                            content: question
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        console.log(data);
        let answer = data?.choices?.[0]?.message?.content?.trim() || "";
        answer = stripMarkdownBold(answer);
        res.json({
            answer: answer || "Please consult a doctor for professional medical advice."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

// catch-all for unmatched routes
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

// generic error handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("server listening to port 8080");
});