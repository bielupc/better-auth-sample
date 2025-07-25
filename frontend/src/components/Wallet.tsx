import { OpenfortKitButton, useStatus, OpenfortKitStatus } from '@openfort/openfort-kit'
import { useEffect } from 'react';

type WalletProps = {
  setPage: React.Dispatch<React.SetStateAction<string>>;
};

export function Wallet({setPage}: WalletProps) {
 const { status } = useStatus()
  useEffect(() => {
    if (status === OpenfortKitStatus.DISCONNECTED) {
      setPage("login");
    }
  }, [status, setPage]);

  return (
    <div>
      <OpenfortKitButton />
    </div>
  );
}
