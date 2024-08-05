const mongoose = require ('mongoose');
const Trip = require ('../models/travlr'); //register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
//Regardless of outcome, response must include HTML status code
// and JSON message to the requesting client
const tripsList = async(req, res) => {
    const q = await Model
    
        .find({}) //No filter, return all records
        .exec();

        // uncomment the following line to show the results of query
        // on the console
        //console.log(q);

    if(!q)
    {// Database returned no data
        return res
                    .status(404)
                    .json(err);}
    else { // return resulting trip list
        return res
                    .status(200)
                    .json(q);0}
};const tripsFindByCode = async(req, res) => {
    const q = await Model
    
        .find({'code' : req.params.tripCode}) //return single record //No filter, return all records
        .exec();

        // uncomment the following line to show the results of query
        // on the console
        //console.log(q);

    if(!q)
    {// Database returned no data
        return res
                    .status(404)
                    .json(err);}
    else { // return resulting trip list
        return res
                    .status(200)
                    .json(q);0}
};

module.exports = {
    tripsList,
    tripsFindByCode
};
