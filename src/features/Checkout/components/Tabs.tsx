type TabItem = {
    icon: string;
    label: string;
};

type TabsProps = {
    activeTab: number;
    onChange: (index: number) => void;
    tabs: TabItem[];
};

const normalizeTabSvg = (svg: string): string => {
    return svg
        .replace(/fill="(?!none)[^"]*"/g, "fill=\"currentColor\"")
        .replace("<svg ", "<svg style=\"width:100%;height:100%;display:block\" ");
};

export const Tabs = ({ activeTab, onChange, tabs }: TabsProps): JSX.Element => {
    return (
        <div className="self-stretch h-14 pt-0.5 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-[#dddddd] inline-flex justify-start items-center gap-0 flex-wrap content-center w-full">
            <div className="flex-1 inline-flex flex-col justify-start items-start">
                <div
                    onClick={() => onChange(0)}
                    className="group self-stretch h-14 px-4 py-[28px] inline-flex justify-center items-center cursor-pointer transition-colors"
                    style={{
                        borderRadius: "16px 16px 0 17px",
                        borderBottom: activeTab === 0 ? "2.5px solid #f68d3d" : "2.5px solid transparent",
                    }}
                >
                    <span
                        className={`mr-2 inline-flex h-5 w-5 ${
                            activeTab === 0 ? "text-[#f68d3d]" : "text-[#333333] group-hover:text-[#f68d3d]"
                        }`}
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: normalizeTabSvg(tabs[0].icon) }}
                    />
                    <span
                        className={`font-[family-name:var(--privacy-com-br-semantic-heading-2-font-family)] font-[number:var(--privacy-com-br-semantic-heading-2-font-weight)] text-[length:var(--privacy-com-br-semantic-heading-2-font-size)] leading-[var(--privacy-com-br-semantic-heading-2-line-height)] whitespace-nowrap ${
                            activeTab === 0 ? "text-[#f68d3d]" : "text-[#333333] group-hover:text-[#f68d3d]"
                        }`}
                    >
                        {tabs[0].label}
                    </span>
                </div>
            </div>

            <div className="flex-1 inline-flex flex-col justify-start items-start">
                <div
                    onClick={() => onChange(1)}
                    className="group self-stretch h-14 px-4 py-[28px] inline-flex justify-center items-center cursor-pointer transition-colors"
                    style={{
                        borderRadius: "16px 16px 16px 0",
                        borderBottom: activeTab === 1 ? "2.5px solid #f68d3d" : "2.5px solid transparent",
                    }}
                >
                    <span
                        className={`mr-2 inline-flex h-5 w-5 ${
                            activeTab === 1 ? "text-[#f68d3d]" : "text-[#333333] group-hover:text-[#f68d3d]"
                        }`}
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{ __html: normalizeTabSvg(tabs[1].icon) }}
                    />
                    <span
                        className={`font-[family-name:var(--privacy-com-br-semantic-heading-2-font-family)] font-[number:var(--privacy-com-br-semantic-heading-2-font-weight)] text-[length:var(--privacy-com-br-semantic-heading-2-font-size)] leading-[var(--privacy-com-br-semantic-heading-2-line-height)] whitespace-nowrap ${
                            activeTab === 1 ? "text-[#f68d3d]" : "text-[#333333] group-hover:text-[#f68d3d]"
                        }`}
                    >
                        {tabs[1].label}
                    </span>
                </div>
            </div>
        </div>
    );
};
