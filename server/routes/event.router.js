const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');
// const { rejectUnauthenticated } = require('../modules/authentication-middleware');

// This route returns the logged in users events
router.get('/', (req, res) => {
    console.log('/event GET route');
    // console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);
    const queryText = `SELECT events.event_name, events.event_id FROM rsvp JOIN memberships 
                    ON rsvp.membership_id=memberships.id
                    JOIN events ON events.event_id=rsvp.event_id
                    WHERE memberships.user_id=$1;`;
    pool.query(queryText, [req.user.id]).then((result) => {
        res.send(result.rows);
    }).catch((error) => {
        console.log(error);
        res.sendStatus(500);
    });
});

// This route adds an event for the logged in user
router.post('/', async (req, res) => {
    console.log('/event POST route');
    console.log(req.body);
    // console.log('is authenticated?', req.isAuthenticated());
    console.log('user', req.user);

    try {
        const result = await pool.query(`INSERT INTO "events" ("event_date", "event_time", "event_name", "description", "location", "event_type_id", "event_admin", "group_id")
                                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`, 
                                         [req.body.event_date, req.body.event_time, req.body.event_name, req.body.description, req.body.location, req.body.event_type_id, req.user.id, req.body.group_id]);
        res.send(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Edit (PUT) event (can only edit an event you made)
router.put('/:id', (req, res) => {
    console.log('req body', req.body);
    console.log('req params', req.params);
    const queryText = `UPDATE events SET event_date=$1, event_time=$2, event_name=$3, description=$4, location=$5
                        WHERE event_id=$6 AND event_admin=$7;`;
    pool.query(queryText, [req.body.event_date, req.body.event_time, req.body.event_name, req.body.description,
                            req.body.location, req.params.id, req.user.id])
    .then((result) => {
        res.sendStatus(200);
     })
    .catch((error) => {
        console.log('Error in put, updating event:', error);
        res.sendStatus(500);
    });
});

// Delete event (doesn't allow non-creator to delete event, but need to make an alert)
router.delete('/:id', (req, res) => {
    const queryText = `DELETE FROM events WHERE event_admin=$1 AND event_id=$2;`;
    pool.query(queryText, [req.user.id, req.params.id])
        .then((result) => {
            res.sendStatus(200);
        }).catch((error) => {
            console.log('Error deleting event', error);
            res.sendStatus(500);
        });
});

module.exports = router;