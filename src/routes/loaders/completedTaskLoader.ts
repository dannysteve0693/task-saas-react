import { getUserId } from '@/lib/utils';
import type { LoaderFunction } from 'react-router';
import { databases, Query } from '@/lib/appwrite';

const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const getTasks = async () => {
    try {
        return await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            'tasks',
            [
                Query.equal('completed', true),
                Query.orderDesc('$updatedAt'),
                Query.equal('userId', getUserId())
            ]
        )
    } catch (error) {
        console.log(error)
        throw new Error('Error getting completed tasks');

    }
}

const completedTaskLoader: LoaderFunction = async () => {
    const tasks = await getTasks();
    console.log(tasks)
    return { tasks }
};

export default completedTaskLoader;
