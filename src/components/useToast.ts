import { useCallback, useState } from 'react';

export function useToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);
  const hide = useCallback(() => setVisible(false), []);

  return { visible, message, show, hide };
}
