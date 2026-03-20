import { useEffect } from 'react';
import { Toaster, toast } from 'sonner';

type Message = {
  type: string;
  message: string;
};

type Props = {
  messages: Message[];
};

export default function FlashToaster({ messages }: Props) {
  useEffect(() => {
    for (const msg of messages) {
      if (msg.type === 'success' || msg.type === 'notice') {
        toast.success(msg.message);
      } else if (msg.type === 'error' || msg.type === 'alert') {
        toast.error(msg.message);
      } else {
        toast(msg.message);
      }
    }
  }, [messages]);

  return <Toaster richColors position="bottom-right" />;
}
