import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { felt252ToString } from "./internal/helpers";
import { useAccount, useContract, useContractWrite, useWaitForTransaction } from "@starknet-react/core";
import { VotingAbi } from "../common/abis/votingAbi";
import { ContractAddress } from "../common/data";
import { useMemo } from "react";
import { CallData } from "starknet";

export default function TableRow({ candidate, index }: {
    candidate: Record<any, any>,
    index: number
}){
    const fname = felt252ToString(candidate?.fname);
    const lname = felt252ToString(candidate?.lname);
    const noOfVotes = Number(BigInt(candidate?.no_of_votes));

    console.log(candidate?.id)

    const { address: user } = useAccount()

    const { contract } = useContract({
        abi: VotingAbi,
        address: ContractAddress
    })

    const vote_calls = useMemo(() => {
        const isValid = user && contract;

        if (!isValid) return

        return [contract.populate("cast_vote", [candidate?.id])]
    }, [user, contract])
    const unvote_calls = useMemo(() => {
        const isValid = user && contract;

        if (!isValid) return

        return [contract.populate("uncast_vote", [candidate?.id])]
    }, [user, contract])

    const { writeAsync, isPending, data } = useContractWrite({
       calls: vote_calls
    });


    const { writeAsync: writeUnvoteAsync, isPending: unvotePending, data: unvoteData } = useContractWrite({
        calls: unvote_calls
    });
     //disqualify call
     const disqualifyCalls = useMemo(() => {
        if (!user || !contract) return;
        return [contract.populate("disqualify_candidate", [candidate?.id])];
    }, [user, contract, candidate?.id]);
    
    const { writeAsync: disqualifyWriteAsync, isPending: isDisqualifying, data: disqualifyDataRaw } = useContractWrite({
        calls: disqualifyCalls
    });

    const voteCandidate = async () => {
        console.log("Preparing to vote candidate")
        try {
            await writeAsync();
        } catch(err) {
            console.error(err);
        }
    }
    const unvoteCandidate = async () => {
        console.log("Preparing to unvote candidate");
        try {
            await writeUnvoteAsync();
        } catch(err) {
            console.error(err);
        }
    };
    const disqualifyCandidate = async () => {
        try {
            await disqualifyWriteAsync();
        } catch (err) {
            console.error("Disqualify Error:", err);
        }
    };
    
    const { 
        isLoading: voteIsLoading, 

        data: voteData
     } = useWaitForTransaction({
        hash: data?.transaction_hash,
        watch: true
    })

    const { 
        isLoading: unvoteIsLoading, 
        data: unvoteTxData
    } = useWaitForTransaction({
        hash: unvoteData?.transaction_hash,
        watch: true
    })
    const { isLoading: disqualifyIsLoading, data: disqualifyData } = useWaitForTransaction({
        hash: disqualifyDataRaw?.transaction_hash,
        watch: true
    });
    const unvotingButtonContent = () => {
        if (unvotePending) return 'Unvoting...';
        if (unvoteIsLoading) return 'Waiting...';
        if (unvoteTxData?.isReverted?.()) return 'Reverted';
        if (unvoteTxData?.isRejected?.()) return 'Rejected';
        if (unvoteTxData?.isError?.()) return 'Error';
        if (unvoteTxData) return 'Confirmed';
        return 'Unvote';
    };
    const disqualifyButtonContent = () => {
        if (isDisqualifying) return 'Disqualifying...';
        if (disqualifyIsLoading) return 'Waiting...';
        if (disqualifyData?.isReverted?.()) return 'Reverted';
        if (disqualifyData?.isRejected?.()) return 'Rejected';
        if (disqualifyData?.isError?.()) return 'Error';
        if (disqualifyData) return 'Confirmed';
        return 'Disqualify';
    };

    const votingButtonContent = () => {
        if (isPending) {
            return 'Voting...'
        }
        if (voteIsLoading) {
            return 'Waiting...'
        }
        if (voteData && voteData.isReverted()) {
            return 'Reverted'
        }
        if (voteData && voteData.isRejected()) {
            return 'Rejected'
        }
        if (voteData && voteData.isError()) {
            return 'Error'
        }
        if (voteData) {
            return "Confirmed"
        }
        
        return "Vote"
    }

    return (
        <tr>
            <td className="py-4 px-4">{candidate?.id}</td>
            <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">{lname}</td>
            <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">{fname}</td>
            <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">{noOfVotes}</td>
            <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">
                {
                    candidate?.qualified? 
                        <div className="rounded-full bg-green-500 text-white w-fit px-1 py-1">
                            <FaCheck />
                        </div> 
                        :
                        <div className="rounded-full bg-red-500 text-white w-fit px-1 py-1">
                            <FaXmark />
                        </div>
                    }
                
            </td>
            <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap flex gap-4">
                <button 
                    className="bg-blue-400 rounded-md text-white font-extrabold px-4 py-2 flex items-center gap-1"
                    onClick={(e) => {
                        e.preventDefault();
                        voteCandidate();
                    }}
                >
                    <span>&#8593;</span>
                    <span className="font-light" >{votingButtonContent()}</span>
                </button>
                <button 
    className={`bg-blue-400 rounded-md text-white font-extrabold px-4 py-2 flex items-center gap-1 ${unvotePending ? "opacity-50 cursor-not-allowed" : ""}`}
    disabled={unvotePending || unvoteIsLoading}
    onClick={(e) => {
        e.preventDefault();
        unvoteCandidate();
    }}
>
    <span>&#8595;</span>
    <span className="font-light">{unvotingButtonContent()}</span>
</button>


            </td>
            <td className="py-4 px-4 capitalize tracking-wider whitespace-nowrap">
             <button 
         className="bg-red-500 text-white rounded-md px-4 py-2 font-semibold disabled:bg-red-300"
         onClick={(e) => {
             e.preventDefault();
             disqualifyCandidate();
         }}
         disabled={isDisqualifying || disqualifyIsLoading}
     >
         {disqualifyButtonContent()}
     </button>
             </td>
        </tr>
    )
}