import * as express from 'express';
import { client } from './src/Backend/postgreConnection';

export const app = express();
app.use('/lib', express.static('lib'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  req.accepts('application/json');
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).sendFile(__dirname + '/index.html');
});
//Get tls
app.get('/api/tracklists', (req: express.Request, res: express.Response) => {
  client.query('SELECT id, title, is_perm FROM tracklists WHERE is_deleted = false', (err: Error, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ error: 'Database error occured.' });
    }
    if (result.rows.length === 0) {
      return res.status(404).send({ error: 'No available playlists.' });
    }
    res.status(200).send(result.rows);
  });
});
//Get tracks
app.get('/api/tracks/:id', (req: express.Request, res: express.Response) => {
  client.query(
    'SELECT id, title, band, url, list_id, duration, pic_url FROM tracks WHERE list_id = $1 AND is_deleted = false',
    [req.params.id],
    (err: Error, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Database error occured.' });
      }
      if (result.rows.length === 0) {
        return res.status(404).send({ error: 'No available tracks in this playlist.' });
      }
      res.status(200).send(result.rows);
    }
  );
});
//Create tracklist
app.post('/api/tracklists', (req: express.Request, res: express.Response) => {
  client.query('SELECT * FROM tracklists WHERE title = $1', [req.body.title], (err: Error, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send({ error: 'Database error occured. Tracklist not added.' });
    }
    if (result.rows.length !== 0) {
      return res.status(400).send({ error: `Playlist '${req.body.title}' already exists.` });
    }
    client.query(
      'INSERT INTO tracklists (title)  VALUES($1) RETURNING id, title, is_perm',
      [req.body.title],
      (err: Error, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ error: 'Database error occured. Tracklist not added.' });
        }
        res.status(200).send(result.rows[0]);
      }
    );
  });
});
//Add tracks
app.post('/api/tracks', (req: express.Request, res: express.Response) => {
  client.query(
    'SELECT * FROM tracks WHERE title = $1 AND band = $2 AND list_id = $3',
    [req.body.title, req.body.band, req.body.list_id],
    (err: Error, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Database error occured. Track was not added.' });
      }
      if (result.rows.length !== 0) {
        if (result.rows[0].is_deleted) {
          client.query(
            'UPDATE tracks SET is_deleted = false WHERE id = $1',
            [result.rows[0].id],
            (err: Error, result) => {
              if (err) {
                console.log(err);
                return res.status(500).send({ error: 'Database error occured. Track was not added.' });
              }
              return res.sendStatus(200);
            }
          );
        } else {
          return res.status(400).send({ error: `This track is already included in the chosen tracklist.` });
        }
      } else {
        client.query(
          'INSERT INTO tracks (title, band, url, list_id, duration, pic_url)  VALUES($1, $2, $3, $4, $5, $6)',
          [...Object.values(req.body)],
          (err: Error, result) => {
            if (err) {
              console.log(err);
              return res.status(500).send({ error: 'Database error occured. Track was not added.' });
            }
            res.sendStatus(200);
          }
        );
      }
    }
  );
});
//Delete tracklist
app.delete('/api/tracklists/:id', (req: express.Request, res: express.Response) => {
  client.query(
    'UPDATE tracklists SET is_deleted = true WHERE is_perm = false AND is_deleted = false AND id = $1',
    [req.params.id],
    (err: Error, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Database error occured. Tracklist was not deleted.' });
      }
      if (result.rowCount === 0) {
        return res.status(500).send({ error: 'This tracklist cannot be deleted.' });
      }
      client.query('UPDATE tracks SET is_deleted = true WHERE list_id = $1', [req.params.id], (err: Error, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            error:
              'Database error occured, but the tracklist is probably deleted. Try reloading the page to make sure.',
          });
        }
        res.sendStatus(200);
      });
    }
  );
});
//Delete tracks
app.delete('/api/tracks/:id', (req: express.Request, res: express.Response) => {
  client.query(
    'UPDATE tracks SET is_deleted = true WHERE is_deleted = false AND is_perm = false AND id = $1',
    [req.params.id],
    (err: Error, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ error: 'Database error occured. Track was not deleted.' });
      }
      if (result.rowCount === 0) {
        return res.status(500).send({ error: 'Not possible to remove this track.' });
      }
      res.sendStatus(200);
    }
  );
});
