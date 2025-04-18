use starknet::{ContractAddress, contract_address_const, ClassHash};
use snforge_std::{
    declare, ContractClassTrait, start_cheat_caller_address, stop_cheat_caller_address,
    test_address, get_class_hash, DeclareResultTrait
};
use contracts::{IVotingTraitDispatcher, IVotingTraitDispatcherTrait};
use contracts::{Candidate, ElectionStatus};

fn __setup__() -> (IVotingTraitDispatcher, ContractAddress) {
    _deploy_Public_Profile__()
}

fn _deploy_Public_Profile__() -> (IVotingTraitDispatcher, ContractAddress) {
    let contract = declare("VotingContract").unwrap().contract_class();
    let owner: ContractAddress = contract_address_const::<'owner'>();
    let seller_count: u64 = 0;
    let constructor_calldata = array![seller_count.into(), owner.into()];
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    let dispatcher = IVotingTraitDispatcher { contract_address };
    (dispatcher, contract_address)
}