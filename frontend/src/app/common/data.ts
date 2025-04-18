import { StartElection, RemoveVote, EndElection, CountVotes } from "../components/icons";

export const ContractAddress = "0x057dc5586a2943b76b5f0b034213386fe35d0f125437e25f1a3553d0ef27ec74"

// contract with the voting error = 0x05e24a19845e7b6561ee367becc293a34f860a0cea0935cf1e319876f1aa9466

// former contract address = 0x05aad61513ecb1f15f35df49bfdbb937b0a33d0eda278f880198e5db37418537

export const SideBarOptions = [
    {
        id: 1,
        label: 'Start Election',
        icon: StartElection,
    },
    {
        id: 2,
        label: 'Suspend Election',
        icon: RemoveVote,
    },
    // {
    //     id: 3,
    //     label: 'Cast Vote',
    //     icon: CastVote,
    // },
    // {
    //     id: 4,
    //     label: 'Remove Vote',
    //     icon: RemoveVote,
    // },
    {
        id: 5,
        label: 'End Election',
        icon: EndElection,
    },
    {
        id: 6,
        label: 'Count Votes',
        icon: CountVotes
    }
]

export const Candidates = [
    {
        id: 1,
        surname: "Yamal",
        firstname: "Lamine",
        noOfVotes: 6,
        qualified: true,
    },
    {
        id: 2,
        surname: "Ethan",
        firstname: "Nwaneri",
        noOfVotes: 4,
        qualified: true,
    },
    {
        id: 3,
        surname: "Fermin",
        firstname: "Lopez",
        noOfVotes: 1,
        qualified: false,
    },
    {
        id: 4,
        surname: "Vinicius",
        firstname: "Jr",
        noOfVotes: 9,
        qualified: false,
    },
    {
        id: 5,
        surname: "Florian",
        firstname: "Wirtz",
        noOfVotes: 12,
        qualified: true,
    },
    {
        id: 6,
        surname: "Florian",
        firstname: "Wirtz",
        noOfVotes: 12,
        qualified: true,
    },
]