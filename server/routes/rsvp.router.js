const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');


// Get RSVPs for specific event
router.get('/:id', (req, res) => {
    console.log('/rsvp GET route');
    const queryText = `SELECT rsvp.event_id, rsvp.status, memberships.user_id 
                        FROM rsvp JOIN memberships ON rsvp.membership_id=memberships.id
	                    JOIN events ON rsvp.event_id=events.event_id
	                    WHERE events.event_id=$1;`;
    pool.query(queryText, [req.params.id])
        .then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });
})

// Get RSVPs for logged in user
router.get('/', (req, res) => {
    console.log('/rsvp GET route');
    const queryText = `SELECT rsvp.event_id, rsvp.status, memberships.user_id 
                        FROM rsvp JOIN memberships ON rsvp.membership_id=memberships.id
	                    JOIN events ON rsvp.event_id=events.event_id
	                    WHERE memberships.user_id=$1;`;
    pool.query(queryText, [req.user.id])
        .then((result) => {
            res.send(result.rows);
        }).catch((error) => {
            console.log(error);
            res.sendStatus(500);
        });
})

// Update an RSVP
router.put('/:id', (req, res) => {
    console.log('RSVP PUT route');
    const queryText = `UPDATE rsvp SET status=$3
	                    FROM memberships
	                    WHERE rsvp.membership_id=memberships.id
	                    AND memberships.user_id=$1
	                    AND rsvp.event_id=$2;`;
    pool.query(queryText, [req.user.id, req.params.id, req.body.status])
        .then((result) => {
            res.sendStatus(200);
        })
        .catch((error) => {
            console.log('Error in put, updating event:', error);
            res.sendStatus(500);
        });
})

module.exports = router;