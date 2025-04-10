export const getFieldsMpesa = (subsequent: boolean) => {
  return subsequent
    ? { ...{ subsequentPaymentMode: "Yes" }, premium: "Yes" }
    : { ...{ paymentMethod: "Yes" }, premium: "Yes" };
};

export const getFieldsCheckOff = (subsequent: boolean) => {
  const commonFieldsCheckOff = {
    schemeName: "Yes",
    schemeNumber: "Yes",
    payrollNo: "Yes",
    deductionMonth: "Yes",
    deductionYear: "Yes",
    amount: "Yes",
  };

  return subsequent
    ? { ...{ subsequentPaymentMode: "Yes" }, commonFieldsCheckOff }
    : { ...{ paymentMethod: "Yes" }, commonFieldsCheckOff };
};

export const getFieldsDirectDebit = (subsequent: boolean) => {
  const commonFieldsCheckOff = {
    paymentMethod: "Yes",
    accountName: "Yes",
    accountNumber: "Yes",
    bankName: "Yes",
    bankNumber: "Yes",
    branchName: "Yes",
    branchNumber: "Yes",
    collectionDate: "Yes",
    frequency: "Yes",
    sourceOfFunds: "Yes",
    amount: "Yes",
  };

  return subsequent
    ? { ...{ subsequentPaymentMode: "Yes" }, commonFieldsCheckOff }
    : { ...{ paymentMethod: "Yes" }, commonFieldsCheckOff };
};

export const getFieldsCheque = (subsequent: boolean) => {
  const commonFieldsCheque = {
    sourceOfFunds: "Yes",
    premium: "Yes",
  };

  return subsequent
    ? { ...{ subsequentPaymentMode: "Yes" }, commonFieldsCheque }
    : { ...{ paymentMethod: "Yes" }, commonFieldsCheque };
};

export const getFieldsRtgs = (subsequent: boolean) => {
  const commonFieldsRtgs = {
    sourceOfFunds: "Yes",
    premium: "Yes",
  };

  return subsequent
    ? { ...{ subsequentPaymentMode: "Yes" }, commonFieldsRtgs }
    : { ...{ paymentMethod: "Yes" }, commonFieldsRtgs };
};
