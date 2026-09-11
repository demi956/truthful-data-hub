import { MessageCircle } from "lucide-react";
import { BUSINESS, whatsappLink } from "@/lib/business";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(`Hello ${BUSINESS.name}, I have a question.`)}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Newton's Hub on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-success-foreground shadow-lg transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}
