"use client";

import { useEffect, useMemo, useState } from "react";
import { PaymentIntent, mimoIntent } from "../access/config";
import { PROFILE } from "../data";

const Avatar = PROFILE.avatar;

const MIN_VALUE = 5;
const MAX_VALUE = 10000;
const MAX_MESSAGE = 500;

type MimoModalProps = {
    open: boolean;
    title: string;
    onClose: () => void;
    onPay: (intent: PaymentIntent) => void;
};

const formatBRL = (value: number): string =>
    `R$ ${value.toLocaleString("pt-BR")}`;

export const MimoModal = ({ open, title, onClose, onPay }: MimoModalProps): JSX.Element | null => {
    const [value, setValue] = useState(50);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setValue(50);
            setMessage("");
        }
        return () => {
            document.body.style.overflow = "";
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const pct = useMemo(
        () => ((value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100,
        [value],
    );

    if (!open) return null;

    const handleSend = () => {
        onPay(mimoIntent(value * 100, formatBRL(value)));
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
            <div
                className="flex flex-col justify-start items-start w-[800px] max-w-full relative rounded-[18px] bg-white overflow-hidden"
                style={{ boxShadow: "0px 12px 32px 4px rgba(0,0,0,0.04), 0px 8px 20px 0 rgba(0,0,0,0.08)" }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 self-stretch relative px-5 pt-[19.5px] pb-[11.5px]">
                    <p className="flex-grow-0 flex-shrink-0 text-lg text-left text-[#303133]">{title}</p>
                </div>
                <div
                    className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[54px] w-[54px] absolute right-1 top-1.5 pt-4 pb-[22px] cursor-pointer"
                    onClick={onClose}
                >
                    <svg
                        width={16}
                        height={16}
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0 w-4 h-4 relative"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M11.942 3.353L8.00002 7.295L4.05802 3.353C3.86105 3.17275 3.5571 3.17949 3.36831 3.36828C3.17951 3.55708 3.17278 3.86103 3.35302 4.058L7.29302 8L3.35202 11.941C3.22096 12.0659 3.16783 12.252 3.2132 12.4273C3.25858 12.6026 3.39533 12.7395 3.57054 12.7851C3.74575 12.8308 3.93193 12.7779 4.05702 12.647L8.00002 8.706L11.942 12.648C12.139 12.8282 12.4429 12.8215 12.6317 12.6327C12.8205 12.4439 12.8273 12.14 12.647 11.943L8.70502 8.001L12.647 4.058C12.7781 3.93309 12.8312 3.74699 12.7858 3.57171C12.7405 3.39644 12.6037 3.25949 12.4285 3.21387C12.2533 3.16825 12.0671 3.22111 11.942 3.352V3.353"
                            fill="#909399"
                        />
                    </svg>
                </div>
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[30px] px-5 pt-2.5 pb-[30px]">
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 overflow-hidden p-5 rounded bg-white border border-solid border-[#dcdfe6]">
                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                            <div
                                className="flex-grow-0 flex-shrink-0 w-[70px] h-[70px] relative overflow-hidden rounded-[35px] bg-cover bg-center"
                                style={{ backgroundImage: `url(${Avatar})` }}
                            />
                            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative px-2">
                                <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#303133]">
                                    <span className="flex-grow-0 flex-shrink-0 text-sm font-bold text-left text-[#303133]">
                                        {PROFILE.name}
                                    </span>
                                    <br />
                                    <span className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#303133]">
                                        Vai ficar muito feliz em receber seu mimo!
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative gap-[18px]">
                        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 pb-1.5">
                            <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-[5px]">
                                <button
                                    type="button"
                                    onClick={() => setValue((v) => Math.max(MIN_VALUE, v - 5))}
                                    className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative px-1.5 py-px rounded-xl bg-[#f6842c] cursor-pointer"
                                >
                                    <svg width={13} height={14} viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0 w-[12.25px] h-3.5 relative" preserveAspectRatio="none">
                                        <path d="M11.8125 7C11.8125 7.48398 11.4215 7.875 10.9375 7.875H1.3125C0.828516 7.875 0.4375 7.48398 0.4375 7C0.4375 6.51602 0.828516 6.125 1.3125 6.125H10.9375C11.4215 6.125 11.8125 6.51602 11.8125 7V7" fill="white" />
                                    </svg>
                                </button>
                                <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 relative px-3">
                                    <p className="flex-grow-0 flex-shrink-0 text-4xl font-semibold text-left text-black select-none">
                                        {formatBRL(value)}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setValue((v) => Math.min(MAX_VALUE, v + 5))}
                                    className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-6 h-6 relative px-1.5 py-px rounded-xl bg-[#f6842c] cursor-pointer"
                                >
                                    <svg width={13} height={14} viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-grow-0 flex-shrink-0 w-[12.25px] h-3.5 relative" preserveAspectRatio="none">
                                        <path d="M7 2.1875C7 1.70352 6.60898 1.3125 6.125 1.3125C5.64102 1.3125 5.25 1.70352 5.25 2.1875V6.125H1.3125C0.828516 6.125 0.4375 6.51602 0.4375 7C0.4375 7.48398 0.828516 7.875 1.3125 7.875H5.25V11.8125C5.25 12.2965 5.64102 12.6875 6.125 12.6875C6.60898 12.6875 7 12.2965 7 11.8125V7.875H10.9375C11.4215 7.875 11.8125 7.48398 11.8125 7C11.8125 6.51602 11.4215 6.125 10.9375 6.125H7V2.1875V2.1875" fill="white" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-9 relative pt-1">
                                <div className="flex-grow h-1.5 relative rounded-[3px] bg-[#ddd]">
                                    <div
                                        className="h-1.5 absolute left-[-1px] top-[-1px] rounded-[3px] bg-[#f6842c]"
                                        style={{ width: `calc(${pct}% + 2px)` }}
                                    />
                                    <div
                                        className="flex flex-col justify-start items-center w-9 h-9 absolute top-[-15px]"
                                        style={{ left: `calc(${pct}% - 18px)` }}
                                    >
                                        <div
                                            className="flex-grow-0 flex-shrink-0 w-4 h-4 mt-[10px] rounded-lg bg-[#f6842c]"
                                            style={{ boxShadow: "0px 0px 4px 0 rgba(0,0,0,0.2)" }}
                                        />
                                    </div>
                                    <input
                                        type="range"
                                        min={MIN_VALUE}
                                        max={MAX_VALUE}
                                        step={5}
                                        value={value}
                                        onChange={(e) => setValue(Number(e.target.value))}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-6 opacity-0 cursor-pointer"
                                        aria-label="Valor do mimo"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                                <p className="flex-grow-0 flex-shrink-0 text-sm text-center text-[#333]">
                                    <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#333]">Mínimo</span>
                                    <span className="flex-grow-0 flex-shrink-0 text-sm text-center text-[#333]">: R$ 5 - </span>
                                    <span className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#333]">Máximo</span>
                                    <span className="flex-grow-0 flex-shrink-0 text-sm text-center text-[#333]">: R$ 10.000</span>
                                </p>
                            </div>
                        </div>
                        <div className="self-stretch flex-grow-0 flex-shrink-0 h-px border-t border-solid border-r-0 border-b-0 border-l-0 border-[#dcdfe6]" />
                        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-1 pt-1.5 pb-0.5">
                            <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative overflow-hidden pl-5 pr-2.5">
                                <p className="self-stretch flex-grow-0 flex-shrink-0 text-[11.199999809265137px] text-left uppercase text-[#333]">
                                    DIGITE UMA MENSAGEM (OPCIONAL)
                                </p>
                            </div>
                            <div className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0">
                                <div className="flex flex-col justify-start items-start flex-grow relative gap-[9.5px]">
                                    <textarea
                                        value={message}
                                        maxLength={MAX_MESSAGE}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="self-stretch flex-grow-0 flex-shrink-0 w-full h-[103px] resize-none overflow-auto rounded-[25px] bg-slate-50 px-5 py-3 text-sm text-[#333] outline-none border border-solid border-[#dcdfe6] focus:border-[#f6842c]"
                                        placeholder="Escreva algo carinhoso..."
                                    />
                                    <div className="flex justify-end items-start self-stretch flex-grow-0 flex-shrink-0 relative">
                                        <p className="flex-grow-0 flex-shrink-0 text-xs text-right text-[#333]">{message.length} / {MAX_MESSAGE}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleSend}
                            className="flex justify-center items-center self-stretch flex-grow-0 flex-shrink-0 px-5 py-3 rounded-[100px] border border-[#f6842c] cursor-pointer transition-colors hover:bg-[#f6842c]/5"
                        >
                            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 gap-2">
                                <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-center text-[#f6842c]">
                                    {`Enviar ${formatBRL(value)}`}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
