import { fetchCustomers } from '@/app/lib/data';
import Form from '@/app/ui/sports/create-form';
import Breadcrumbs from '@/app/ui/sports/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Sports', href: '/dashboard/sports' },
          {
            label: 'Create Sport',
            href: '/dashboard/sports/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
