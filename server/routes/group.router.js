const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// GET route to return logged in users groups
router.get('/', (req, res) => {
  console.log('/group GET route');
  const queryText = `SELECT groups.name, groups.id FROM groups JOIN memberships ON groups.id=memberships.group_id
                    JOIN "users" ON "users".id=memberships.user_id WHERE users.id=$1;`;
  pool.query(queryText, [req.user.id])
    .then((result) => {
      res.send(result.rows);
    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
  });
});

// POST route to create a new group (creates new group, but needs to add owner to it automatically)
router.post('/', (req, res) => {
  console.log('/group POST route');
  const queryText = `INSERT INTO groups ("owner", "name", "description")
                      VALUES ($1, $2, $3) RETURNING *;`;
  pool.query(queryText, [req.user.id, req.body.name, req.body.description])
    .then((result) => {
      res.send(result.rows[0]);
    }).catch((error) => {
      console.log(error);
      res.sendStatus(500);
  });
});

// PUT route to edit an existing group that you created
router.put('/:id', (req, res) => {
  console.log('req body', req.body);
  console.log('req params', req.params);
  const queryText = `UPDATE groups SET name=$1, description=$2
                      WHERE groups.id=$3 AND groups.owner=$4;`;
  pool.query(queryText, [req.body.name, req.body.description, req.params.id, req.user.id])
    .then((result) => {
      res.sendStatus(200);
   })
  .catch((error) => {
      console.log('Error in put, updating event:', error);
      res.sendStatus(500);
  });
});

// DELETE route to delete an existing group that you created
// (need alert if you try deleting something that isn't yours)
router.delete('/:id', (req, res) => {
  const queryText = `DELETE FROM groups WHERE groups.owner=$1 AND groups.id=$2;`;
  pool.query(queryText, [req.user.id, req.params.id])
      .then((result) => {
          res.sendStatus(200);
      }).catch((error) => {
          console.log('Error deleting event', error);
          res.sendStatus(500);
      });
});

router.delete('/remove-member/:id', (req, res) => {
  console.log('req body', req.body);
  console.log('req params', req.params);
  const queryText = `DELETE FROM "memberships"
	                    USING "users", "groups"
	                    WHERE "users".id=memberships.user_id
	                    AND memberships.group_id=groups.id
	                    AND memberships.user_id=$1 AND groups.owner=$2 AND memberships.group_id=$3;`;
  pool.query(queryText, [req.params.id, req.user.id, req.body.group_id])
    .then((result) => {
    res.sendStatus(200);
}).catch((error) => {
    console.log('Error deleting event', error);
    res.sendStatus(500);
});
})

module.exports = router;
