"use client";
import { useProposalStore } from "@/state/proposal/proposal";
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import { CheckOffDetails, DirectDebitDetails, MpesaDetails } from ".";
import { ChequeDetails } from "./cheque_details";
import { RtgsDetails } from "./rtgs_details";

type PaymentType =
  | "MOBILE_PAYMENT"
  | "CHECK_OFF"
  | "DIRECT_DEBIT"
  | "CHEQUE"
  | "RTGS";

interface PaymentDetailsProps {
  goToNextTab: () => void;
  firstPayment?: PaymentType;
  subsequentPayment?: PaymentType;
}

export const PaymentDetails: FC<PaymentDetailsProps> = ({
  goToNextTab,
  firstPayment = "",
  subsequentPayment = "",
}) => {
  const params = useParams<{ id: string }>();
  const { loading, fetchLookUpList, fetchCheckOff, fetchDirectDebit, fetchPayments } = useProposalStore();

  const [error, setError] = useState<string | null>(null);

  const firstSubsequentDifferent =
    subsequentPayment !== "" && firstPayment !== subsequentPayment;

  useEffect(() => {
    const fetchPaymentsAsync = async () => {
      try {
        if (
          firstPayment === "MOBILE_PAYMENT" ||
          subsequentPayment === "MOBILE_PAYMENT"
        ) {
          await fetchPayments(params?.id);
        }
        if (firstPayment === "CHECK_OFF" || subsequentPayment === "CHECK_OFF") {
          await fetchCheckOff(params?.id);
        }
        if (
          firstPayment === "DIRECT_DEBIT" ||
          subsequentPayment === "DIRECT_DEBIT"
        ) {
          await fetchDirectDebit(params?.id);
        }
      } catch (error: any) {
        setError(
          `Fetching payment details failed: ${error?.response?.data?.description}`
        );
      }
    };

    fetchPaymentsAsync();
  }, [params?.id, firstPayment, subsequentPayment]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const onNextActionFirst = async () => {
    if (!firstSubsequentDifferent) {
      goToNextTab();
    }
  };

  const renderPaymentDetails = (
    paymentType: PaymentType,
    subsequent: boolean = false
  ) => {
    switch (paymentType) {
      case "MOBILE_PAYMENT":
        return (
          <MpesaDetails
            subsequent={subsequent}
            firstSubsequentDifferent={firstSubsequentDifferent}
            onNextAction={subsequent ? goToNextTab : onNextActionFirst}
          />
        );

      case "CHECK_OFF":
        return (
          <CheckOffDetails
            subsequent={subsequent}
            firstSubsequentDifferent={firstSubsequentDifferent}
            onNextAction={subsequent ? goToNextTab : onNextActionFirst}
          />
        );

      case "DIRECT_DEBIT":
        return (
          <DirectDebitDetails
            subsequent={subsequent}
            firstSubsequentDifferent={firstSubsequentDifferent}
            onNextAction={subsequent ? goToNextTab : onNextActionFirst}
          />
        );

      case "CHEQUE":
        return (
          <ChequeDetails
            subsequent={subsequent}
            firstSubsequentDifferent={firstSubsequentDifferent}
            onNextAction={subsequent ? goToNextTab : onNextActionFirst}
          />
        );

      case "RTGS":
        return (
          <RtgsDetails
            subsequent={subsequent}
            firstSubsequentDifferent={firstSubsequentDifferent}
            onNextAction={subsequent ? goToNextTab : onNextActionFirst}
          />
        );

      default:
        return null;
    }
  };

  return (
    <section className="bg-white px-5 rounded-xl py-4">
      {firstSubsequentDifferent && !loading && (
        <h3 className="text-center font-semibold">First Mode of Payment</h3>
      )}
      <div className="flex items-stretch justify-stretch">
        {renderPaymentDetails(firstPayment as PaymentType)}
      </div>

      {firstSubsequentDifferent && !loading && (
        <div>
          <h3 className="text-center font-semibold">
            Subsequent Mode of Payment
          </h3>
          <div className="flex items-stretch justify-stretch">
            {renderPaymentDetails(subsequentPayment as PaymentType, true)}
          </div>
        </div>
      )}
    </section>
  );
};
