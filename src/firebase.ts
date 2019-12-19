import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCSC1XcitA3Q0RVSDpvoT9EAKjBCELwfso",
  authDomain: "mommys-cookbook-2.firebaseapp.com",
  databaseURL: "https://mommys-cookbook-2.firebaseio.com",
  projectId: "mommys-cookbook-2",
  storageBucket: "mommys-cookbook-2.appspot.com",
  messagingSenderId: "595887947088",
  appId: "1:595887947088:web:ddb1eb8872ff33313fc055"
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
    authorDisplayName: string,
    authorUid: string,
    sharedWith: string[],
    thumbURL: string,
  } | firebase.firestore.DocumentData) {
    return new this(
      data.title,
      data.authorDisplayName,
      data.authorUid,
      [...data.sharedWith],
      data.thumbURL,
    );
  }

  constructor(
    public title: string,
    public authorDisplayName: string,
    public authorUid: string,
    public sharedWith: string[],
    public thumbURL: string,
  ) { }

  public toObject() {
    return {
      title: this.title,
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
    ratingCost: number,
    ratingTastiness: number
    cookbookId: string,
    lastEdited: firebase.firestore.Timestamp | Date | null,
    thumbURL: string,
    source: string,
  } | firebase.firestore.DocumentData) {
    return new this(
      data.title,
      data.subtitle,
      data.content,
      [...data.tags],
      [...data.ingredients],
      data.ratingCost,
      data.ratingTastiness,
      data.cookbookId,
      data.lastEdited ? (data.lastEdited instanceof Date ? data.lastEdited : data.lastEdited.toDate()) : null,
      data.thumbURL,
      data.source
    );
  }

  constructor(
    public title: string,
    public subtitle: string,
    public content: string,
    public tags: string[],
    public ingredients: string[],
    public ratingCost: number,
    public ratingTastiness: number,
    public cookbookId: string,
    public lastEdited: Date | null,
    public thumbURL: string,
    public source: string
  ) { }

  public toObject() {
    return {
      title: this.title,
      subtitle: this.subtitle,
      content: this.content,
      tags: this.tags,
      ingredients: this.ingredients,
      ratingCost: this.ratingCost,
      ratingTastiness: this.ratingTastiness,
      cookbookId: this.cookbookId,
      lastEdited: this.lastEdited,
      thumbURL: this.thumbURL,
      source: this.source
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
