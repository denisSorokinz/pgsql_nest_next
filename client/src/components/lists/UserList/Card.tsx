import Link from 'next/link';
import React, { FC } from 'react';
import Image from 'next/image';
import { User } from '@/types/user';

type Props = { user: User };

const UserCard: FC<Props> = ({ user }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all">
      <Image className="w-full" src={user.photo} alt={user.name} width={500} height={500} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{user.name}</div>
        <p className="text-gray-700 text-base">Phone: {user.phone}</p>
        <p className="text-gray-700 text-base">Position: {user.position}</p>
      </div>
    </div>
  );
};

export default UserCard;
