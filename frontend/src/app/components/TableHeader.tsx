import { useAccount } from "@starknet-react/core";
import AddressBar from "./lib/AddressBar";
import ConnectButton from "./lib/Connect";

export default function TableHeader({candidates}: {
    candidates: Record<string, any>[]
}){

    const { address } = useAccount();

    return (
        <div>
            <div className="w-full flex justify-between">
                            <p className="text-black text-xl font-semibold">
                                Vote Dashboard
                            </p>
                            {address ? <AddressBar /> : <ConnectButton />}
                        </div>
            
                        <div className="w-full flex mt-10 justify-between items-center">
                            <p>
                                <span className="font-bold text-l">Candidates: </span> {candidates?.length} Total
                            </p>
                            <div className="">
                                <input 
                                    type="text" 
                                    placeholder="Search by name" 
                                    className="outline-none bg-gray-200 px-10 py-5 text-black rounded-full"
                                />
                            </div>
                        </div>
            
        </div>
    )
}