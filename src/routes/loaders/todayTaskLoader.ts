import { getUserId } from '@/lib/utils';
import type { LoaderFunction } from 'react-router';
import { databases, Query } from '@/lib/appwrite';
import { startOfToday, startOfTomorrow } from 'date-fns';

const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const getTasks = async () => {
    try {
        return await databases.listDocuments(
            APPWRITE_DATABASE_ID,
            'tasks',
            [
                Query.equal('completed', false),
                Query.and([
                    Query.greaterThanEqual('due_date', startOfToday().toISOString()),
                    Query.lessThan('due_date', startOfTomorrow().toISOString())
                ]),
                Query.equal('userId', getUserId())
            ]
        )
    } catch (error) {
        console.log(error)
        throw new Error('Error getting inbox tasks');

    }
}

const todayTaskLoader: LoaderFunction = async () => {
    const tasks = await getTasks();
    console.log(tasks)
    return { tasks }
};

export default todayTaskLoader;
