import { paginateUsers, type PaginateUsersSuccess as PageData } from '@/actions/';
import UserList from '@/components/lists/UserList';

export default async function UsersPage() {
  const initialUserResponse = await paginateUsers();
  const { success, message, ...body } = initialUserResponse;

  if (!initialUserResponse.success)
    return (
      <section>
        <h1>No users found</h1>
      </section>
    );

  console.log({ body });

  return (
    <section>
      <UserList initialPage={body as PageData} />
    </section>
  );
}
