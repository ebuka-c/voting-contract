import React, { useMemo } from "react"
import { CastVote, CountVotes, EndElection, NominateCandidate, RemoveVote, StarknetSvg, StartElection } from "./icons"
import { clsx } from 'clsx'
import { ContractAddress, SideBarOptions } from "../common/data"
import { useAccount, useContract, useContractWrite, useWaitForTransaction } from "@starknet-react/core"
import { VotingAbi } from "../common/abis/votingAbi"
import { CallData } from "starknet"
import Loading from "./internal/util/Loading"

export const Sidebar: React.FC<{ classname?: string }> = ({ classname }) => {

    const { address: user } = useAccount();

    const { contract } = useContract({
        abi: VotingAbi,
        address: ContractAddress
    })

    const calls = useMemo(() => {
        const isValid = user && contract

        if (!isValid) return

        return [contract.populate("start_election", CallData.compile([]))]
    }, [user, contract])

    const { writeAsync, isPending, data } = useContractWrite({
        calls
    })

    const { 
        isLoading: startElectionIsLoading, 
        isPending: startElectionIsPending,
        isError: startElectionIsError,
        isSuccess: startElectionIsSuccess,
        data: startElectionData
     } = useWaitForTransaction({
        hash: data?.transaction_hash,
        watch: true
    })

    const startElection = async () => {
        console.log("Preparing to start election")
        try {
            await writeAsync();
        } catch (err) {
            console.error(err);
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

    const buttonContent = (message: string) => {
        if (isPending) {
            return <LoadingState message={'Sending'} />
        }
        if (startElectionIsLoading) {
            return <LoadingState message={'Waiting for Confirmation'} />
        }
        if (startElectionData && startElectionData.isReverted()) {
            return <LoadingState message={'Transaction Reverted'} />
        }
        if (startElectionData && startElectionData.isRejected()) {
            return <LoadingState message={'Transaction Rejected'} />
        }
        if (startElectionData && startElectionData.isError()) {
            return <LoadingState message={'Unexpected error occured'} />
        }
        if (startElectionData) {
            return "Transaction Confirmed"
        }
        
        return message
    }

    return (
        <div
            className={clsx("py-10 px-10 text-white text-l bg-[#0009ab] h-full flex flex-col gap-40")}
        >
            <div>
                <StarknetSvg />
            </div>
            
            <div className="flex flex-col justify-center gap-6 mt-10">
                {
                    SideBarOptions.map((opt, i) => {
                        const Icon = opt.icon
                        return (
                            <div
                                role="button" 
                                key={opt.id} 
                                className="flex justify-normal gap-2 items-center hover:bg-blue-400 hover:text-[#0009ab] px-4 py-2 rounded-md"
                                onClick={() => {
                                    i == 0 ? startElection() : null
                                }}
                            >
                                {Icon}
                                <span>{buttonContent(opt.label)}</span>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}