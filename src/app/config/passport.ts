/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../module/user/user.model";
import { Role } from "../module/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from 'bcryptjs'

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email: email });

            if (!isUserExist) {
                return done(null, false, { message: "User does not exist" })
            }

            const isGoogleAuthenticated = isUserExist.auths.some(providerObj => providerObj.provider === "google");

            if (isGoogleAuthenticated && !isUserExist.password) {
                return done(null, false, { message: "You have authenticated through google. If you want to login with email & password, please set a password at first." })
            }

            const isPasswordMatch = await bcryptjs.compare(password as string, isUserExist?.password as string)

            if (!isPasswordMatch) {
                return done(null, false, { message: "Password does not matched." })
            }

            return done(null, isUserExist,)

        } catch (error) {
            console.log(error);
            done(error)
        }
    })
)

passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        },
        async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {

                // console.log("From passport config", { accessToken, refreshToken, profile });

                const email = profile.emails?.[0].value;

                if (!email) {
                    return done(null, false, { message: "Email does not found." })
                }

                let user = await User.findOne({ email: email });

                if (!user) {
                    user = await User.create({
                        email: email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: 'google',
                                providerId: profile.id
                            }
                        ]
                    })
                }

                return done(null, user)

            } catch (error) {
                console.log("Google strategy error", error);
                done(error)
            }
        }
    )
)



passport.serializeUser((user: any, done) => {
    done(null, user._id)
});

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})