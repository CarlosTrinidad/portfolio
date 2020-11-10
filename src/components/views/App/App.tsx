import "./App.less";

import { FirebaseAppProvider, SuspenseWithPerf } from "reactfire";

import Loader from "../../common/Loader/Loader";
import React from "react";
import Routes from "../../../router/Routes";

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

function App() {
  return (
    <FirebaseAppProvider firebaseConfig={config}>
      <SuspenseWithPerf
        fallback={<Loader />}
        traceId={"loading-app-status"}
      >
        <div className="App">
          <Routes />
        </div>
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  );
}

export default App;
