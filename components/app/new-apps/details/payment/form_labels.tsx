export const getLabelsMpesa = (subsequent: boolean) => {
  const commonLabels = {
    premium: {
      name: "premium",
      label: "Premium",
      type: "",
      options: [],
    },
  };

  return subsequent
    ? {
        subsequentPaymentMode: {
          name: "subsequentPaymentMode",
          label: "Subsequent Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect transaction details",
            "Missing transaction details",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      }
    : {
        paymentMethod: {
          name: "paymentMethod",
          label: "Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect transaction details",
            "Missing transaction details",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      };
};

export const getLabelsCheckOff = (subsequent: boolean) => {
  const commonLabels = {
    schemeName: {
      name: "schemeName",
      label: "Scheme Name",
      type: "Relisted Reason",
      options: ["Wrong scheme name"],
    },
    schemeNumber: {
      name: "schemeNumber",
      label: "Scheme Number",
      type: "",
      options: [],
    },
    payrollNo: {
      name: "payrollNo",
      label: "Payroll Number",
      type: "Relisted Reason",
      options: [
        "Provide current payroll number",
        "Payroll number inconsistent with our records",
        "Wrong payroll number",
      ],
    },
    deductionMonth: {
      name: "deductionMonth",
      label: "Deduction Month",
      type: "Relisted Reason",
      options: ["Backdated deduction month"],
    },
    deductionYear: {
      name: "deductionYear",
      label: "Deduction Year",
      type: "Relisted Reason",
      options: ["Backdated deduction year"],
    },
    amount: {
      name: "amount",
      label: "Premium",
      type: "",
      options: [],
    },
  };

  return subsequent
    ? {
        subsequentPaymentMode: {
          name: "subsequentPaymentMode",
          label: "Subsequent Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect checkoff form",
            "Missing checkoff form",
            "Unclear checkoff form",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      }
    : {
        paymentMethod: {
          name: "paymentMethod",
          label: "Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect checkoff form",
            "Missing checkoff form",
            "Unclear checkoff form",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      };
};

export const getLabelsDirectDebit = (subsequent: boolean) => {
  const commonLabels = {
    accountName: {
      name: "accountName",
      label: "Account Name",
      type: "Relisted Reason",
      options: ["Wrong account name"],
    },
    accountNumber: {
      name: "accountNumber",
      label: "Account Number",
      type: "Relisted Reason",
      options: ["Wrong account number"],
    },
    bankName: {
      name: "bankName",
      label: "Bank Name",
      type: "Relisted Reason",
      options: ["Wrong bank name"],
    },
    bankNumber: {
      name: "bankNumber",
      label: "Bank Number",
      type: "",
      options: [],
    },
    branchName: {
      name: "branchName",
      label: "Branch Name",
      type: "Relisted Reason",
      options: ["Wrong branch name"],
    },
    branchNumber: {
      name: "branchNumber",
      label: "Branch Number",
      type: "",
      options: [],
    },
    collectionDate: {
      name: "collectionDate",
      label: "Collection Date",
      type: "Relisted Reason",
      options: ["Wrong collection date"],
    },
    frequency: {
      name: "frequency",
      label: "Frequency",
      type: "Relisted Reason",
      options: ["Wrong frequency"],
    },
    sourceOfFunds: {
      name: "sourceOfFunds",
      label: "Source Of Funds",
      type: "Relisted Reason",
      options: [
        "Incorrect source of funds",
        "Missing source of funds",
        "Unclear source of funds",
      ],
    },
    amount: {
      name: "amount",
      label: "Premium",
      type: "",
      options: [],
    },
  };

  return subsequent
    ? {
        subsequentPaymentMode: {
          name: "subsequentPaymentMode",
          label: "Subsequent Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect DDA form",
            "Missing DDA form",
            "Unclear DDA form",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      }
    : {
        paymentMethod: {
          name: "paymentMethod",
          label: "Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect DDA form",
            "Missing DDA form",
            "Unclear DDA form",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      };
};

export const getLabelsCheque = (subsequent: boolean) => {
  const commonLabels = {
    sourceOfFunds: {
      name: "sourceOfFunds",
      label: "Source Of Funds",
      type: "Relisted Reason",
      options: [
        "Incorrect source of funds",
        "Missing source of funds",
        "Unclear source of funds",
      ],
    },
    premium: {
      name: "premium",
      label: "Premium",
      type: "",
      options: [],
    },
  };

  return subsequent
    ? {
        subsequentPaymentMode: {
          name: "subsequentPaymentMode",
          label: "Subsequent Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect cheque",
            "Missing cheque",
            "Unclear cheque",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      }
    : {
        paymentMethod: {
          name: "paymentMethod",
          label: "Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect cheque",
            "Missing cheque",
            "Unclear cheque",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      };
};

export const getLabelsRtgs = (subsequent: boolean) => {
  const commonLabels = {
    sourceOfFunds: {
      name: "sourceOfFunds",
      label: "Source Of Funds",
      type: "Relisted Reason",
      options: [
        "Incorrect source of funds",
        "Missing source of funds",
        "Unclear source of funds",
      ],
    },
    premium: {
      name: "premium",
      label: "Premium",
      type: "",
      options: [],
    },
  };

  return subsequent
    ? {
        subsequentPaymentMode: {
          name: "subsequentPaymentMode",
          label: "Subsequent Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect Rtgs Form",
            "Missing Rtgs Form",
            "Unclear Rtgs Form",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      }
    : {
        paymentMethod: {
          name: "paymentMethod",
          label: "Payment Method",
          type: "Relisted Reason",
          options: [
            "Incorrect Rtgs Form",
            "Missing Rtgs Form",
            "Unclear Rtgs Form",
            "Tick mode of payment on application form",
          ],
        },
        ...commonLabels,
      };
};
