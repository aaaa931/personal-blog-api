// const express = require("express");
// const cors = require("cors");
// const { db } = require("./firebase-config.mjs");
import express from "express";
import cors from "cors";
import db from "./firebase-config.mjs";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
} from "firebase/firestore";
const app = express();
app.use(cors());
app.use(express.json());

const webName = "/personal-blog/";

// user api
app.get(`${webName}user`, async (req, res) => {
    // get user
    // return [{id, name, avatar}]
    let result = [];
    const querySnapshot = await getDocs(collection(db, "users"));

    querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
    });

    res.send(result);
});

app.get(`${webName}user/:name`, async (req, res) => {
    // get user searched by name
    // return {id, name, avatar}
    const name = req.params.name;
    const ref = collection(db, "users");
    const querySnapshot = await getDocs(query(ref, where("name", "==", name)));

    if (querySnapshot.empty) {
        // no data
        res.send({ error: "no data" });
    } else {
        querySnapshot.forEach((doc) => {
            res.send({ id: doc.id, ...doc.data() });
        });
    }
});

app.post(`${webName}user`, async (req, res) => {
    // add new user
    console.log(`[Post] user ${JSON.stringify(req.body)}`);

    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: req.body.name,
            avatar:
                req.body.avatar.length > 0
                    ? req.body.avatar
                    : "https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_960_720.png",
        });

        console.log(`docRef.id ${docRef.id}`);
    } catch (e) {
        console.log(`[Error] user post`);
    }
});

// postlist api
app.get(`${webName}postlist`, async (req, res) => {
    // get all postlist
    // return [{id, title, labels, date, img, context, owner}]
    let result = [];
    const querySnapshot = await getDocs(
        query(collection(db, "posts"), orderBy("date", "desc"))
    );

    querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
    });

    res.send(result);
});

app.get(`${webName}postlist/:label`, async (req, res) => {
    // get postlist searched by label
    // return [{id, title, labels, date, img, context, owner}]
    const label = req.params.label;
    let result = [];
    const ref = collection(db, "posts");
    const querySnapshot = await getDocs(
        query(
            ref,
            where("labels", "array-contains", label),
            orderBy("date", "desc")
        )
    );

    querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
    });

    res.send(result);
});

// post api
app.get(`${webName}post/:id`, async (req, res) => {
    // get post searched by id
    // return {id, title, labels, date, img, context, owner}
    const id = req.params.id;
    const docSnap = await getDoc(doc(db, "posts", id));

    if (docSnap.exists()) {
        res.send({ id: id, ...docSnap.data() });
    }
});

// post put api
app.put(`${webName}post/:id`, async (req, res) => {
    // put post searched by id
    // return {id, title, labels, date, img, context, owner}
    const id = req.params.id;
    const washingtonRef = doc(db, "posts", id);

    console.log(`req.body.context => ${JSON.stringify(req.body.context)}`);

    await updateDoc(washingtonRef, {
        date: new Date(),
        context: req.body.context,
    })
        .then((res) => {
            console.log(`[put] posts ${id} success`);
            res.send("put success");
        })
        .catch((e) => {
            console.log(`[error] posts put: ${e}`);
            res.send("put error");
        });
});

// post delete api
app.delete(`${webName}post/:id`, async (req, res) => {
    // delete post
    const id = req.params.id;

    await deleteDoc(doc(db, "posts", id));
    res.send("delete success");
});

// labels api
app.get(`${webName}labels`, async (req, res) => {
    // get all labels
    // return ["label", "label"]
    const docSnap = await getDoc(doc(db, "config", "labels"));

    if (docSnap.exists()) {
        res.send(docSnap.data().label);
    }
});

// todolist api
app.get(`${webName}todolist`, async (req, res) => {
    // get all todolist
    // return [[announcement], [active], [completed]]
    const docSnap = await getDoc(doc(db, "config", "todolist"));

    if (docSnap.exists()) {
        console.log({
            announcement: docSnap.data().announcement,
            active: docSnap.data().active,
            completed: docSnap.data().completed,
        });
        res.send({
            announcement: docSnap.data().announcement,
            active: docSnap.data().active,
            completed: docSnap.data().completed,
        });
    }
});

app.post(`${webName}addpost`, async (req, res) => {
    console.log(`[Post] addpost ${JSON.stringify(req.body)}\n`);

    try {
        const docRef = await addDoc(collection(db, "posts"), {
            title: req.body.title,
            labels: req.body?.labels,
            context: req.body.context,
            date: new Date(),
            img: req.body.img ? req.body.img : "",
            owner: req.body.name,
        });

        console.log(`docRef.id ${docRef.id}`);
        res.send({ id: docRef.id });
    } catch (e) {
        console.log(`[Error] addpost post: ${e}`);
    }
});

const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`[Message] port ${port}`);
});
