import Link from 'next/link';

export default async function Homepage() {
  return (
    <section>
      <div className="flex gap-4">
        <Link href={'/register'}>Register form</Link>
        <Link href={'/users'}>User list</Link>
      </div>
    </section>
  );
}
