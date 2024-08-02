'use client';

import { paginateUsers, type PaginateUsersSuccess as PageData } from '@/actions/';
import { Button } from '@/components/ui/button';
import { User } from '@/types/user';
import { useQuery } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import UserCard from './Card';
import Link from 'next/link';

type Props = {
  initialPage: PageData;
};

const UserList: FC<Props> = ({ initialPage }) => {
  const [page, setPage] = useState(1);

  // const [users, setUsers] = useState<User[]>([]);

  const {
    isLoading,
    isError,
    error,
    data: pages,
    isFetching,
    isPlaceholderData,
  } = useQuery<PageData[], string>({
    queryKey: ['users', page],
    queryFn: async (): Promise<PageData[]> => {
      const res = await paginateUsers(page);

      const { success, message, ...pageData } = res;

      if (!success) {
        return Promise.reject(message);
      }

      return pages.concat(pageData as PageData);
    },
    initialData: [initialPage],
    placeholderData: (prev) => prev,
  });

  // useEffect(() => {
  //   console.log('pageData');

  //   !error && setUsers(users.concat(pageData.users));
  // }, [pageData]);

  if (error)
    return (
      <div>
        <h2>Unable to fetch users: {error}</h2>
      </div>
    );

  return (
    <>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : isError ? (
          <div>Error: {error}</div>
        ) : (
          <ul className="grid grid-cols-2 gap-4">
            {pages
              .map((page) => page.users)
              .map((users) =>
                users.map((user) => (
                  <li key={user.id}>
                    <Link href={`/users/${user.id}`}>
                      <UserCard user={user} />
                    </Link>
                  </li>
                ))
              )}
          </ul>
        )}
        <div className="flex flex-col gap-4 mt-8">
          <span>Current Page: {page}</span>

          <div className="flex gap-4">
            <Button onClick={() => setPage(page + 1)} disabled={isPlaceholderData || !pages.slice(-1)[0].links.next_url}>
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
