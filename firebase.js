// firebaseConfig.js
import {getApp} from '@react-native-firebase/app';
import {getAuth} from '@react-native-firebase/auth';
import {getFirestore} from '@react-native-firebase/firestore';

const app = getApp(); // Use the default Firebase app
const auth = getAuth(app); // Get Auth instance
const db = getFirestore(app); //

export {db, auth};
