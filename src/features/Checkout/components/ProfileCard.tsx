"use client";

import { useEffect, useRef, useState } from "react";
import { SubscriptionButton } from "./SubscriptionButton";
import { PaymentModal } from "./PaymentModal";
import { MimoModal } from "./MimoModal";
import { useAccess } from "../access/AccessContext";
import { PaymentIntent, subscriptionIntent } from "../access/config";
import { PROFILE } from "../data";

const ArrowIcon = "/assets/icons/arrow.svg";

type ProfileCardProps = {
    promoOpen: boolean;
    onTogglePromo: () => void;
};

export const ProfileCard = ({
    promoOpen,
    onTogglePromo,
}: ProfileCardProps): JSX.Element => {
    const { subscription, addToken } = useAccess();
    const [intent, setIntent] = useState<PaymentIntent | null>(null);
    const [mimoOpen, setMimoOpen] = useState(false);
    const [bioExpanded, setBioExpanded] = useState(false);
    const [bioClamped, setBioClamped] = useState(false);
    const bioRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const el = bioRef.current;
        if (el) setBioClamped(el.scrollHeight > el.clientHeight + 1);
    }, []);

    const { monthly, promotions, offer } = PROFILE.subscription;

    const socials = PROFILE.socials.filter(
        (s) => s.url && s.url.trim() !== "" && s.url.trim() !== "#",
    );

    return (
        <div className="rounded-3xl border border-[#dddddd] bg-white overflow-hidden outline outline-1 outline-offset-[-1px] outline-[#dddddd]">
            <PaymentModal
                intent={intent}
                onClose={() => setIntent(null)}
                onPaid={(token) => void addToken(token)}
                checkoutName={PROFILE.name}
            />

            <MimoModal
                open={mimoOpen}
                title="Enviar mimo"
                onClose={() => setMimoOpen(false)}
                onPay={(mimo) => {
                    setMimoOpen(false);
                    setIntent(mimo);
                }}
            />

            <img
                className="w-full h-[88px] bg-cover bg-center rounded-t-3xl"
                src={PROFILE.cover}
                alt="Cover"
            />

            <div className="flex items-end justify-between px-4 -mt-10 mb-2">
                {PROFILE.status === 'live' ? (
                    <button
                        type="button"
                        onClick={() => setIntent(subscriptionIntent(monthly.price))}
                        className="relative shrink-0 mb-1 border-none bg-transparent p-0 cursor-pointer transition-transform hover:scale-105 active:scale-95 text-left"
                    >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff0844] via-[#ff6f00] to-[#ff0844] animate-pulse opacity-75 scale-110"></div>
                        <div className="relative flex justify-center items-center w-[86px] h-[86px] p-[3px] rounded-full bg-gradient-to-br from-[#ff0844] via-[#ff6f00] to-[#ff0844]">
                            <div className="w-full h-full relative overflow-hidden rounded-full border-2 border-white">
                                <img className="h-full w-full object-cover bg-white" src={PROFILE.avatar} alt="Avatar" />
                            </div>
                            <div className="flex justify-center items-center absolute -bottom-1.5 left-1/2 -translate-x-1/2 gap-1 px-1.5 py-[3px] rounded-md bg-gradient-to-br from-[#ff0844] to-[#e60023] border border-white shadow-sm z-10 animate-pulse">
                                <div className="h-[5px] w-[5px] rounded-full bg-white animate-pulse" />
                                <p className="text-[8px] leading-none font-bold uppercase text-white tracking-widest mt-[1px] whitespace-nowrap">
                                    AO VIVO
                                </p>
                            </div>
                        </div>
                    </button>
                ) : PROFILE.status === 'online' ? (
                    <div className="relative w-20 h-20 shrink-0">
                        <div className="h-full w-full rounded-[40px] overflow-hidden outline outline-4 outline-offset-[-2px] outline-white">
                            <img className="h-full w-full object-cover bg-white" src={PROFILE.avatar} alt="Avatar" />
                        </div>
                        <div className="absolute bottom-1 right-1 w-[14px] h-[14px] bg-[#34c759] border-[2.5px] border-white rounded-full z-10 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-[#34c759] animate-ping opacity-75"></div>
                        </div>
                    </div>
                ) : (
                    <div className="h-20 w-20 shrink-0 rounded-[40px] overflow-hidden outline outline-4 outline-offset-[-2px] outline-white">
                        <img
                            className="h-full w-full object-cover bg-white"
                            src={PROFILE.avatar}
                            alt="Avatar"
                        />
                    </div>
                )}

                <div className="flex items-center gap-3 pb-3">
                    {PROFILE.stats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                            <img className="w-[17px] h-3.5" alt="" src={stat.icon} />
                            <span className="font-[family-name:var(--privacy-com-br-poppins-regular-font-family)] text-[length:var(--privacy-com-br-poppins-regular-font-size)] text-[#333]">
                                {stat.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col justify-start items-start w-[712.66px] max-w-full relative gap-0.5 px-4 overflow-hidden">
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0">
                    <div className="flex flex-col justify-start items-start flex-grow relative overflow-hidden">
                        <span className="self-stretch flex-grow-0 flex-shrink-0 w-full text-xl text-left text-slate-800 font-semibold leading-tight truncate">
                            {PROFILE.name}
                        </span>
                    </div>
                </div>
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0">
                    <div className="flex flex-col justify-start items-start flex-grow relative">
                        <span className="self-stretch flex-grow-0 flex-shrink-0 w-full text-sm text-left text-[#333] leading-tight truncate">
                            {PROFILE.handle}
                        </span>
                    </div>
                </div>
                <div className="self-stretch flex flex-col items-start mt-1">
                    <p
                        ref={bioRef}
                        className={`w-full text-sm text-left text-black whitespace-pre-line break-words ${bioExpanded ? "" : "line-clamp-2"
                            }`}
                    >
                        {PROFILE.bio}
                    </p>
                    {(bioClamped || bioExpanded) && (
                        <button
                            type="button"
                            onClick={() => setBioExpanded((v) => !v)}
                            className="mt-0.5 text-sm font-medium text-left text-[#f6842c] hover:underline cursor-pointer bg-transparent border-none p-0"
                        >
                            {bioExpanded ? "Ler menos" : "Ler mais"}
                        </button>
                    )}
                </div>
            </div>

            {socials.length > 0 && (
                <div className="flex space-x-1.5 my-2 mx-4">
                    {socials.map((social) => (
                        <a
                            key={social.label}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.label}
                            className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-8 h-8 relative gap-2 p-2 rounded-2xl bg-[#f9f6f2] transition-colors hover:bg-[#f1ece5]"
                        >
                            <img src={social.icon} alt={social.label} className="flex-grow-0 flex-shrink-0 w-6 h-6 relative" />
                        </a>
                    ))}
                </div>
            )}

            {subscription ? (
                <div className="flex flex-row justify-start items-stretch gap-2 px-3.5 pt-2 pb-8">
                    <button
                        type="button"
                        onClick={() => setMimoOpen(true)}
                        className="flex justify-center items-center flex-1 min-w-0 h-11 rounded-2xl bg-[#f9f6f2] border border-[#ddd] cursor-pointer transition-colors hover:bg-[#f9f6f2]/40"
                    >
                        <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative pr-[5px]">
                            <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M22.5 12C22.5 9.21523 21.3938 6.54451 19.4246 4.57538C17.4555 2.60625 14.7848 1.5 12 1.5C9.21523 1.5 6.54451 2.60625 4.57538 4.57538C2.60625 6.54451 1.5 9.21523 1.5 12C1.5 14.7848 2.60625 17.4555 4.57538 19.4246C6.54451 21.3938 9.21523 22.5 12 22.5C14.7848 22.5 17.4555 21.3938 19.4246 19.4246C21.3938 17.4555 22.5 14.7848 22.5 12ZM0 12C0 8.8174 1.26428 5.76516 3.51472 3.51472C5.76516 1.26428 8.8174 0 12 0C15.1826 0 18.2348 1.26428 20.4853 3.51472C22.7357 5.76516 24 8.8174 24 12C24 15.1826 22.7357 18.2348 20.4853 20.4853C18.2348 22.7357 15.1826 24 12 24C8.8174 24 5.76516 22.7357 3.51472 20.4853C1.26428 18.2348 0 15.1826 0 12ZM12.75 5.625V6.70312C13.3828 6.75 13.9969 6.91875 14.6063 7.09219C14.6766 7.11094 14.7516 7.13438 14.8219 7.15313C15.2203 7.26563 15.4547 7.67813 15.3469 8.07656C15.2391 8.475 14.8219 8.70937 14.4234 8.60156C14.3109 8.56875 14.1984 8.53594 14.0859 8.50312C13.7344 8.4 13.3734 8.29687 13.0125 8.24531C12.1172 8.11406 11.2969 8.22656 10.7016 8.48438C10.0969 8.74687 9.82969 9.09844 9.77344 9.39844C9.68906 9.85781 9.87187 10.1719 10.2516 10.4156C10.7484 10.7344 11.4938 10.9453 12.3984 11.2031L12.4125 11.2078C13.2422 11.4422 14.2359 11.7281 14.9578 12.225C15.8484 12.8344 16.2609 13.8094 16.0641 14.8734C15.8766 15.8859 15.1781 16.5609 14.2922 16.9172C13.8281 17.1047 13.3031 17.2125 12.7406 17.2406V18.375C12.7406 18.7875 12.4031 19.125 11.9906 19.125C11.5781 19.125 11.2406 18.7875 11.2406 18.375V17.1609C10.8609 17.1 10.2187 16.9172 9.72187 16.7672C9.39844 16.6688 9.075 16.5656 8.75156 16.4625C8.35781 16.3313 8.14687 15.9094 8.27344 15.5156C8.4 15.1219 8.82656 14.9109 9.22031 15.0375C9.52969 15.1406 9.83906 15.2391 10.1531 15.3328C10.6781 15.4922 11.2172 15.6422 11.4703 15.6797C12.3984 15.8156 13.1813 15.7406 13.7203 15.5203C14.2453 15.3094 14.5078 14.9906 14.5781 14.5969C14.6672 14.1047 14.5078 13.7344 14.1 13.4531C13.5375 13.0688 12.8437 12.8766 12.1828 12.6937C12.075 12.6656 11.9625 12.6328 11.8594 12.6047C11.0578 12.3797 10.125 12.1125 9.43594 11.6719C9.05625 11.4281 8.7 11.1047 8.475 10.6547C8.24531 10.1953 8.18438 9.67969 8.2875 9.11719C8.46563 8.14687 9.225 7.47187 10.0969 7.09687C10.4437 6.94687 10.8281 6.83438 11.2359 6.76406V5.625C11.2359 5.2125 11.5734 4.875 11.9859 4.875C12.3984 4.875 12.7359 5.2125 12.7359 5.625H12.75Z"
                                    fill="#333333"
                                />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
                            <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#333]">Mimo</p>
                        </div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMimoOpen(true)}
                        className="flex justify-center items-center flex-1 min-w-0 h-11 rounded-2xl bg-[#f9f6f2] border border-[#ddd] cursor-pointer transition-colors hover:bg-[#f9f6f2]/40"
                    >
                        <div className="flex justify-start items-start flex-grow-0 flex-shrink-0 relative pr-[5px]">
                            <svg
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="flex-grow-0 flex-shrink-0 w-6 h-6 relative"
                                preserveAspectRatio="none"
                            >
                                <path
                                    d="M12.2109 0C13.4859 0 14.7422 0.229687 15.9234 0.665625C18.0469 1.44844 19.9219 2.90156 21.225 4.90312C22.5234 6.90469 23.0906 9.21563 22.9453 11.475C22.8 13.7344 21.9469 15.9563 20.4 17.775C18.8578 19.5938 16.8094 20.7984 14.6016 21.3C13.9312 21.4547 13.2469 21.5438 12.5578 21.5672L12.2109 21.5719C10.5938 21.5719 8.99531 21.2062 7.5375 20.5031L6.4125 22.3406L6.14062 22.7812C5.84062 23.2734 5.40469 23.6297 4.90312 23.8266C4.47187 24 3.98437 24.0469 3.50625 23.9531L3.3 23.9062C2.74688 23.7516 2.2875 23.4234 1.96406 22.9969C1.67812 22.6219 1.5 22.1672 1.4625 21.675L1.45312 21.4641V10.7859L1.4625 10.3406C1.54687 8.26406 2.22188 6.31406 3.3375 4.67813L3.58594 4.33125C4.93594 2.5125 6.8625 1.125 9.15 0.440625C10.1625 0.145312 11.1937 0 12.2109 0ZM12.2109 1.5C11.3344 1.5 10.4484 1.62188 9.58125 1.88438C7.6125 2.47031 5.95781 3.66562 4.79531 5.23125C3.62813 6.79219 2.95312 8.72344 2.95312 10.7859V12.2859H2.94844V21.4594L2.9625 21.6375C2.98125 21.75 3.01875 21.8578 3.07031 21.9516L3.15938 22.0875L3.16406 22.0922C3.29531 22.2656 3.47813 22.3969 3.7125 22.4625C3.94688 22.5281 4.17187 22.5141 4.36406 22.4344H4.36875C4.56094 22.3594 4.73906 22.2187 4.87031 22.0031L5.1375 21.5625L6.2625 19.725L6.96562 18.5625L8.18906 19.1531C9.44531 19.7578 10.8141 20.0719 12.2062 20.0719C12.2016 20.0719 12.2109 20.0719 12.2484 20.0719C12.2766 20.0719 12.3188 20.0719 12.3563 20.0719C12.3938 20.0719 12.4359 20.0719 12.4734 20.0719C12.4875 20.0719 12.5063 20.0719 12.5203 20.0719C13.1063 20.0531 13.6922 19.9734 14.2594 19.8422C16.1578 19.4062 17.9203 18.375 19.2469 16.8094C20.5781 15.2438 21.3141 13.3312 21.4406 11.3859L21.4594 11.0203C21.5062 9.19219 21.0094 7.34531 19.9594 5.72812C18.8437 3.99844 17.2313 2.74688 15.4031 2.07188C14.3859 1.69688 13.3078 1.5 12.2109 1.5ZM7.25156 10.0781C7.64531 10.0781 8.00625 10.2094 8.2875 10.4906C8.57344 10.7625 8.71406 11.1141 8.71406 11.5031C8.71406 11.8922 8.57344 12.2438 8.29688 12.5203L8.29219 12.525C8.00625 12.7969 7.65 12.9234 7.25625 12.9234C6.85781 12.9234 6.49688 12.8016 6.20625 12.5297L6.19219 12.5156C5.91562 12.2391 5.775 11.8875 5.775 11.4984C5.775 11.1094 5.91563 10.7578 6.20156 10.4859C6.49219 10.2094 6.85781 10.0734 7.25625 10.0734L7.25156 10.0781ZM12.1125 10.0781C12.5062 10.0781 12.8672 10.2094 13.1484 10.4906C13.4344 10.7625 13.575 11.1141 13.575 11.5031C13.575 11.8922 13.4344 12.2438 13.1578 12.5203L13.1531 12.525C12.8672 12.7969 12.5109 12.9234 12.1172 12.9234C11.7188 12.9234 11.3578 12.8016 11.0672 12.5297L11.0531 12.5156C10.7766 12.2391 10.6359 11.8875 10.6359 11.4984C10.6359 11.1094 10.7766 10.7578 11.0625 10.4859C11.3531 10.2094 11.7188 10.0734 12.1172 10.0734L12.1125 10.0781ZM16.9734 10.0781C17.3672 10.0781 17.7281 10.2094 18.0094 10.4906C18.2953 10.7625 18.4359 11.1141 18.4359 11.5031C18.4359 11.8922 18.2953 12.2438 18.0187 12.5203L18.0141 12.525C17.7281 12.7969 17.3719 12.9234 16.9781 12.9234C16.5797 12.9234 16.2187 12.8016 15.9281 12.5297L15.9141 12.5156C15.6375 12.2391 15.4969 11.8875 15.4969 11.4984C15.4969 11.1094 15.6375 10.7578 15.9234 10.4859C16.2141 10.2094 16.5797 10.0734 16.9781 10.0734L16.9734 10.0781Z"
                                    fill="#333333"
                                />
                            </svg>
                        </div>
                        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
                            <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#333]">Chat</p>
                        </div>
                    </button>
                </div>
            ) : (
                <>
                    {offer?.active && (
                        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 px-2 pb-4 w-full box-border">
                            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 px-4 py-5 rounded-2xl bg-[#f9f6f2] w-full box-border cursor-pointer transition-opacity hover:opacity-90" onClick={() => setIntent(subscriptionIntent(offer.price))}>
                                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-full">
                                    <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-full h-[24.01px] relative gap-2">
                                        <svg
                                            width={18}
                                            height={18}
                                            viewBox="0 0 18 18"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="flex-grow-0 flex-shrink-0 w-[17.99px] h-[17.99px] relative"
                                            preserveAspectRatio="none"
                                        >
                                            <path
                                                d="M11.5048 2.993C11.3467 3.05272 11.2413 3.20377 11.2413 3.37239C11.2413 3.54101 11.3467 3.69207 11.5048 3.75179L13.4896 4.49652L14.2343 6.48132C14.294 6.6394 14.4451 6.74479 14.6137 6.74479C14.7823 6.74479 14.9334 6.6394 14.9931 6.48132L15.7378 4.49652L17.7226 3.75179C17.8807 3.69207 17.9861 3.54101 17.9861 3.37239C17.9861 3.20377 17.8807 3.05272 17.7226 2.993L15.7378 2.24826L14.9931 0.263468C14.9334 0.105387 14.7823 0 14.6137 0C14.4451 0 14.294 0.105387 14.2343 0.263468L13.4896 2.24826L11.5048 2.993ZM7.20498 2.57496C7.11364 2.37473 6.91341 2.24826 6.69561 2.24826C6.47781 2.24826 6.27757 2.37473 6.18623 2.57496L4.33142 6.57968L0.326701 8.43098C0.126465 8.52232 0 8.72256 0 8.94387C0 9.16518 0.126465 9.36191 0.326701 9.45324L4.33493 11.3045L6.18272 15.3093C6.27406 15.5095 6.47429 15.636 6.69209 15.636C6.90989 15.636 7.11013 15.5095 7.20147 15.3093L9.05277 11.301L13.061 9.44973C13.2612 9.35839 13.3877 9.15816 13.3877 8.94036C13.3877 8.72256 13.2612 8.52232 13.061 8.43098L9.05628 6.58319L7.20498 2.57496ZM13.4896 13.4896L11.5048 14.2343C11.3467 14.294 11.2413 14.4451 11.2413 14.6137C11.2413 14.7823 11.3467 14.9334 11.5048 14.9931L13.4896 15.7378L14.2343 17.7226C14.294 17.8807 14.4451 17.9861 14.6137 17.9861C14.7823 17.9861 14.9334 17.8807 14.9931 17.7226L15.7378 15.7378L17.7226 14.9931C17.8807 14.9334 17.9861 14.7823 17.9861 14.6137C17.9861 14.4451 17.8807 14.294 17.7226 14.2343L15.7378 13.4896L14.9931 11.5048C14.9334 11.3467 14.7823 11.2413 14.6137 11.2413C14.4451 11.2413 14.294 11.3467 14.2343 11.5048L13.4896 13.4896Z"
                                                fill="#F6842C"
                                            />
                                        </svg>
                                        <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#333]">
                                            {" "}
                                            Oferta de assinatura
                                        </p>
                                    </div>
                                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 pt-4 w-full">
                                        <div className="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                                            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative overflow-hidden rounded-[13.99px] shrink-0">
                                                <img src={PROFILE.avatar} alt="Avatar" className="w-[28px] h-[28px] object-cover bg-white" />
                                            </div>
                                            <div className="flex flex-col justify-start items-start flex-grow relative p-2 rounded-lg bg-white w-full min-w-0">
                                                <p className="w-full text-sm text-left text-slate-800 break-words">
                                                    {offer.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full relative mt-6">
                                    <div className="absolute left-6 -top-3 z-10">
                                        <div className="px-3 py-0.5 rounded-full bg-[#f0f9eb] shadow-sm">
                                            <p className="text-[11px] uppercase tracking-wide font-bold text-center text-[#34c759]">
                                                {offer.discount}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className="flex justify-center items-center w-full h-[47px] gap-2.5 px-5 py-3 rounded-[30px] border-[1.11px] border-transparent"
                                        style={{
                                            background:
                                                "linear-gradient(to top right, #f68d3d 0%, #f69347 3%, #f7a96c 17%, #f9b887 30%, #f9c298 41%, #fac69e 50%, #f9c09d 67%, #f8af9a 88%, #f7a499 100%)",
                                        }}
                                    >
                                        <div className="flex justify-center items-center relative">
                                            <p className="text-base font-medium text-center text-black">
                                                Assinar agora {offer.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end items-start flex-grow-0 flex-shrink-0 w-full pr-3 pt-2">
                                    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
                                        <p className="text-xs text-left text-slate-800">Preço original</p>
                                    </div>
                                    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative pl-1">
                                        <p className="text-xs text-left text-slate-800 line-through">{offer.originalPrice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {!offer?.active && (
                        <div className="px-3.5 pt-2 pb-8">
                            <p className="text-base font-medium text-subs ml-1.5">Assinaturas</p>
                            <SubscriptionButton
                                duration={monthly.label}
                                price={monthly.price}
                                onClick={() => setIntent(subscriptionIntent(monthly.price))}
                            />
                        </div>
                    )}

                    <div className="px-3.5 pb-6">
                        <div className="flex items-center justify-between cursor-pointer" onClick={onTogglePromo}>
                            <p className="text-base font-medium text-subs ml-1.5">Promoções</p>

                            <button
                                type="button"
                                className="text-black transition-transform mr-2 -mt-1.5 bg-transparent border-none cursor-pointer p-2"
                                aria-expanded={promoOpen}
                            >
                                <img src={ArrowIcon} className={`h-3.5 w-3.5 transition-transform duration-200 ${promoOpen ? "" : "rotate-180"}`} alt="Toggle" />
                            </button>
                        </div>
                        <div
                            className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${promoOpen ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0 mt-0"
                                }`}
                        >
                            <div className="overflow-hidden flex flex-col gap-2">
                                {promotions.map((plan, i) => (
                                    <SubscriptionButton
                                        key={i}
                                        duration={plan.label}
                                        price={plan.price}
                                        onClick={() => setIntent(subscriptionIntent(plan.price))}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
