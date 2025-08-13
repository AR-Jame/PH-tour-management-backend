import express, { Request, Response } from 'express';
import cors from 'cors'
import { router } from './routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import expressSession from 'express-session';

import './app/config/passport'

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser());
app.use(expressSession({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


app.use("/api/v1", router);


app.get('/', (req: Request, res: Response) => {
    res.send('Alhamdulillah, app is running')
})


app.use(globalErrorHandler)

app.use(notFound)

export default app