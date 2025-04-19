'use client'

import { useState, useMemo } from "react";
import GenericModal from "./internal/util/GenericModal";
import { useAccount, useContract, useContractWrite, useWaitForTransaction } from "@starknet-react/core";
import { VotingAbi } from "../common/abis/votingAbi";
import { ContractAddress } from "../common/data";
import { CallData } from "starknet";
import Loading from "./internal/util/Loading";

interface Candidate {
  fname: string;
  lname: string;
}

export default function BatchNominee() {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { fname: "", lname: "" },
  ]);

  const { address: user } = useAccount();

  const { contract } = useContract({
    abi: VotingAbi,
    address: ContractAddress,
  });

  const calls = useMemo(() => {
    if (!user || !contract) return;

    const validCandidates = candidates.filter(
      (c) => c.fname.trim() && c.lname.trim()
    );

    if (validCandidates.length === 0) return;

    return validCandidates.map((candidate) =>
      contract.populate("nominate", CallData.compile([candidate.fname, candidate.lname]))
    );
  }, [user, contract, candidates]);

  const { writeAsync, data, isPending } = useContractWrite({ calls });

  const {
    isLoading: nominationWaitIsLoading,
    data: nominationWaitData,
  } = useWaitForTransaction({
    hash: data?.transaction_hash,
    watch: true,
  });

  const handleAddCandidate = () => {
    setCandidates([...candidates, { fname: "", lname: "" }]);
  };

  const handleRemoveCandidate = (index: number) => {
    const updated = candidates.filter((_, i) => i !== index);
    setCandidates(updated);
  };

  const handleInputChange = (index: number, field: keyof Candidate, value: string) => {
    const updated = [...candidates];
    updated[index][field] = value;
    setCandidates(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!calls || calls.length === 0) return;

    try {
      await writeAsync();
      document.getElementById("transaction-modal")?.showPopover?.();
    } catch (err) {
      console.error(err);
    }
  };

  const LoadingState = ({ message }: { message: string }) => (
    <span className="flex gap-2 items-center">{message} <Loading /></span>
  );

  const buttonContent = () => {
    if (isPending) return <LoadingState message="Sending" />;
    if (nominationWaitIsLoading) return <LoadingState message="Waiting for Confirmation" />;
    if (nominationWaitData?.isReverted()) return "Transaction Reverted";
    if (nominationWaitData?.isRejected()) return "Transaction Rejected";
    if (nominationWaitData?.isError()) return "Unexpected Error";
    if (nominationWaitData) return "Transaction Confirmed";

    return "Submit Batch Nominees";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-16 py-8 border border-gray-200 rounded-lg space-y-6"
    >
      <h2 className="text-xl font-semibold">Batch Nominee Form</h2>

      {candidates.map((candidate, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <input
            type="text"
            placeholder="First Name"
            value={candidate.fname}
            onChange={(e) => handleInputChange(index, "fname", e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={candidate.lname}
            onChange={(e) => handleInputChange(index, "lname", e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded w-full"
            required
          />
          {index > 0 && (
            <button
              type="button"
              onClick={() => handleRemoveCandidate(index)}
              className="text-red-500 font-bold"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <div className="flex justify-between items-center gap-4">
        <button
          type="button"
          onClick={handleAddCandidate}
          className="bg-gray-200 text-sm px-4 py-2 rounded hover:bg-gray-300"
        >
          + Add Another Candidate
        </button>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {buttonContent()}
        </button>
      </div>
    </form>
  );
}
