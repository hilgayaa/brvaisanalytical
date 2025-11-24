"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"; // Adjust import paths if needed

interface Props {
  productName: string;
  productImg:string ;
  productCategory:string
}

export function AskForQuoteButton({ productName,productCategory,productImg }: Props) {
  // WhatsApp message
  const whatsappMessage = encodeURIComponent(
    `Hello, I am interested in a quote for the product: ${productName}. 
     category : ${productCategory}
     imgUrl : ${productImg}
    Please provide details.`
  );
  const whatsappUrl = `https://wa.me/919156344465?text=${whatsappMessage}`;

  // Gmail message
  const gmailSubject = encodeURIComponent(`Quote Request for ${productName}`);
  const gmailBody = encodeURIComponent(
    `Hello,\n\nI would like to request a quote for the product: ${productName}.\n\nThank you!`
  );
  const gmailUrl = `mailto:bravaisanalytical@gmail.com?subject=${gmailSubject}&body=${gmailBody}`;

  return (
    <Dialog >
      <DialogTrigger asChild>
        <Button className="w-full">Ask for Quote</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle>Choose an option</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 mt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-green-500 text-white rounded text-center"
          >
            WhatsApp
          </a>
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-blue-500 text-white rounded text-center"
          >
            Gmail
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
