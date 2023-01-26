import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import { faqData } from "../../../data/data";

const Faqs = () => {
  return (
    <div className="p-4 text-white">
      <h3 className="font-semibold text-xl mb-4">Frequently Asked Questions</h3>
      <Accordion>
        {faqData.map((item, index) => (
          <AccordionItem key={index} className="mb-2">
            <AccordionItemHeading className="p-4 bg-emerald-700 rounded-sm">
              <AccordionItemButton>{item.question}</AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel className="bg-emerald-600 p-4">
              <p>{item.answer}</p>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Faqs;
