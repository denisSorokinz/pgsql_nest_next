import { paginateUsers } from '@/actions/';
import UserList from '@/components/lists/UserList';

export default async function UsersPage() {
  const initialUsers = await paginateUsers();

  if (!initialUsers.success)
    return (
      <section>
        <h1>No users found</h1>
      </section>
    );

  return (
    <section>
      <UserList initialUsers={initialUsers} />
    </section>
  );
}
