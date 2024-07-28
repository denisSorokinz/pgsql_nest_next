'use client';

import { paginateUsers, PaginateUsersSuccess } from '@/actions/';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import UserCard from './Card';
import Link from 'next/link';

type Props = {
  initialUsers: Awaited<ReturnType<typeof paginateUsers>>;
};

const UserList: FC<Props> = ({ initialUsers }) => {
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState<User[]>([]);

  const {
    isLoading,
    isError,
    error,
    data: pageData,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['users', page],
    queryFn: () => paginateUsers(page),
    initialData: initialUsers,
    placeholderData: (prev) => prev,
  });

  useEffect(() => void (pageData.success && setUsers(users.concat(pageData.users))), [pageData]);

  if (!pageData.success)
    return (
      <div>
        <h2>Unable to fetch users: {pageData.message}</h2>
      </div>
    );

  return (
    <>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error.message}</div>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {users.map((user) => (
              <li key={user.id}>
                <Link href={`/users/${user.id}`}>
                  <UserCard user={user} />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col gap-4 mt-8">
          <span>Current Page: {page}</span>

          <div className="flex gap-4">
            <Button onClick={() => setPage(page + 1)} disabled={isPlaceholderData || !pageData.links.next_url}>
              Show More
            </Button>
          </div>
        </div>
        {isFetching ? <span> Loading...</span> : null}{' '}
      </div>
    </>
  );
};
export default UserList;
