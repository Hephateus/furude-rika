import 'module-alias/register';

import FurudeRika from '@furude-client/FurudeRika';
import CommandsReader from '@furude-io/CommandsReader';
import Localizer from '@furude-localization/Localizer';
import * as admin from 'firebase-admin';
import 'firebase-admin/lib/firestore';
import DBManager from '@furude-db/DBManager';
import * as dotenv from 'dotenv';

dotenv.config();

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      OSU_API_KEY: string;
      FIREBASE_PROJECT_ID: string;
      FIREBASE_PRIVATE_KEY: string;
      FIREBASE_CLIENT_EMAIL: string;
    }
  }
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});

Localizer.init();
DBManager.init();

const client = new FurudeRika();
client.start();
