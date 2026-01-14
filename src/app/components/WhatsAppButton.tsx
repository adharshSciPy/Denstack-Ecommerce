import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export default function WhatsAppButton({ 
  phoneNumber = "919876543210", 
  message = "Hi! I need help with my dental equipment order." 
}: WhatsAppButtonProps) {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-all duration-300 hover:scale-110 active:scale-95 z-[9999] flex items-center gap-3 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      <span className="hidden group-hover:inline-block font-semibold pr-2 whitespace-nowrap animate-fade-in">
        Chat with us
      </span>
      
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping pointer-events-none" />
      <span className="absolute inset-0 rounded-full bg-green-400 opacity-50 animate-pulse pointer-events-none" />
      
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </button>
  );
}