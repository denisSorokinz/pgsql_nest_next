import { getApiToken } from '@/actions/';
import RegisterForm from '@/components/forms/Register';
import { ApiResponse } from '@/types/http';
import { UserPosition } from '@/types/position';
import Image from 'next/image';

export default async function Home() {
  const positionResponse = (await (await fetch(`${process.env.NEXT_PUBLIC_API_URL}/positions`)).json()) as ApiResponse<{
    positions: UserPosition[];
  }>;

  if (!positionResponse.success)
    return (
      <section>
        <h3>Unable to fetch data</h3>
      </section>
    );

  return (
    <section>
      <RegisterForm positions={positionResponse.positions} />
    </section>
  );
}
