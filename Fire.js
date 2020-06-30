import firebase from "firebase";
import "@firebase/firestore";
import { YellowBox } from "react-native";
import _ from "lodash";

YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = (message) => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyADGywt4cAu09hqSDz1_TUy2fc3fHrMDok",
  authDomain: "todoapp-3c333.firebaseapp.com",
  databaseURL: "https://todoapp-3c333.firebaseio.com",
  projectId: "todoapp-3c333",
  storageBucket: "todoapp-3c333.appspot.com",
  messagingSenderId: "916080531417",
  appId: "1:916080531417:web:1c89b1eca1c2b93bdaebc8",
};

class Fire {
  constructor(callback) {
    this.init(callback);
  }

  init(callback) {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        callback(null, user);
      } else {
        firebase
          .auth()
          .signInAnonymously()
          .catch((error) => {
            callback(error);
          });
      }
    });
  }

  getLists(callback) {
    let ref = this.ref.orderBy("name");

    this.unsubscribe = ref.onSnapshot((snapshot) => {
      lists = [];

      snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
      });
      callback(lists);
    });
  }

  addList(list) {
    let ref = this.ref;

    ref.add(list);
  }

  updateList(list) {
    let ref = this.ref;

    ref.doc(list.id).update(list);
  }

  get userId() {
    return firebase.auth().currentUser.uid;
  }

  get ref() {
    return firebase
      .firestore()
      .collection("users")
      .doc(this.userId)
      .collection("lists");
  }

  detach() {
    this.unsubscribe();
  }
}

export default Fire;
