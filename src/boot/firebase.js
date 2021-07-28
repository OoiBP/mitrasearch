import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/database";
import "firebase/storage";
import config from "src/utils/environment";

const firebaseConfig = { ...config.firebase };
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const storage = firebase.storage();

export { db, storage };
