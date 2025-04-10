import { getApi } from "@/lib/api";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProposalState {
  proposalSummary: any;
  loading: boolean;
  proposalModal: boolean;

  toggleProposalModal: (payload: any) => void;
  fetchProposalSummary: (status?: string, pagination?: any) => void;
}

export const useDashboardStore = create<ProposalState>()(
  persist(
    (set) => ({
      proposalSummary: {},
      proposalModal: false,
      loading: false,

      // actions
      toggleProposalModal: (payload) => {
        set({ proposalModal: payload });
      },
      fetchProposalSummary: async (status, pagination = {}) => {
        set({ loading: true });
        try {
          const response = await getApi("dashboard").get(
            `/api/v1/proposal/summary`,
            {
              params: { ...pagination, status },
            }
          );
          set({
            proposalSummary: response.data,
            loading: false,
          });
        } catch (error: any) {
          set({
            loading: false,
          });
        }
      },
    }),
    {
      name: "my-app:dashboard",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ proposalSummary: state.proposalSummary }),
    }
  )
);
