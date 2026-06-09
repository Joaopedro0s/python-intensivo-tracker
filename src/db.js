import { db } from './firebase'
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from 'firebase/firestore'

const COLLECTION = 'sessions'

export async function addSession(session) {
  const docRef = await addDoc(collection(db, COLLECTION), session)
  return docRef.id
}

export async function getSessions() {
  const q = query(collection(db, COLLECTION), orderBy('date', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function deleteSession(id) {
  await deleteDoc(doc(db, COLLECTION, id))
}
