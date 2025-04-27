const State = require('../models/States'); // MongoDB Model

const data     = {
    states: require('../models/statesData.json'),
    setStates: function (data) { this.states = data }
}

const getAllStates = async (req, res) => {
    try {
        const { contig } = req.query; // Check for contiguous/non-contiguous filter
        let statesList = data.states; // Default: all states from JSON

        // Apply contiguous/non-contiguous filter
        if (contig === 'true') {
            statesList = statesList.filter(st => st.code !== 'AK' && st.code !== 'HI');
        } else if (contig === 'false') {
            statesList = statesList.filter(st => st.code === 'AK' || st.code === 'HI');
        }

        // Retrieve all fun facts from MongoDB
        const mongoStates = await State.find({});
        
        // Merge fun facts with states data
        const mergedStates = statesList.map(state => {
            const mongoState = mongoStates.find(mongo => mongo.stateCode === state.code);
            return { ...state, funfacts: mongoState?.funfacts || [] }; // Include funfacts if available
        });

        res.json(mergedStates);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getState = async (req, res) => {
    try {
        const state = data.states.find(st => st.code === req.code); // Use verified stateCode
        if (!state) return res.status(400).json({ message: `State code ${req.code} not found` });

        // Fetch fun facts from MongoDB
        const mongoState = await State.findOne({ stateCode: req.code });

        // Merge data and conditionally include funfacts
        let responseData = { ...state }; // Default: JSON data only                                

        if (mongoState && Array.isArray(mongoState.funfacts) && mongoState.funfacts.length > 0) {  
            responseData.funfacts = mongoState.funfacts;  // Add funfacts if available             
        }

        res.json(responseData);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Helper function to find a state by code
const findState = (stateCode) => {
    return data.states.find(st => st.code === stateCode.toUpperCase());
};

const getStateCapital = (req, res) => {
    const state = findState(req.params.state);
    if (!state) return res.status(400).json({ message: `State code ${req.params.state} not found` });

    res.json({ state: state.state, capital: state.capital_city });
};

const getStateNickname = (req, res) => {
    const state = findState(req.params.state);
    if (!state) return res.status(400).json({ message: `State code ${req.params.state} not found` });

    res.json({ state: state.state, nickname: state.nickname });
};

const getStatePopulation = (req, res) => {
    const state = findState(req.params.state);
    if (!state) return res.status(400).json({ message: `State code ${req.params.state} not found` });

    res.json({ state: state.state, population: state.population.toLocaleString() });
};

const getStateAdmission = (req, res) => {
    const state = findState(req.params.state);
    if (!state) return res.status(400).json({ message: `State code ${req.params.state} not found` });

    res.json({ state: state.state, admitted: state.admission_date });
};

module.exports = {
    getAllStates,
    getState,
    getStateCapital,
    getStateNickname,
    getStatePopulation,
    getStateAdmission
}