import db from "./firebase-config.mjs";
import {
    collection,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
} from "firebase/firestore";

export const postFilterId = async (id) => {
    // get post searched by id
    // return {id, title, labels, date, img, context, owner}
    const docSnap = await getDoc(doc(db, "posts", id));
    let result;

    if (docSnap.exists()) {
        result = { id: id, ...docSnap.data() };
    } else {
        result = { error: "no data" };
    }

    return result;
};

export const postPut = async (id, context) => {
    const washingtonRef = doc(db, "posts", id);
    // console.log(`req.body.context => ${JSON.stringify(req.body.context)}`);
    let result;

    await updateDoc(washingtonRef, {
        date: new Date(),
        context: context,
    })
        .then((res) => {
            console.log(`[Put][Post] post doc.id = ${id} success`);
            result = "success";
        })
        .catch((e) => {
            console.log(`[Error][Post] post put failed, error = ${e}`);
            result = e;
        });

    return result;
};

export const postDelete = async (id) => {
    // delete post
    let result;

    await deleteDoc(doc(db, "posts", id));
    result = "delete success";

    return result;
};

export const postAdd = async (title, labels, context, img, owner) => {
    // console.log(`[Post] addpost ${JSON.stringify(req.body)}\n`);
    let result;

    try {
        const docRef = await addDoc(collection(db, "posts"), {
            title: title,
            labels: labels,
            context: context,
            date: new Date(),
            img: img,
            owner: owner,
        });

        console.log(`[Post][post] add new post, doc.id = ${docRef.id}`);
        result = { id: docRef.id };
    } catch (e) {
        result = e;
        console.log(`[Error][Post] addpost failed, e = ${e}`);
    }

    return result;
};
