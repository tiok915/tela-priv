const shimmer = "animate-pulse bg-[#ececec]";

export const CheckoutSkeleton = (): JSX.Element => {
    return (
        <div className="mx-auto flex w-full max-w-[716px] flex-col gap-4">
            <div className="rounded-3xl border border-[#dddddd] bg-white overflow-hidden">
                <div className={`h-[88px] w-full ${shimmer}`} />
                <div className="flex items-end justify-between px-4 -mt-10 mb-2">
                    <div className={`h-20 w-20 shrink-0 rounded-[40px] border-4 border-white ${shimmer}`} />
                    <div className="flex items-center gap-3 pb-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={`h-3.5 w-10 rounded ${shimmer}`} />
                        ))}
                    </div>
                </div>
                <div className="px-4">
                    <div className={`h-5 w-48 rounded ${shimmer}`} />
                    <div className={`mt-2 h-3.5 w-32 rounded ${shimmer}`} />
                    <div className={`mt-3 h-3.5 w-full rounded ${shimmer}`} />
                </div>
                <div className="flex gap-1.5 my-3 mx-4">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className={`h-8 w-8 rounded-2xl ${shimmer}`} />
                    ))}
                </div>
                <div className="flex gap-2 px-3.5 pt-2 pb-8">
                    <div className={`h-11 flex-1 rounded-2xl ${shimmer}`} />
                    <div className={`h-11 flex-1 rounded-2xl ${shimmer}`} />
                </div>
            </div>

            <div className="flex items-center justify-center gap-8 py-2">
                <div className={`h-5 w-28 rounded ${shimmer}`} />
                <div className={`h-5 w-24 rounded ${shimmer}`} />
            </div>

            {[0, 1].map((i) => (
                <div key={i} className="rounded-2xl border border-[#dddddd] bg-white overflow-hidden">
                    <div className="flex items-center gap-2 px-5 pt-6 pb-3">
                        <div className={`h-[62px] w-[62px] rounded-full ${shimmer}`} />
                        <div className="flex flex-col gap-2">
                            <div className={`h-4 w-40 rounded ${shimmer}`} />
                            <div className={`h-3 w-24 rounded ${shimmer}`} />
                        </div>
                    </div>
                    <div className={`h-[360px] w-full ${shimmer}`} />
                    <div className="flex items-center gap-3 px-4 py-5">
                        <div className={`h-[22px] w-[22px] rounded ${shimmer}`} />
                        <div className={`h-[22px] w-[22px] rounded ${shimmer}`} />
                    </div>
                </div>
            ))}
        </div>
    );
};
