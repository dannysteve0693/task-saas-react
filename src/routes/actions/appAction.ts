import type { ActionFunction } from 'react-router';
import type { Task } from '@/types';

import { databases } from '@/lib/appwrite';

import { generateID, getUserId } from '@/lib/utils';

const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const createTask = async (data: Task) => {
  try {

    return await databases.createDocument(
      APPWRITE_DATABASE_ID,
      "tasks",
      generateID(), {
      ...data, userId: getUserId()
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const updateTask = async (data: Task) => {
  const documentId = data.id;
  if (!documentId) {
    throw new Error('Task ID not found');
  }

  delete data.id; // Remove id from data to avoid conflicts with Appwrite's document ID

  try {
    return await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      "tasks",
      documentId,
      data
    );
  } catch (error) {
    console.log(error);
  }
};

const appAction: ActionFunction = async ({ request }) => {
  const data = (await request.json()) as Task;

  if (request.method === 'POST') {
    return await createTask(data);
  }

  if (request.method === 'PUT') {
    return await updateTask(data)
  }
};

export default appAction;
