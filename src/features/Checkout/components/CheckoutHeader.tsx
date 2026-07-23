const Logo = "/assets/images/logo-black.svg";
const World = "/assets/images/world.svg";

type CheckoutHeaderProps = {
    logoAlt?: string;
};

export const CheckoutHeader = ({ logoAlt = "Privacy" }: CheckoutHeaderProps): JSX.Element => {
    return (
        <header className="fixed left-0 top-0 z-20 w-full border-b border-[#e8e8e8] bg-[#f9f6f2] shadow-[0_1px_0_#e8e8e8]">
            <div className="relative h-[65px]">
                <img
                    className="absolute left-1/2 -translate-x-1/2 top-[24px] h-[18px] w-[86px] object-contain"
                    alt={logoAlt}
                    src={Logo}
                />
                <div className="absolute right-[19px] top-[7.5px] flex h-[50px] items-center justify-end">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/0">
                        <img src={World} className="h-[23px] w-[22px]" alt="" aria-hidden="true" />
                    </span>
                </div>
            </div>
        </header>
    );
};
