import firebase from "firebase";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeGh-9GPTWxDQJVqB1mG338DOOieWVtoU",
  authDomain: "test-b55a7.firebaseapp.com",
  projectId: "test-b55a7",
  storageBucket: "test-b55a7.appspot.com",
  messagingSenderId: "545469107722",
  appId: "1:545469107722:web:da147e803e5948dcaf59f3",
  measurementId: "G-8HMW8Y0GJQ"
};
firebase.initializeApp(firebaseConfig);
let auth = firebase.auth();
export { auth, firebase };