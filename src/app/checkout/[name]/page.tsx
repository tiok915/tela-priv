import { CheckoutScreen } from "@/features/Checkout";

type CheckoutPageProps = {
    params: { name: string };
};

export default function CheckoutPage({ params }: CheckoutPageProps): JSX.Element {
    return <CheckoutScreen name={params.name} />;
}
