"use client";

import { useEffect } from "react";
import { PaymentIntent } from "../access/config";
import { usePixPayment } from "../access/usePixPayment";
import { PROFILE } from "../data";

const CoverImage = PROFILE.cover;
const AvatarImage = PROFILE.avatar;
const QrCodePlaceholder = "/assets/images/image.png";

type PaymentModalProps = {
    intent: PaymentIntent | null;
    onClose: () => void;
    onPaid: (token: string, intent: PaymentIntent) => void;
    checkoutName: string;
};

export const PaymentModal = ({
    intent,
    onClose,
    onPaid,
    checkoutName,
}: PaymentModalProps): JSX.Element | null => {
    const { phase, pixCode, qrImage, start, reset } = usePixPayment(onPaid);

    useEffect(() => {
        if (intent) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [intent]);

    useEffect(() => {
        if (intent) {
            void start(intent);
        } else {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [intent]);

    useEffect(() => {
        if (phase !== "paid") return;
        const t = setTimeout(() => onClose(), 400);
        return () => clearTimeout(t);
    }, [phase, onClose]);

    if (!intent) return null;

    const loading = phase !== "awaiting" && phase !== "paid";

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-0 sm:p-4">
            <div className="flex flex-col justify-start items-start flex-grow-0 h-full sm:h-[801px] relative rounded-none sm:rounded-[18px] bg-[#f9f6f2] w-full sm:max-w-[500px] overflow-y-auto sm:overflow-hidden">
                <div
                    className="flex-grow-0 flex-shrink-0 w-[550px] md:w-full h-[801.48px] rounded-[18px] bg-white/0 absolute inset-0 pointer-events-none"
                    style={{ boxShadow: "0px 12px 32px 4px rgba(0,0,0,0.04), 0px 8px 20px 0 rgba(0,0,0,0.08)" }}
                />
                <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[30px] w-[30px] absolute right-1 top-1.5 pt-0.5 pb-2 z-20 cursor-pointer" onClick={onClose}>
                    <svg
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-5 h-5 relative hover:opacity-80 transition-opacity"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M14.9275 4.19123L10 9.11873L5.07251 4.19123C4.954 4.08278 4.79821 4.02424 4.63761 4.0278C4.477 4.03136 4.32396 4.09674 4.21037 4.21034C4.09677 4.32393 4.03138 4.47697 4.02783 4.63758C4.02427 4.79818 4.08281 4.95397 4.19126 5.07248L9.11626 9.99998L4.19001 14.9262C4.12983 14.9836 4.08172 15.0524 4.04851 15.1286C4.0153 15.2048 3.99766 15.2869 3.99663 15.37C3.9956 15.4532 4.0112 15.5357 4.04251 15.6127C4.07382 15.6897 4.12022 15.7597 4.17896 15.8185C4.23771 15.8773 4.30762 15.9238 4.38459 15.9553C4.46156 15.9867 4.54404 16.0024 4.62717 16.0015C4.71031 16.0006 4.79242 15.9831 4.86868 15.95C4.94494 15.9168 5.01382 15.8688 5.07126 15.8087L10 10.8825L14.9275 15.81C15.046 15.9184 15.2018 15.977 15.3624 15.9734C15.523 15.9699 15.6761 15.9045 15.7897 15.7909C15.9033 15.6773 15.9686 15.5242 15.9722 15.3636C15.9758 15.203 15.9172 15.0472 15.8088 14.9287L10.8813 10.0012L15.8088 5.07248C15.8689 5.01513 15.9171 4.94632 15.9503 4.8701C15.9835 4.79388 16.0011 4.7118 16.0021 4.62867C16.0032 4.54554 15.9876 4.46304 15.9563 4.38602C15.925 4.30901 15.8786 4.23903 15.8198 4.1802C15.7611 4.12137 15.6912 4.07488 15.6142 4.04346C15.5372 4.01203 15.4547 3.99632 15.3716 3.99723C15.2885 3.99814 15.2064 4.01566 15.1301 4.04876C15.0538 4.08187 14.985 4.12988 14.9275 4.18998V4.19123Z"
                            fill="#ffffffff"
                        />
                    </svg>
                </div>
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
                    <div
                        className="self-stretch flex-grow-0 flex-shrink-0 w-full h-20 relative overflow-hidden rounded-tl-[18px] rounded-tr-[18px] bg-cover bg-center"
                        style={{ backgroundImage: `url(${CoverImage})` }}
                    />
                    <div className="flex flex-row justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative px-4">
                        <div className="flex-grow-0 flex-shrink-0 w-24 h-16 relative mr-2">
                            <img
                                src={AvatarImage}
                                alt="Avatar"
                                className="w-24 h-24 absolute -left-1.5 top-[-30px] rounded-[48px] object-cover z-10 bg-white"
                            />
                        </div>
                        <div className="flex-grow-0 flex-shrink-0 h-16 relative flex flex-col justify-center">
                            <div className="flex flex-col justify-start items-start relative -ml-1.5 -mt-2.5">
                                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
                                    <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-slate-800 font-base truncate max-w-[130px] md:max-w-[200px]">
                                        {checkoutName}
                                    </p>
                                </div>
                                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative -mt-1">
                                    <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#6c757d]">
                                        {PROFILE.handle}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex-grow-0 flex-shrink-0 w-full h-px border-t border-r-0 border-b-0 border-l-0 border-[#dcdfe6]" />
                <div className="self-stretch flex-grow-0 flex-shrink-0 h-[657px] relative w-full overflow-hidden">
                    <div className="flex flex-col justify-start items-start w-[calc(100%-2rem)] absolute left-4 top-3 gap-2">
                        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
                            <p className="self-stretch flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-black">
                                Benefícios exclusivos
                            </p>
                        </div>
                        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[0.5px]">
                            {["Acesso ao conteúdo", "Chat exclusivo com o criador", "Cancele a qualquer hora"].map((benefit, i) => (
                                <div key={i} className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[2px]">
                                    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 h-[18.19px] pr-[9px]">
                                        <div className="flex flex-col justify-center items-start flex-grow-0 flex-shrink-0 h-[18.19px] relative">
                                            <svg
                                                width={16}
                                                height={19}
                                                viewBox="0 0 16 19"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="flex-grow w-[15.91px] relative"
                                                preserveAspectRatio="none"
                                            >
                                                <path
                                                    d="M15.5788 3.74721C16.0228 4.19108 16.0228 4.91193 15.5788 5.3558L6.48741 14.4463C6.04349 14.8902 5.32257 14.8902 4.87865 14.4463L0.332938 9.90106C-0.110979 9.45719 -0.110979 8.73634 0.332938 8.29246C0.776855 7.84859 1.49778 7.84859 1.94169 8.29246L5.68481 12.0316L13.9736 3.74721C14.4176 3.30334 15.1385 3.30334 15.5824 3.74721H15.5788Z"
                                                    fill="#F68D3D"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative">
                                        <p className="flex-grow-0 flex-shrink-0 text-base text-left text-[#333]">
                                            {benefit}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="absolute left-0 top-[138px] w-full h-[1px] bg-[#dcdfe6] z-[99]" />

                    <div className="w-[calc(100%-2rem)] max-w-[460px] h-[685.89px] absolute left-4 md:left-[20px] top-[154.59px]">
                        <div className="flex flex-col justify-start items-start w-full absolute left-0 top-0 rounded-bl-[18px] rounded-br-[18px] bg-[#f9f6f2]">
                            <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-6">
                                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2">
                                    <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-1">
                                        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
                                            <p className="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-[#303133]">
                                                Formas de pagamento
                                            </p>
                                        </div>
                                        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
                                            <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#a8abb2]">Valor</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 -mt-1">
                                        <div className="flex flex-col justify-start items-start flex-grow relative">
                                            <p className="self-stretch flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-[#303133]">
                                                {intent.priceLabel}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center items-start flex-grow-0 flex-shrink-0 w-full">
                                    <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-[236px] px-3">
                                        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative p-4 rounded-lg bg-white border-2 border-solid border-[#1e293b]">
                                            <div className="flex-grow-0 flex-shrink-0 w-[200px] h-[200px] relative overflow-hidden bg-gray-200 border-2 border-black rounded shadow-sm">
                                                {loading ? (
                                                    <div className="w-full h-full bg-gradient-to-tr from-slate-200 to-slate-100 animate-pulse" />
                                                ) : (
                                                    <img src={qrImage || QrCodePlaceholder} alt="QR Code" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none" }} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[126px] gap-4 px-3 pt-6 w-full">
                                        <div className="flex justify-center items-start self-stretch flex-grow-0 flex-shrink-0 w-full overflow-hidden">
                                            {loading ? (
                                                <div className="w-full h-[38px] rounded-[18px] bg-gradient-to-tr from-slate-200 to-slate-100 animate-pulse" />
                                            ) : (
                                                <input
                                                    type="text"
                                                    readOnly
                                                    value={pixCode}
                                                    className="flex-grow w-full h-[38px] px-[15px] rounded-[18px] bg-slate-50 text-sm text-left text-[#333] border border-solid border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-200 text-ellipsis whitespace-nowrap overflow-hidden"
                                                />
                                            )}
                                        </div>
                                        {loading ? (
                                            <div className="w-full h-[46px] rounded-[18px] bg-gradient-to-tr from-slate-200 to-slate-100 animate-pulse" />
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn-subscription w-full flex items-center justify-center h-[46px]"
                                                onClick={() => pixCode && navigator.clipboard.writeText(pixCode)}
                                            >
                                                <span className="text-center text-base font-medium leading-none text-subs">
                                                    Copiar chave Pix
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="self-stretch flex-grow-0 flex-shrink-0 h-px border-t border-r-0 border-b-0 border-l-0 border-[#dcdfe6]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
