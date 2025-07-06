// src/services/ratingService.ts
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Rating } from "@/types";

/**
 * Submits or updates a rating for a specific menu item by a user.
 * If the user has already rated the item, it updates their rating.
 * Otherwise, it adds a new rating.
 * @param menuItemId - The ID of the menu item being rated.
 * @param userId - The UID of the user submitting the rating.
 * @param ratingValue - The rating value (e.g., 1-5 stars).
 */
export const submitRating = async (
  menuItemId: string,
  userId: string,
  ratingValue: number
): Promise<void> => {
  // Firestore subcollection reference for ratings of a specific menu item
  const ratingRef = doc(db, "menuItems", menuItemId, "ratings", userId);

  // Use setDoc with merge: true to create a new doc or update an existing one.
  // This is simpler than querying first.
  await setDoc(
    ratingRef,
    {
      userId,
      rating: ratingValue,
      createdAt: serverTimestamp(), // This will be set on creation
      updatedAt: serverTimestamp(), // This will be set on creation and update
    },
    { merge: true }
  ); // merge:true is crucial here
};

/**
 * Fetches all ratings for a specific menu item.
 * @param menuItemId - The ID of the menu item.
 * @returns A promise that resolves to an array of ratings for the item.
 */
export const getMenuItemRatings = async (
  menuItemId: string
): Promise<Rating[]> => {
  const ratingsCol = collection(db, "menuItems", menuItemId, "ratings");
  const q = query(ratingsCol);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Rating));
};

/**
 * Calculates the average rating for a menu item and updates the menuItem document.
 * This function should ideally be triggered by a Cloud Function on rating submission/update.
 * For now, it can be called manually or after a rating submission on the client-side.
 * @param menuItemId - The ID of the menu item.
 */
export const updateAverageRating = async (menuItemId: string): Promise<void> => {
  const ratings = await getMenuItemRatings(menuItemId);
  if (ratings.length === 0) {
    // If no ratings, set avgRating to 0 or remove the field
    await updateDoc(doc(db, "menuItems", menuItemId), { avgRating: 0 });
    return;
  }

  const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
  const averageRating = totalRating / ratings.length;

  // Update the menu item with the new average rating
  await updateDoc(doc(db, "menuItems", menuItemId), {
    avgRating: averageRating,
  });
};
