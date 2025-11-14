const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {

    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    // console.log(listing);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send()

    // console.log(response.body.features[0].geometry.coordinates);

    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, filename);
    // console.log("POST /listings req.body ->", req.body);
    const newListing = new Listing(req.body.listing);
    // console.log("Constructed Listing ->", newListing);
    // console.log(req.user);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    // console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
}

module.exports.renderEditForm = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res, next) => {
    let { id } = req.params;
    // console.log("PUT /listings/:id req.body ->", req.body);
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing = async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
}

module.exports.filter = async (req, res) => {
    const {filter} = req.params;
    console.log(filter);

    let allListings = await Listing.find({types: filter});
    // console.log(allListings);
    
    res.render("listings/index.ejs", {allListings});
}

module.exports.search = async (req, res) => {
    const query = req.query.q?.trim().toLowerCase();
    console.log(req.query.q?.trim());

    if (!query) {
        // If empty search → show all listings
        const allListings = await Listing.find({});
        return res.render("listings/index.ejs", { allListings });
    }

    // Search in: title, location, country, types
    const allListings = await Listing.find({
        $or: [
            { title: { $regex: query, $options: "i" } },
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } },
            { types: { $regex: query, $options: "i" } }
        ]
    });

    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
}