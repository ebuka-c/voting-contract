import { FormEvent, FormEventHandler, useMemo, useState } from "react";
import GenericModal from "./internal/util/GenericModal";
import { useAccount, useContract, useContractWrite, useWaitForTransaction } from "@starknet-react/core";
import { VotingAbi } from "../common/abis/votingAbi";
import { ContractAddress } from "../common/data";
import { CallData } from "starknet";
import Loading from "./internal/util/Loading";
import { useForm } from 'react-hook-form'

export default function AddNominee() {

    const togglePopover = ({ targetId }: { targetId: string }) => {
        const popover = document.getElementById(targetId);
        // @ts-ignore
        popover.togglePopover();
        if (popover) {
          popover.addEventListener("toggle", () => {
            if (popover.matches(":popover-open")) {
              document.body.style.overflow = "hidden";
            } else {
              document.body.style.overflow = "";
            }
          });
        }
    };

    const [candidateFirstname, setCandidateFirstName] = useState("")
    const [candidateLastname, setCandidateLastName] = useState("")

    const { address: user } = useAccount()

    const { contract } = useContract({
        abi: VotingAbi,
        address: ContractAddress
    })

    const calls = useMemo(() => {
        const isValid = user && contract && candidateFirstname.length > 0 && candidateLastname.length > 0;

        if (!isValid) return 

        return [contract.populate("nominate", CallData.compile([candidateFirstname, candidateLastname]))]
    }, [user, candidateFirstname, candidateLastname, contract])

    const { writeAsync, error, isError: writeIsError, isPending, data } = useContractWrite({
        calls
    })

    const { isError: nominationWaitIsError, data: nominationWaitData, isPending: nominationIsPending, isLoading: nominationWaitIsLoading  } = useWaitForTransaction({
        hash: data?.transaction_hash,
        watch: true
    })

    const nominateCandidate = async () => {
        console.log("Starting the nominate candidate function")
        try {
            await writeAsync();
            togglePopover({ targetId: "transaction-modal" })
        } catch (err) {
            console.error(err)
        }
    }


    const LoadingState = ({ message }: { message: any }) => {
        return (
            <span>
                {message}
                <Loading />
            </span>
        )
    }

    const buttonContent = () => {
        if (isPending) {
            return <LoadingState message={'Sending'} />
        }
        if (nominationWaitIsLoading) {
            return <LoadingState message={'Waiting for Confirmation'} />
        }
        if (nominationWaitData && nominationWaitData.isReverted()) {
            return <LoadingState message={'Transaction Reverted'} />
        }
        if (nominationWaitData && nominationWaitData.isRejected()) {
            return <LoadingState message={'Transaction Rejected'} />
        }
        if (nominationWaitData && nominationWaitData.isError()) {
            return <LoadingState message={'Unexpected error occured'} />
        }
        if (nominationWaitData) {
            return "Transaction Confirmed"
        }
        
        return "Nominate Student"
    }

    return ( 
        <form 
            action="" 
            className="px-16 py-8 border border-gray-200 rounded-lg"
            // onSubmit={}
        >
            
            <h2 className="text-xl">Add Nominee Form</h2>

            <div className="mt-5 flex flex-col gap-4 justify-center">
                <div className="flex flex-col gap-2">
                    <label htmlFor="" className="">
                        Candidate FirstName
                    </label>
                    <span className="border border-gray-500 rounded-md px-4 py-2">
                        <input 
                            type="text"
                            className="outline-none"
                            value={candidateFirstname}
                            onChange={(e) => {
                                setCandidateFirstName(e.target.value)
                            }}
                        />
                    </span>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="" className="">
                        Candidate LastName
                    </label>
                    <span className="border border-gray-500 rounded-md px-4 py-2">
                        <input 
                            type="text"
                            className="outline-none"
                            value={candidateLastname}
                            onChange={(e) => {
                                setCandidateLastName(e.target.value)
                            }}
                        />
                    </span>
                </div>
            </div>

            <div className="mt-5 w-[100%] mx-auto">
                <button 
                    className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                    type="submit"
                    onClick={(e) => {
                        e.preventDefault();
                        nominateCandidate()
                    }}
                >
                    {buttonContent()}
                    {/* Add Nominee */}
                </button>
            </div>
        </form>
    )
}