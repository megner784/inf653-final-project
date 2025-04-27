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
            //return res.status(404).json({ message: `No fun facts found for ${req.code}` });               
            return res.status(404).json({ message: `No Fun Facts found for ${getStateName(req.code)}` }); 
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

        // ✅ Check if request body contains the correct key
        if (!req.body.hasOwnProperty('funfacts')) {
            return res.status(400).json({ message: "State fun facts value required" });
        }

        // Step 1: Check if funfacts is an array
        if (!Array.isArray(req.body.funfacts)) {                                                         
            return res.status(400).json({ message: "State fun facts value must be an array" });          
        }

        // Step 2: Filter out blank entries
        const filteredFunFacts = req.body.funfacts.filter(fact => fact.trim() !== "");                   

        // Step 3: Ensure there are valid fun facts after filtering
        if (filteredFunFacts.length === 0) {                                                             
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

        // ✅ 1. Check for missing index
        if (req.body.index === undefined || req.body.index === null) {
            return res.status(400).json({ message: "State fun fact index value required" });
        }

        // ✅ 2. Ensure index is an integer
        if (!Number.isInteger(req.body.index)) {
            return res.status(400).json({ message: "Index must be an integer." });
        }

        // ✅ 3a. Special case for index === 0 (explicitly required)
        if (req.body.index === 0) {
            return res.status(400).json({ message: "State fun fact index value required" });
        // ✅ 3b. Special case for index < 0 (explicitly required)
        } else if (req.body.index < 0) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${getStateName(req.code)}` });
        }

        // ✅ 4. Check for missing funfact
        if (!req.body.funfact) {
            return res.status(400).json({ message: "State fun fact value required" });
        }

        // ✅ 5. Retrieve state and validate existence
        const state = await State.findOne({ stateCode: req.code });
        if (!state || !state.funfacts || state.funfacts.length === 0) {
            return res.status(404).json({ message: `No Fun Facts found for ${getStateName(req.code)}` });
        }

        // ✅ 6. Adjust index (convert to zero-based index)
        const adjustedIndex = req.body.index - 1;

        // ✅ 7. Validate index range
        if (adjustedIndex < 0 || adjustedIndex >= state.funfacts.length) {
            return res.status(404).json({ message: `No Fun Fact found at that index for ${getStateName(req.code)}` });
        }

        // ✅ 8. Update funfact
        state.funfacts[adjustedIndex] = req.body.funfact;
        await state.save();

        // ✅ 9. Respond with updated state
        res.status(200).json({
            _id: state._id,
            stateCode: state.stateCode,
            funfacts: state.funfacts,
            __v: state.__v
        });

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
