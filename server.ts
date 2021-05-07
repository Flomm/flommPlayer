import { app } from './routes';
import { client } from './src/Backend/postgreConnection';

const port: number = 8000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});

client.connect((err: Error) => {
  if (err) {
    throw err;
  }
  client.query("SET search_path TO 'player';");
  console.log('Connected');
});
