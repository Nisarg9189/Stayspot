const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateListingSchema, isOwner } = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});
const listingController = require("../controllers/listing.js");

// index route
router.get(
    "/",
    wrapAsync(listingController.index)
);

// new
router.get("/new", isLoggedIn, listingController.renderNewForm);
router.get("/filter/:filter", wrapAsync(listingController.filter));
router.get("/search", wrapAsync(listingController.search));

// show route
router.get(
    "/:id",
    wrapAsync(listingController.showListing),
);

// create route
router.post(
    // "/listings",
    "/",
    isLoggedIn,
    upload.single("listing[image]"),
    validateListingSchema,
    wrapAsync(listingController.createListing)
);

// edit route
router.get(
    // "/listings/:id/edit",
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm),
);

// update route
router.put(
    // "/listings/:id",
    "/:id",
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListingSchema,
    wrapAsync(listingController.updateListing)
);

// delete route
router.delete(
    // "/listing/:id",
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

module.exports = router;