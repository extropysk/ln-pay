import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLn } from "@/hooks/ln";
import { getProperty } from "@/utils/ui";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";

const ADDRESS = "extropy@getalby.com";
const CURRENCY = "eur";

function App() {
  const [params] = useState(new URLSearchParams(window.location.search));

  const { invoice, sendPayment } = useLn({
    address: ADDRESS,
    currency: CURRENCY,
    amount: Number(params.get("amount") ?? "1"),
    comment: params.get("comment"),
  });

  return (
    <div className="flex justify-center p-4">
      <Card>
        <CardHeader>
          <CardTitle>LN PAY</CardTitle>
          <CardDescription>powered by Extropy</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {!invoice ? (
            <p>loading...</p>
          ) : (
            <>
              <a
                href={`lightning:${invoice.paymentRequest}`}
                target="_blank"
                rel="noreferrer"
              >
                <QRCodeSVG
                  value={`lightning:${invoice.paymentRequest}`}
                  size={256}
                  bgColor={getProperty("--background") || "#000000"}
                  fgColor={getProperty("--foreground") || "#ffffff"}
                  level={"M"}
                />
              </a>
              <Button className="w-full" onClick={sendPayment}>
                ⚡️ Click to pay
              </Button>
            </>
          )}
        </CardContent>
        <CardFooter>Scan or click to pay using your LN wallet</CardFooter>
      </Card>
    </div>
  );
}

export default App;
