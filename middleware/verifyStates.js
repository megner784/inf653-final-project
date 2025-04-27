const statesData = require('../models/statesData.json');

// Create an array of valid state codes
const stateCodes = statesData.map(state => state.code.toUpperCase());

const verifyStates = (req, res, next) => {
    const stateCode = req.params.state.toUpperCase();

    console.log(`verifyStates middleware processing state: ${req.params.state}`);

    if (!stateCodes.includes(stateCode)) {
        // return res.status(400).json({ message: `Invalid state code: ${req.params.state}` });
        return res.status(400).json({ message: "Invalid state abbreviation parameter" });
    }

    req.code = stateCode; // Attach validated code to request object
    console.log(`Middleware validated stateCode: ${req.code}`); // ✅ Log immediately after assignment

    next();
};

module.exports = verifyStates;
