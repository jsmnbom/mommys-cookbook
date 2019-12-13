import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const app = firebase.initializeApp({
    apiKey: 'AIzaSyD1PmMAyOsb_cnVxNMVszCWoo3Hx5IN9XU',
    authDomain: 'mommys-cookbook.firebaseapp.com',
    databaseURL: 'https://mommys-cookbook.firebaseio.com',
    projectId: 'mommys-cookbook',
    storageBucket: 'gs://mommys-cookbook.appspot.com',
    messagingSenderId: '703351919622',
    appId: '1:703351919622:web:7d5632191f53b7d0',
});

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
const TaskEvent = firebase.storage.TaskEvent;
const TaskState = firebase.storage.TaskState;
type UserInfo = firebase.UserInfo;
type QuerySnapshot = firebase.firestore.QuerySnapshot;

class CookbookValue {
    public static fromObject(data: {
        title: string,
        description: string,
        authorDisplayName: string,
        authorUid: string,
        sharedWith: string[],
        thumbURL: string,
    } | firebase.firestore.DocumentData) {
        return new this(
            data.title,
            data.description,
            data.authorDisplayName,
            data.authorUid,
            [...data.sharedWith],
            data.thumbURL,
        );
    }

    constructor(
        public title: string,
        public description: string,
        public authorDisplayName: string,
        public authorUid: string,
        public sharedWith: string[],
        public thumbURL: string,
    ) { }

    public toObject() {
        return {
            title: this.title,
            description: this.description,
            authorDisplayName: this.authorDisplayName,
            authorUid: this.authorUid,
            sharedWith: this.sharedWith,
            thumbURL: this.thumbURL,
        };
    }
}

export default class RecipeValue {
    public static fromObject(data: {
        title: string,
        subtitle: string,
        content: string,
        tags: string,
        ingredients: string,
        ratings: {
            cost: number,
            time: number,
            tastiness: number,
        },
        cookbookId: string,
        lastEaten: firebase.firestore.Timestamp | null,
        lastEdited: firebase.firestore.Timestamp | null,
    } | firebase.firestore.DocumentData) {
        return new this(
            data.title,
            data.subtitle,
            data.content,
            [...data.tags],
            [...data.ingredients],
            { ...data.ratings },
            data.cookbookId,
            data.lastEaten ? data.lastEaten.toDate() : null,
            data.lastEdited ? data.lastEdited.toDate() : null,
        );
    }

    constructor(
        public title: string,
        public subtitle: string,
        public content: string,
        public tags: string[],
        public ingredients: string[],
        public ratings: {
            cost: number,
            time: number,
            tastiness: number,
        },
        public cookbookId: string,
        public lastEaten: Date | null,
        public lastEdited: Date | null,
    ) { }

    public toObject() {
        return {
            title: this.title,
            subtitle: this.subtitle,
            content: this.content,
            tags: this.tags,
            ingredients: this.ingredients,
            ratings: this.ratings,
            cookbookId: this.cookbookId,
            lastEaten: this.lastEaten,
            lastEdited: this.lastEdited,
        };
    }
}

interface RecipeList {
    [id: string]: RecipeValue;
}

interface CookbookList {
    [id: string]: CookbookValue
}

export {
    firebase,
    db,
    CookbookValue,
    UserInfo,
    auth,
    QuerySnapshot,
    RecipeValue,
    RecipeList,
    CookbookList,
    storage,
    TaskEvent,
    TaskState
};
