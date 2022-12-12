import db from "./firebase-config.mjs";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    startAfter,
    endBefore,
    limit,
    limitToLast,
} from "firebase/firestore";

// 獲得每頁資料筆數 + 1 筆資料，確認是否還有下一頁
const perPage = 5 + 1;
const ref = collection(db, "posts");
const sort = orderBy("date", "desc");
let querySnapshot;

export const postlistDefault = async (id = "", type = "") => {
    // get all postlist
    // return [{id, title, labels, date, img, context, owner}]
    console.log(`id = ${id}, type = ${type}`);

    let next;
    let result = [];

    if (id !== "") {
        next = await getDoc(query(doc(db, "posts", id)));
        // console.log(`next = ${JSON.stringify(next)}`);
    }

    switch (type) {
        case "prev":
            try {
                querySnapshot = await prevQuery(next);
            } catch (e) {
                console.error(`prevPage error = ${e}`);
                // if prevPage no data, return initPage
                querySnapshot = await initQuery();
            }

            break;
        case "next":
            try {
                querySnapshot = await nextQuery(next);
            } catch (e) {
                console.log(`next failed e = ${e}`);
                // if nextPage no data, return prevPage
                querySnapshot = await prevQuery(next);
            }

            break;
        default:
            querySnapshot = await initQuery();
    }

    querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
    });

    console.log(result);
    return result;
};

export const postlistFilterLabel = async (id = "", type = "", label) => {
    // get postlist searched by label
    // return [{id, title, labels, date, img, context, owner}]
    let result = [];
    let next;
    const filter = where("labels", "array-contains", label);

    if (id !== "") {
        next = await getDoc(query(doc(db, "posts", id)));
        // console.log(`next = ${JSON.stringify(next)}`);
    }

    switch (type) {
        case "prev":
            try {
                querySnapshot = await prevQuery(next, filter);
            } catch (e) {
                console.error(`prevPage error = ${e}`);
                // if prevPage no data, return initPage
                querySnapshot = await initQuery(filter);
            }

            break;
        case "next":
            try {
                querySnapshot = await nextQuery(next, filter);
            } catch (e) {
                console.error(`nextPage error = ${e}`);
                // if nextPage no data, return prevPage
                querySnapshot = await prevQuery(next, filter);
            }

            break;
        default:
            querySnapshot = await initQuery(filter);
    }

    querySnapshot.forEach((doc) => {
        result.push({ id: doc.id, ...doc.data() });
    });

    console.log(result);
    return result;
};

const initQuery = async (filter = null) => {
    // get first page data
    if (filter !== null) {
        console.log(`initQuery !== null`);
        return await getDocs(query(ref, filter, sort, limit(perPage)));
    } else {
        console.log(`initQuery === null`);
        return await getDocs(query(ref, sort, limit(perPage)));
    }
};

const prevQuery = async (next, filter = null) => {
    // get prevPage data
    if (filter !== null) {
        return await getDocs(
            query(ref, filter, sort, endBefore(next), limitToLast(perPage))
        );
    } else {
        return await getDocs(
            query(ref, sort, endBefore(next), limitToLast(perPage))
        );
    }
};

const nextQuery = async (next, filter = null) => {
    // get nextPage data
    if (filter !== null) {
        return await getDocs(
            query(ref, filter, sort, startAfter(next), limit(perPage))
        );
    } else {
        return await getDocs(
            query(ref, sort, startAfter(next), limit(perPage))
        );
    }
};
