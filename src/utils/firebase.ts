import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/performance";
import "firebase/analytics";

import * as firebase from "firebase/app";

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
firebase.initializeApp(config);

export const auth = firebase.auth;
export const db = firebase.database();
export const firestore = firebase.firestore;
export const performance = firebase.performance();
export const analytics = firebase.analytics();