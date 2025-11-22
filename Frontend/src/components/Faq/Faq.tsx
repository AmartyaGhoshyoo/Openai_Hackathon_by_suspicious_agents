"use client";
import dynamic from "next/dynamic";
const FaqItem = dynamic(()=>import('@/components/Faq/FaqItem'),{ssr:false})
import React, { useEffect, useState } from "react";

function Faq({faqList}:{faqList:any}) {

  const [faqState, setFaqState] = useState<number | null>(null);
  const [getFaqlist,setFaqList] = useState<any>()

  useEffect(() => {
    setFaqList(faqList);
  }, []);
  const handleFaqItem = (index: number) => {
    setFaqState((prev) => (prev === index ? null : index));
  };

  

  return (
    <div className="w-full flex justify-center py-12">
      <div className="w-full flex flex-col">
        <h1 className="text-xl font-medium mb-8">{"Frequently asked Questions (FAQ's)"}</h1>
        <div className="w-full">
          {getFaqlist &&
            getFaqlist.map((item: any, index: number) => {
                if(item !== undefined){
                  return (
                    <FaqItem
                      key={item.id}
                      question={item.question}
                      answer={item.answer}
                      index={index}
                      isLast={getFaqlist.length === index + 1 ? true:false}
                      faqstate={faqState}
                      handleFaqItem={() => handleFaqItem(index)}
                    />
                  );
                }
            })}
        </div>
      </div>
    </div>
  );
}

export default Faq;