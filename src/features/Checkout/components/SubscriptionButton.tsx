type SubscriptionButtonProps = {
    duration: string;
    price: string;
    onClick?: () => void;
};

export const SubscriptionButton = ({ duration, price, onClick }: SubscriptionButtonProps): JSX.Element => {
    return (
        <button
            type="button"
            className="btn-subscription w-full flex items-center justify-between"
            onClick={onClick}
        >
            <span
                className="flex-1 translate-x-1.5 translate-y-0.5 text-left text-base font-medium leading-none text-subs">
                {duration}
            </span>
            <span
                className="flex-1 -translate-x-1.5 translate-y-0.5 text-right text-base font-medium leading-none text-subs">
                {price}
            </span>
        </button>
    );
};
