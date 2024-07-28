'use server';

import { ApiResponse } from '@/types/http';
import { User } from '@/types/user';

export async function getApiToken() {
  const response = (await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`)).json()) as ApiResponse<{ token: string }>;

  return response;
}

export async function registerUser(formData: FormData) {
  const data = await getApiToken();

  if (!data.success) return data;

  const createUserResponse = (await (
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
      method: 'POST',
      headers: { Token: data.token },
      body: formData,
    })
  ).json()) as ApiResponse<{ user_id: number }>;

  return createUserResponse;
}

export type PaginateUsersSuccess = {
  users: User[];
  links: { next_url: string | null; prev_url: string | null };
  page: number;
  total_pages: number;
  total_users: number;
  count: number;
};
export const paginateUsers = async (page = 1, count = 6) => {
  const params = new URLSearchParams({ page: `${page}`, count: `${count}` });

  return (await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?${params}`)).json()) as ApiResponse<PaginateUsersSuccess>;
};

export const fetchUser = async (id: number) => {
  return (await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`)).json()) as ApiResponse<{ user: User }>;
};
