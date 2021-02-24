
import express from 'express';
import * as http from 'http';
import * as bodyparser from 'body-parser';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';
import { debuglog } from 'util';

//Route configuration
abstract class CommonRoutesConfig {

    app: express.Application;
    name: string;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
    }

    //functions
    getName() {
        return this.name;
    }

    //Abstract Functions
    abstract configureRoutes(): express.Application;

}

class MailRoutes extends CommonRoutesConfig {

    constructor(app: express.Application) {
        super(app, 'MailRoutes');
    }
    configureRoutes() {
        //configure all routes here
        this.app.route('/api/v1/mailmass')
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                //middleware function

                next();
            })
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send("Get at mailmass")
            })

            .post((req: express.Request, res: express.Response) => {
                res.status(200).send("post response");
            })

        return this.app;
    }

}


const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port: Number = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');

// here we are adding middleware to parse all incoming requests as JSON 
app.use(bodyparser.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
routes.push(new MailRoutes(app));


// here we are configuring the expressWinston logging middleware,
// which will automatically log all HTTP requests handled by Express.js
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
}))

// this is a simple route to make sure everything is working properly
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send('Server up and running')
})

//Here we start our server
server.listen(port, () => {
    debugLog(`Server running at ${port}`);
    routes.forEach((route: CommonRoutesConfig) => {
        debuglog(`Router configured for ${route.getName()}`);
    })
})