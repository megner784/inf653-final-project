const express = require('express');
const router = express.Router();
const funfactsController = require('../../controllers/funfactsController');
const verifyStates = require('../../middleware/verifyStates'); // Verify state codes

console.log("funfactRoutes initialized with /:state/funfact");

console.log("funfactRoutes.js received request for /:state/funfact");

router.get('/verify-test/:state', verifyStates, (req, res) => {
    res.json({ message: `verifyStates worked! State validated: ${req.code}` });
});

/*
router.route('/:state/funfact').get(verifyStates, funfactsController.getStateFunFact);  // Retrieve a random fun fact
router.route('/:state/funfact').post(verifyStates, funfactsController.addFunFact);      // Add new fun facts
router.route('/:state/funfact').patch(verifyStates, funfactsController.updateFunFact);  // Update an existing fun fact
router.route('/:state/funfact').delete(verifyStates, funfactsController.deleteFunFact); // Remove a fun fact
*/

router.route('/:state/funfact')
    .get(verifyStates, funfactsController.getStateFunFact)   // Retrieve a fun fact
    .post(verifyStates, funfactsController.addFunFact)       // Add new fun facts
    .patch(verifyStates, funfactsController.updateFunFact)   // Update an existing fun fact
    .delete(verifyStates, funfactsController.deleteFunFact); // Remove a fun fact

// Debugging: Log registered routes for funfactRoutes
router.stack.forEach(layer => {
    if (layer.route) {
        console.log(`funfactRoutes registered route: ${layer.route.path}`);
    }
});

module.exports = router;
