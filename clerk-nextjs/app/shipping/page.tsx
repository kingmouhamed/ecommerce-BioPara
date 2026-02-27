import { redirect } from 'next/navigation';

export default function ShippingRedirect() {
    redirect('/delivery');
}
