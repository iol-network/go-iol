import { PORT } from './configs/server_config';
import app from './server/server';
import Cluster from './server/cluster'

new Cluster(app, PORT);