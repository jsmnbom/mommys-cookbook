// import * as firebase from 'firebase/app';
import * as firebase from 'firebase';
import { firestore } from 'firebase';

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

class CookbookValue {
    public static fromObject(data: {
        title: string,
        description: string,
        authorDisplayName: string,
        authorUid: string,
        sharedWith: string[],
        thumbURL: string,
    } | firestore.DocumentData) {
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

export { db, CookbookValue };
