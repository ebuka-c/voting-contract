export const VotingAbi = [
  {
    "type": "impl",
    "name": "VotingContractImpl",
    "interface_name": "contracts::IVotingTrait"
  },
  {
    "type": "struct",
    "name": "contracts::CandidateInput",
    "members": [
      {
        "name": "fname",
        "type": "core::felt252"
      },
      {
        "name": "lname",
        "type": "core::felt252"
      }
    ]
  },
  {
    "type": "struct",
    "name": "core::integer::u256",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "type": "enum",
    "name": "core::bool",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "type": "struct",
    "name": "contracts::Candidate",
    "members": [
      {
        "name": "id",
        "type": "core::integer::u256"
      },
      {
        "name": "index",
        "type": "core::integer::u256"
      },
      {
        "name": "fname",
        "type": "core::felt252"
      },
      {
        "name": "lname",
        "type": "core::felt252"
      },
      {
        "name": "no_of_votes",
        "type": "core::integer::u256"
      },
      {
        "name": "qualified",
        "type": "core::bool"
      }
    ]
  },
  {
    "type": "interface",
    "name": "contracts::IVotingTrait",
    "items": [
      {
        "type": "function",
        "name": "nominate",
        "inputs": [
          {
            "name": "candidate_fname",
            "type": "core::felt252"
          },
          {
            "name": "candidate_lname",
            "type": "core::felt252"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "batch_nominate",
        "inputs": [
          {
            "name": "candidates_data",
            "type": "core::array::Array::<contracts::CandidateInput>"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "start_election",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "cast_vote",
        "inputs": [
          {
            "name": "candidate_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "uncast_vote",
        "inputs": [
          {
            "name": "candidate_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "get_all_candidates",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<contracts::Candidate>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "get_candidate",
        "inputs": [
          {
            "name": "candidate_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "(core::felt252, core::felt252)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "disqualify_candidate",
        "inputs": [
          {
            "name": "candidate_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "suspend_election",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "type": "function",
        "name": "count_votes",
        "inputs": [],
        "outputs": [
          {
            "type": "(core::integer::u256, core::integer::u256, contracts::Candidate)"
          }
        ],
        "state_mutability": "view"
      },
      {
        "type": "function",
        "name": "end_election",
        "inputs": [],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "type": "constructor",
    "name": "constructor",
    "inputs": [
      {
        "name": "owner",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "type": "event",
    "name": "contracts::VotingContract::Event",
    "kind": "enum",
    "variants": []
  }
]