import { lnFallback } from "@/utils/ln";
import { Invoice, LightningAddress, fiat } from "@getalby/lightning-tools";
import { useEffect, useState } from "react";

const CURRENCY = "eur";

const enum ErrorCode {
  LnNotDefined = "LN_NOT_DEFINED",
  WeblnError = "WEBLN_ERROR",
}

interface Error {
  code: ErrorCode;
  message?: string;
}

interface Params {
  address: string;
  amount: number;
  currency?: string;
  comment?: string | null;
}

export function useLn({ address, amount, currency, comment }: Params) {
  const [invoice, setInvoice] = useState<Invoice>();

  useEffect(() => {
    const init = async () => {
      const ln = new LightningAddress(address);
      await ln.fetch();

      const satoshi = currency
        ? await fiat.getSatoshiValue({
            amount,
            currency,
          })
        : amount;

      const invoice = await ln.requestInvoice({ satoshi, comment });
      setInvoice(invoice);
    };

    init();
  }, [address, amount, comment, currency]);

  const sendPayment = async () => {
    if (!invoice) {
      return;
    }

    if (window.webln) {
      try {
        await window.webln.enable();
        const response = await window.webln.sendPayment(invoice.paymentRequest);
        const paid = invoice.validatePreimage(response.preimage);
        console.log(response);
      } catch (error: unknown) {
        console.log(error);
      }
    } else {
      lnFallback(invoice.paymentRequest);
    }
  };

  return { invoice, sendPayment };
}
