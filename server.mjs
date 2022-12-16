import express from "express";
import cors from "cors";
import { postlistDefault, postlistFilterLabel } from "./server-postlist.mjs";
import { userAdd, userDefault, userFilterName } from "./server-user.mjs";
import { postAdd, postDelete, postFilterId, postPut } from "./server-post.mjs";
import { labelsDefault, todolistDefault } from "./server-other.mjs";
const app = express();
app.use(cors());
app.use(express.json());

// const webName = "/personal-blog/";
const webName = "/";

// user api
app.get(`${webName}user`, async (req, res) => {
    // get user
    // return [{id, name, avatar}]
    const result = await userDefault();
    return res.send(result);
});

app.get(`${webName}user/:name`, async (req, res) => {
    // get user searched by name
    // return {id, name, avatar}
    const name = req.params.name;
    const result = await userFilterName(name);
    return res.send(result);
});

app.post(`${webName}user`, async (req, res) => {
    // add new user
    // console.log(`[Post] user ${JSON.stringify(req.body)}`);
    const name = req.body.name;
    const avatar =
        req.body.avatar.length > 0
            ? req.body.avatar
            : "https://cdn.pixabay.com/photo/2016/09/28/02/14/user-1699635_960_720.png";
    const result = await userAdd(name, avatar);

    return result == null ? res.end() : res.send(result);
});

// postlist api
app.get(`${webName}postlist`, async (req, res) => {
    // get all postlist
    // return [{id, title, labels, date, img, context, owner}]
    const id = req.query.id;
    const type = req.query.type;
    const result = await postlistDefault(id, type);
    return res.send(result);
});

app.get(`${webName}postlist/:label`, async (req, res) => {
    // get postlist searched by label
    // return [{id, title, labels, date, img, context, owner}]
    const label = req.params.label;
    const id = req.query.id;
    const type = req.query.type;
    const result = await postlistFilterLabel(id, type, label);
    return res.send(result);
});

// post api
app.get(`${webName}post/:id`, async (req, res) => {
    // get post searched by id
    // return {id, title, labels, date, img, context, owner}
    const id = req.params.id;
    // console.log(`id = ${id}`);
    const result = await postFilterId(id);
    return res.send(result);
});

// post put api
app.put(`${webName}post/:id`, async (req, res) => {
    // put post searched by id
    // return {id, title, labels, date, img, context, owner}
    const id = req.params.id;
    const context = req.body.context;
    const result = await postPut(id, context);
    return result === null ? res.end() : res.send(result);
});

// post delete api
app.delete(`${webName}post/:id`, async (req, res) => {
    // delete post
    const id = req.params.id;
    const result = await postDelete(id);
    return result === null ? res.end() : res.send(result);
});

// addPost api
app.post(`${webName}addpost`, async (req, res) => {
    const title = req.body.title;
    const labels = req.body?.labels;
    const context = req.body.context;
    const img = req.body.img ? req.body.img : "";
    const owner = req.body.name;
    const result = await postAdd(title, labels, context, img, owner);

    return res.send(result);
});

// labels api
app.get(`${webName}labels`, async (req, res) => {
    // get all labels
    // return ["label", "label"]
    const result = await labelsDefault();
    return res.send(result);
});

// todolist api
app.get(`${webName}todolist`, async (req, res) => {
    // get all todolist
    // return [[announcement], [active], [completed]]
    const result = await todolistDefault();
    return res.send(result);
});

const server = app.listen(process.env.PORT || 5000, () => {
    const port = server.address().port;
    console.log(`[Message] port ${port}`);
});
