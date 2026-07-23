import { redirect } from "next/navigation";

const DEFAULT_CHECKOUT_NAME = "visitante";

export default function NotFound(): never {
    redirect(`/checkout/${DEFAULT_CHECKOUT_NAME}`);
}
