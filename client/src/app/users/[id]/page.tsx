import { fetchUser } from '@/actions/';
import UserCard from '@/components/lists/UserList/Card';

export default async function SingleUserPage({ params: { id } }: { params: { id: string } }) {
  const nId = Number(id);
  if (isNaN(nId))
    return (
      <section>
        <h1>User ID should be an integer</h1>
      </section>
    );

  const response = await fetchUser(nId);

  if (!response.success)
    return (
      <section>
        <h1>No users found</h1>
      </section>
    );

  return (
    <section>
      <UserCard user={response.user} />
    </section>
  );
}
