// src/services/settingsService.ts
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CanteenSettings } from '@/types';

const SETTINGS_DOC_ID = 'canteen'; // The fixed document ID for canteen settings

/**
 * Fetches the canteen settings from Firestore.
 * @returns A promise that resolves to the CanteenSettings object or null if not found.
 */
export const getCanteenSettings = async (): Promise<CanteenSettings | null> => {
  const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
  const docSnap = await getDoc(settingsRef);
  if (docSnap.exists()) {
    return docSnap.data() as CanteenSettings;
  }
  return null;
};

/**
 * Updates the canteen settings in Firestore.
 * If the document does not exist, it will be created.
 * @param settings - The CanteenSettings object to save.
 */
export const updateCanteenSettings = async (settings: CanteenSettings): Promise<void> => {
  const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
  await setDoc(settingsRef, settings, { merge: true }); // Use merge to update existing fields or create if not exists
};
