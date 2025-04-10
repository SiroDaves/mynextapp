import { getApi } from "@/lib/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PaymentState {
  unpostedPayments: any[];
  selectedPayment: any | null;
  loading: boolean;
  paymentModals: any;

  togglePaymentModal: (payload: any) => void;
  updateSelectedPayment: (payload: any) => void;
  fetchUnpostedPayments: () => Promise<any>;
  sendPayment: (quoteId: string, paymentId: string) => Promise<any>;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      unpostedPayments: [],
      selectedPayment: null,
      loading: false,
      paymentModals: {
        showDetails: false,
        postPayment: false,
      },

      togglePaymentModal: (payload) => {
        set((state) => ({
          paymentModals: {
            ...state.paymentModals,
            ...payload,
          },
        }));
      },
      updateSelectedPayment: (payload) => {
        set({ selectedPayment: payload });
      },
      fetchUnpostedPayments: async () => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").get(
              `/api/v1/quote/unposted-payments`
            );
            set({
              unpostedPayments: response.data,
              loading: false,
            });
            return resolve(response);
          } catch (error: any) {
            set({
              loading: false,
              unpostedPayments: [],
            });
            return reject(error);
          }
        });
      },
      sendPayment: async (quoteId: string, paymentId: string) => {
        set({ loading: true });
        return new Promise(async (resolve, reject) => {
          try {
            const response = await getApi("cis").post(
              `/api/v1/quote/${quoteId}/payments/${paymentId}/post`
            );
            set((state) => ({
              unpostedPayments: state.unpostedPayments.map((payment: any) =>
                payment.id === response.data.id ? response.data : payment
              ),
              loading: false,
            }));
            return resolve(response);
          } catch (error: any) {
            set({ loading: false });
            return reject(error);
          }
        });
      },
    }),

    {
      name: "my-app:payment",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        selectedPayment: state.selectedPayment,
        unpostedPayments: state.unpostedPayments,
      }),
    }
  )
);
