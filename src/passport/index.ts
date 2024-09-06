import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import passportLocal from "passport-local";
import passportCustom from "passport-custom";

import { verifySignin } from "../utils/etherutils";

import { Express } from "express";

import WalletUser from "../models/User";

import {
  findUserByEmail,
  findUserByGoogleId,
  registerUserByEmail,
} from "../controller/user";

import { findUserByWallet } from "../controller/user";

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../utils/secrets";

const GoogleStrategy = passportGoogle.Strategy;
const LocalStrategy = passportLocal.Strategy;
const CustomStrategy = passportCustom.Strategy;

export const configurePassport = (app: Express) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await findUserByWallet(id as `0x${string}`);
    done(null, user.data);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/redirect",
      },
      async (accessToken, refreshToken, profile, done) => {
        const exists = await findUserByGoogleId(profile.id);
        if (exists.success == true) done(null, exists.data);
        else {
          const newUser = await registerUserByEmail({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0].value ?? "",
            apiKeys: [],
          });
          if (newUser.success == true) {
            done(null, newUser.data);
          }
        }
      },
    ),
  );

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        const exists = await findUserByEmail(email);
        if (exists.success == true) {
          if (!exists.data.authenticate(password))
            return done(null, false, { message: "Invalid Password" });
          else return done(null, exists.data);
        }
        return done(null, false, { message: "Unknown User" });
      },
    ),
  );

  passport.use('wallet', new CustomStrategy(async (req, done) => {
    const signedMessage = (req.body as any).signedMessage;
    const walletAddress = (req.body as any).walletAddress;

    const verified = await verifySignin(signedMessage);
    if (!verified)
      return done(null, false);

    const exists = await findUserByWallet(walletAddress);
    if (exists.success == true)
    {
      return done(null, exists.data.walletAddress);
    }
    else return done(null, false);
  }));

  app.use(passport.initialize());
  app.use(passport.session());
};
