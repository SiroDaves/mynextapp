"use client";
import { CapitalizeWords } from "@/lib/formating";
import { useProposalStore } from "@/state/proposal/proposal";
import { usePathname } from "next/navigation";
import { FC } from "react";

const NavbarContext: FC = () => {
  const pathname = usePathname();
  const { selectedProposal } = useProposalStore();

  const routes = {
    dashboard: "/dashboard",
    newApps: "/new-apps",
    relistedApps: "/relisted-apps",
    proposals: "/proposals",
    approved: "/approved",
    amlApps: "/aml-apps",
    accountsProfile: "/accounts/profile",
    users: "/users",
    medical: "/medical-underwriting",
    relisted: "/relisted",
    payments: "/unposted-payments",
  };

  const getTitle = () => {
    if (routes.dashboard && pathname.includes(routes.dashboard)) {
      return <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>;
    }

    if (routes.newApps && pathname.includes(routes.newApps + "s/")) {
      return (
        <h1 className="text-xl font-semibold text-gray-700">
          New Apps -{" "}
          {CapitalizeWords(
            selectedProposal?.firstName + " " + selectedProposal?.surname
          )}{" "}
          ({selectedProposal?.quoteNumber})
        </h1>
      );
    }

    if (routes.newApps && pathname.includes(routes.newApps)) {
      return <h1 className="text-xl font-semibold text-gray-700">New Apps</h1>;
    }

    if (routes.relistedApps && pathname.includes(routes.relistedApps)) {
      return (
        <h1 className="text-xl font-semibold text-gray-700">Relisted Apps</h1>
      );
    }

    if (routes.proposals && pathname.includes(routes.proposals)) {
      return <h1 className="text-xl font-semibold text-gray-700">Proposals</h1>;
    }

    if (routes.approved && pathname.includes(routes.approved)) {
      return <h1 className="text-xl font-semibold text-gray-700">Approved</h1>;
    }

    if (routes.amlApps && pathname.includes(routes.amlApps)) {
      return (
        <h1 className="text-xl font-semibold text-gray-700">
          Proposals - AML Apps
        </h1>
      );
    }

    if (routes.accountsProfile && pathname.includes(routes.accountsProfile)) {
      return <h1 className="text-xl font-semibold text-gray-700">Accounts</h1>;
    }
    if (routes.amlApps && pathname.includes(routes.amlApps)) {
      return (
        <h1 className="text-xl font-semibold text-gray-700">
          Proposals - AML Apps
        </h1>
      );
    }
    if (routes.users && pathname.includes(routes.users)) {
      return <h1 className="text-xl font-semibold text-gray-700">Users</h1>;
    }

    if (routes.medical && pathname.includes(routes.medical)) {
      return (
        <h1 className="text-xl font-semibold text-gray-700">Medical U/W</h1>
      );
    }

    if (routes.relisted && pathname.includes(routes.relisted)) {
      return (
        <h1 className="text-xl font-semibold text-gray-700">Relisted Apps</h1>
      );
    }

    if (routes.payments && pathname.includes(routes.payments)) {
      return <h1 className="text-xl font-semibold text-gray-700">Payments</h1>;
    }

    return null;
  };

  return <>{getTitle()}</>;
};

export default NavbarContext;
