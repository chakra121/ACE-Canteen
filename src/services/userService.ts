
// src/services/userService.ts
import { doc, getDoc, setDoc, updateDoc, collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserProfile } from '@/types';

/**
 * Creates a new user profile document in Firestore.
 * This should be called after a user successfully registers with Firebase Authentication.
 * @param userProfile - The user profile data to save.
 */
export const createUserProfile = async (userProfile: UserProfile): Promise<void> => {
  const userRef = doc(db, 'users', userProfile.uid);
  await setDoc(userRef, userProfile);
};

/**
 * Fetches a user's profile from Firestore.
 * @param uid - The UID of the user.
 * @returns A promise that resolves to the UserProfile or null if not found.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return { uid: docSnap.id, ...docSnap.data() } as UserProfile;
  }
  return null;
};

/**
 * Updates an existing user's profile in Firestore.
 * @param uid - The UID of the user to update.
 * @param updates - An object containing the fields to update.
 */
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, updates);
};

/**
 * Fetches all user profiles from Firestore.
 * Only accessible by admins via Firestore rules.
 * @returns A promise that resolves to an array of all user profiles.
 */
export const getAllUserProfiles = async (): Promise<UserProfile[]> => {
  const usersCol = collection(db, 'users');
  const q = query(usersCol);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserProfile));
};
