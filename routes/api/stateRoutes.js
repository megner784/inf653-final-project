const express  = require('express');
const router   = express.Router();
const statesDataController = require('../../controllers/statesDataController');
const verifyStates = require('../../middleware/verifyStates'); // Import middleware
const funfactsController = require('../../controllers/funfactsController');

// Setup routes
router.route('/').get(statesDataController.getAllStates);

// Apply `verifyStates` middleware for all state-specific routes
router.route('/:state')
    .get(verifyStates, statesDataController.getState);

router.route('/:state/funfact')
    .get(verifyStates, funfactsController.getStateFunFact);

router.route('/:state/capital')
    .get(verifyStates, statesDataController.getStateCapital);
router.route('/:state/nickname')
    .get(verifyStates, statesDataController.getStateNickname);
router.route('/:state/population')
    .get(verifyStates, statesDataController.getStatePopulation);
router.route('/:state/admission')
    .get(verifyStates, statesDataController.getStateAdmission);

module.exports = router;



