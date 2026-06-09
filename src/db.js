import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const LOGS_COL = "studyLogs";
const TOPICS_COL = "topics";
const META_DOC = "meta/config";

export async function getLogs() {
  const q = query(collection(db, LOGS_COL), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addLog(log) {
  return addDoc(collection(db, LOGS_COL), { ...log, createdAt: Date.now() });
}

export async function updateLog(id, data) {
  return updateDoc(doc(db, LOGS_COL, id), data);
}

export async function deleteLog(id) {
  return deleteDoc(doc(db, LOGS_COL, id));
}

export async function getCustomTopics() {
  const snap = await getDocs(collection(db, TOPICS_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveCustomTopic(topic) {
  if (topic.id && !topic.id.startsWith("custom_")) {
    return setDoc(doc(db, TOPICS_COL, String(topic.id)), topic);
  }
  return addDoc(collection(db, TOPICS_COL), topic);
}

export async function getMeta() {
  const snap = await getDoc(doc(db, META_DOC));
  return snap.exists() ? snap.data() : {};
}

export async function saveMeta(data) {
  return setDoc(doc(db, META_DOC), data, { merge: true });
}
