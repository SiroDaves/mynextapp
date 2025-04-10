"use client";
import { DashboardCard } from "@/components/app/dashboard/dashboard-card";
import { useDashboardStore } from "@/state/dashboard/dashboard";
import {
  GlobeLockIcon,
  HospitalIcon,
  ListChecksIcon,
  ListPlusIcon,
  ListXIcon,
} from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Dashboard() {
  const { proposalSummary, loading, fetchProposalSummary } =
    useDashboardStore();

  useEffect(() => {
    try {
      const fetchProposalSummaryAsync = async () =>
        await fetchProposalSummary();
      fetchProposalSummaryAsync();
    } catch (error: any) {
      toast.error(error.message);
    }
  }, []);

  if (loading) {
    return (
      <Skeleton count={20} height={20} baseColor="#EEEEEE" highlightColor="#0077BE"/>
    );
  }

  return (
    <div>
      <section className="bg-white px-5 rounded-xl py-4 px">
        <div className="mb-6">
          <h2 className="font-semibold">Proposals</h2>
          <h3 className="text-secondary text-sm">Proposal Summary</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-3">
          <div className="col-span-3 grid md:grid-cols-2 gap-10">
            <DashboardCard
              Icon={() => <ListPlusIcon className="h-10 w-10" />}
              title="New Apps - Pending Review"
              underTimeTitle="Under 2 Hours"
              underTime={proposalSummary?.newUnder2Hours}
              overTimeTitle="Over 2 Hours"
              overTime={proposalSummary?.newOver2Hours}
              total={proposalSummary?.newTotal}
            />
            <DashboardCard
              Icon={() => <ListChecksIcon className="h-10 w-10" />}
              title="Relisted Apps - Pending Review"
              underTimeTitle="Under 2 Hours"
              underTime={proposalSummary?.relistedPendingReviewUnder2Hours}
              overTimeTitle="Over 2 Hours"
              overTime={proposalSummary?.relistedPendingReviewOver2Hours}
              total={proposalSummary?.relistedPendingReviewTotal}
            />
          </div>
          <DashboardCard
            Icon={() => <HospitalIcon className="h-10 w-10" />}
            title="Medical U/W - Pending Review"
            underTimeTitle="Under 7 Days"
            underTime={proposalSummary?.medicalUnder7Days}
            overTimeTitle="Over 7 Days"
            overTime={proposalSummary?.medicalOver7Days}
            total={proposalSummary?.medicalTotal}
          />
          <DashboardCard
            Icon={() => <ListXIcon className="h-10 w-10" />}
            title="Relisted Apps - Pending FA Action"
            underTimeTitle="Under 7 Days"
            underTime={proposalSummary?.relistedPendingFAUnder7Days}
            overTimeTitle="Over 7 Days"
            overTime={proposalSummary?.relistedPendingFAOver7Days}
            total={proposalSummary?.relistedPendingFATotal}
          />
          <DashboardCard
            Icon={() => <GlobeLockIcon className="h-10 w-10" />}
            title="AML Apps - Pending Review"
            underTimeTitle="Under 7 Days"
            underTime={proposalSummary?.amlUnder7Days}
            overTimeTitle="Over 7 Days"
            overTime={proposalSummary?.amlOver7Days}
            total={proposalSummary?.amlTotal}
          />
        </div>
      </section>
    </div>
  );
}
