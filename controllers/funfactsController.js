const State = require('../models/States');
const statesData = require('../models/statesData.json'); // Load static state info

const getStateName = (stateCode) => {
    const state = statesData.find(st => st.code === stateCode.toUpperCase());
    return state ? state.state : stateCode; // Default to stateCode if not found
};

const getStateFunFact = async (req, res) => {
    try {
        const mongoState = await State.findOne({ stateCode: req.code });

        if (!mongoState || !mongoState.funfacts || mongoState.funfacts.length === 0) {
            return res.status(404).json({ message: `No fun facts found for ${req.code}` });
        }

        const randomFact = mongoState.funfacts[Math.floor(Math.random() * mongoState.funfacts.length)];
        //res.json({ state: req.code, funfact: randomFact });
        res.json({ funfact: randomFact });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const addFunFact = async (req, res) => {
    try {
        console.log(`Incoming request body:`, JSON.stringify(req.body, null, 2));

        if (!req.body.funfacts || !Array.isArray(req.body.funfacts)) {
            return res.status(400).json({ message: "State fun facts value required" });
        }

        let state = await State.findOne({ stateCode: req.code });
        let isNewState = false;

        if (!state) {
            console.log(`State ${req.code} not found—creating a new entry.`);
            state = new State({ stateCode: req.code, funfacts: req.body.funfacts });
            isNewState = true; // Flagging as a new document
        } else {
            console.log(`State ${req.code} exists—adding fun facts.`);
            state.funfacts.push(...req.body.funfacts);
        }

        await state.save();
        //res.json({ message: "Fun fact added successfully!", state });
        //res.status(201).json({ state });
        // ✅ Dynamically set status based on whether state was newly created or just updated
        res.status(isNewState ? 201 : 200).json({
            _id: state._id,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            __v: state.__v
        });
        

    } catch (error) {
        console.error("Error in addFunFact:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const updateFunFact = async (req, res) => {
    try {
        console.log(`Incoming request body:`, JSON.stringify(req.body, null, 2));

        if (!req.body.index) {
            return res.status(400).json({ message: "Invalid request body. Must provide 'index'." });
        }

        if (!Number.isInteger(req.body.index)) {  // ✅ Ensure index is a whole number
            return res.status(400).json({ message: "Index must be an integer." });
        }

        /*
        if (!req.body.index || typeof req.body.index !== 'number') {
            return res.status(400).json({ message: "Invalid request body. Must provide 'index' as a number." });
        }
        */

        if (!req.body.funfact) {
            return res.status(400).json({ message: "Invalid request body. Must provide 'funfact' as a string." });
        }

        const state = await State.findOne({ stateCode: req.code });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Fact found for ${req.code}.` });
        }

        // Adjust the one-based index to zero-based for array access
        const adjustedIndex = req.body.index - 1;

        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${getStateName(req.code)} `});
        }

        state.funfacts[adjustedIndex] = req.body.funfact; // ✅ Updating based on adjusted zero-based index
        await state.save();

        res.json({ message: "Fun fact updated successfully!", state });
    } catch (error) {
        console.error("Error in updateFunFact:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

const deleteFunFact = async (req, res) => {
    try {
        console.log(`Incoming request body:`, JSON.stringify(req.body, null, 2));

        if (!req.body.index) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        if (!Number.isInteger(req.body.index)) {  // ✅ Ensure index is an integer
            return res.status(400).json({ message: "Index must be an integer." });
        }
        
        /*
        if (!req.body.index || typeof req.body.index !== 'number') {
            return res.status(400).json({ message: "Invalid request body. Must provide 'index' as a number." });
        }
        */

        const state = await State.findOne({ stateCode: req.code });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${getStateName(req.code)}`});
        }

        // Adjust the one-based index to zero-based for array access
        const adjustedIndex = req.body.index - 1;

        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${getStateName(req.code)}`});
        }

        state.funfacts.splice(adjustedIndex, 1); // ✅ Removes fun fact at the correct index
        await state.save();

        //res.json({ message: "Fun fact deleted successfully!", state });
        res.status(200).json({
            _id: state._id,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            __v: state.__v
        });

    } catch (error) {
        console.error("Error in deleteFunFact:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

module.exports = { 
    getStateFunFact,
    addFunFact,
    updateFunFact,
    deleteFunFact
 };
