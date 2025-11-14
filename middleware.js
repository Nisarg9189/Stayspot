const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path, "..", req.originalUrl);
    if(!req.isAuthenticated()) { // for checking in current session user is loggedin or not
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in!");
        return res.redirect("/login");
    }

    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }

    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
        // console.log("PUT /listings/:id req.body ->", req.body);
        let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.currentUser._id)) {
            req.flash("error", "You are not the owner of this listing");
            return res.redirect(`/listing/${id}`);
        }

        next();
}

module.exports.validateListingSchema = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        console.log(error);
        console.log("Validation failed ->", error.details.map((d) => d.message));
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    console.log("Validation passed (no error)");
    next();
};

module.exports.validateReviewSchema = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        console.log("Validation failed ->", error.details.map((d) => d.message));
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    console.log("Validation passed (no error)");
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
        // console.log("PUT /listings/:id req.body ->", req.body);
        let review = await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currentUser._id)) {
            req.flash("error", "You are not the author of this review");
            return res.redirect(`/listing/${id}`);
        }

        next();
}