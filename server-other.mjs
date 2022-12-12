import db from "./firebase-config.mjs";
import { doc, getDoc } from "firebase/firestore";

export const labelsDefault = async () => {
    // get all labels
    // return ["label", "label"]
    let result;
    const docSnap = await getDoc(doc(db, "config", "labels"));

    if (docSnap.exists()) {
        result = docSnap.data().label;
    } else {
        result = [];
    }

    return result;
};

export const todolistDefault = async () => {
    // get all todolist
    // return [[announcement], [active], [completed]]
    const docSnap = await getDoc(doc(db, "config", "todolist"));
    let result;

    if (docSnap.exists()) {
        // console.log({
        //     announcement: docSnap.data().announcement,
        //     active: docSnap.data().active,
        //     completed: docSnap.data().completed,
        // });
        result = {
            announcement: docSnap.data().announcement,
            active: docSnap.data().active,
            completed: docSnap.data().completed,
        };
    }

    return result;
};
