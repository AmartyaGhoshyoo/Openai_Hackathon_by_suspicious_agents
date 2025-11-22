"use client";
import { useRef, useEffect, useState } from "react";
import { FaqMinusIcon, FaqPlusIcon } from "./Icon";

interface FaqItemType {
  question: string;
  answer: string;
  index: number;
  faqstate: number | null;
  handleFaqItem: () => void;
  isLast: boolean;
}

const FaqItem = ({
  question,
  answer,
  index,
  faqstate,
  isLast,
  handleFaqItem,
}: FaqItemType) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState("0px");

  useEffect(() => {
    if (faqstate === index && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight("0px");
    }
  }, [faqstate, index]);

  return (
    <div className=" text-[#1F1828]">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={handleFaqItem}
      >
        <p className="text-white text-base font-normal">{index+1}. {question}</p>
        <span className="flex-[0.2] flex justify-end">
          {faqstate === index ? <FaqMinusIcon /> : <FaqPlusIcon />}
        </span>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: maxHeight,
          overflow: "hidden",
          transition: "max-height 0.4s ease",
        }}
      >
        <p
          className="mt-[16px] text-white/70 font-normal text-base"
          dangerouslySetInnerHTML={{ __html: answer }}
        ></p>
      </div>

      {!isLast && (
        <div className="border-[0.5px]  border-[#E5E5E5]/10 my-[12px]"></div>
      )}
    </div>
  );
};

export default FaqItem;
