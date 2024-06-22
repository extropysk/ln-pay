import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
    comment: params.get("comment") ?? "",
  });

  return (
    <div className="flex justify-center p-4">
      <Card className="max-w-sm">
        <CardHeader>
          <CardDescription>Leave a tip for</CardDescription>
          <CardTitle>{ADDRESS}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {!invoice ? (
            <Skeleton className="h-[256px] w-[256px]" />
          ) : (
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
          )}
          <Button
            className="w-full uppercase"
            onClick={sendPayment}
            disabled={!invoice}
          >
            ⚡️ send
          </Button>
        </CardContent>
        <CardFooter>
          Scan or click to pay using your bitcoin lightning wallet
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
