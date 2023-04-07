// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Verification {
    constructor() { owner = msg.sender; }
    uint16 public count_Exporters =0;
    uint16 public count_hashes=0;
    address public owner;

    struct  Record  {
        uint blockNumber; 
        uint minetime; 
        string info;
        string ipfs_hash;
         }
    struct Exporter_Record{
        uint blockNumber;
        string info;
         }
     mapping (bytes32  => Record) private docHashes;
     mapping (address => Exporter_Record) private Exporters;
     
//---------------------------------------------------------------------------------------------------------//
    modifier onlyOwner() {
            if (msg.sender != owner) {
            revert("Caller is not the owner"); }_; }

    modifier validAddress(address _addr) {
            assert(_addr != address(0)); _; }

   
    modifier authorised_Exporter(bytes32  _doc){

         if (keccak256(abi.encodePacked((Exporters[msg.sender].info )))!= keccak256(abi.encodePacked((docHashes[_doc].info))))
      
        revert("Caller is not  authorised to edit this document"); 
         _; }

    modifier canAddHash(){
        require(Exporters[msg.sender].blockNumber!=0,"Caller not authorised to add documents");   _; }

//---------------------------------------------------------------------------------------------------------//

    function add_Exporter(address _add,string calldata _info) external
    onlyOwner(){ 
        assert(Exporters[_add].blockNumber==0);
         
          Exporters[_add].blockNumber = block.number;
          Exporters[_add].info = _info;
          ++count_Exporters;
        
        }

    function delete_Exporter(address _add) external  
    onlyOwner
    {
        assert(Exporters[_add].blockNumber!=0);
        
        Exporters[_add].blockNumber=0;
        Exporters[_add].info="";
        --count_Exporters;
        }
        
   
}