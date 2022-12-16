import db from "./firebase-config.mjs";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

const ref = collection(db, "users");

export const userDefault = async () => {
    let result = [];
    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
    });

    // console.log(`users result = ${JSON.stringify(result)}`);

    return result;
};

export const userFilterName = async (name) => {
    let result = [];
    const querySnapshot = await getDocs(query(ref, where("name", "==", name)));

    if (querySnapshot.empty) {
        result = { error: "no data" };
    } else {
        querySnapshot.forEach((doc) => {
            result.push({ id: doc.id, ...doc.data() });
        });
    }

    return result;
};

export const userAdd = async (
    name,
    avatar = "https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_960_720.png"
) => {
    // add new user
    try {
        const docRef = await addDoc(ref, {
            name: name,
            avatar: avatar,
        });

        console.log(`[Post][User] new user doc.id = ${docRef.id}`);
        console.log(`[Post][User] new user data = ${JSON.stringify(req.body)}`);
        return true;
    } catch (e) {
        console.error(`[Error] user post failed e = ${e}`);
        return e;
    }
};
