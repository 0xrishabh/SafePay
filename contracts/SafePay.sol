pragma solidity ^0.8.9;

/*
    Remix Testing 
    0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5,0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5,0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48,10,100,Hello

    Remix Testing works (`claim` function is yet to be tested)
 */

contract Enum {
    enum Operation {Call, DelegateCall}
}
interface GnosisSafe{
	function execTransactionFromModuleReturnData(
        address to,
        uint256 value,
        bytes calldata data,
        Enum.Operation operation
	) external virtual returns (bool success, bytes memory returnData);
}

contract SafePay{

	struct Payment{
		address payer;
		address reciever;
		address token;
		uint256 amount;
		uint256 timePeriod;
		string message;

		// chaging values
		uint256 nextPayment;
		bool approved;
		bool isNew;
	}

	mapping(address => bytes32[]) public safePayments;
	mapping(bytes32 => Payment) public paymentRequests;

	event RequestSubscribtion(
        address payer,
		address reciever,
        address token,
		uint256 amount,
		uint256 timePeriod,
		string name
	);
	event Subscribe(
		address reciever,
		uint256 timePeriod,
		uint256 amount,
		string name
	);

	event UnSubscribe(
		address reciever,
		uint256 timePeriod,
		uint256 amount,
		string name
	);


	constructor() {}

	function createRequest(
		address payer,
		address reciever,
		address token,
		uint256 amount,
		uint256 timePeriod, 
		string memory message
	) public returns(bytes32 id){ 
		uint256 nounce = safePayments[reciever].length;
		id = getId(payer, reciever, token, amount, timePeriod, message, nounce);
		Payment memory paymentRequest = Payment(
			payer, // payer
			reciever, // reciever
			token, // token
			amount, // amount
			timePeriod, // timePeriod
			message, // message
			0, // nextPayment
			false, // isApproved
			true // isNew
		);

		safePayments[payer].push(id);
		safePayments[reciever].push(id);

		paymentRequests[id] = paymentRequest;

		emit RequestSubscribtion(
            payer,
			reciever,
            token,
            amount,
			timePeriod,
			message
		);
	}

	function claim(bytes32 id) public{
		
		/*
			Get the Subscribtion data from the id
			Then check on basis of previous payemnt timstamp that if the payment is legit
			Then call the token transfer function 
		 */
		Payment memory paymentRequest = paymentRequests[id];
		require(isAuthorized(id), "Not Authorized");
		require(
			paymentRequest.nextPayment <= block.timestamp,
			"There is still time remaining for the claim"
		);

		if(paymentRequest.token == address(0)){
			GnosisSafe(paymentRequest.payer).execTransactionFromModuleReturnData(
				paymentRequest.reciever,
				0,
				"",
				Enum.Operation.Call
			);
		}else{
			GnosisSafe(paymentRequest.payer).execTransactionFromModuleReturnData(
				paymentRequest.token,
				0,
				abi.encodeWithSelector(bytes4(keccak256("transfer(address,uint256)")), paymentRequest.reciever, paymentRequest.amount),
				Enum.Operation.Call
			);
		}
		paymentRequests[id].nextPayment += paymentRequest.timePeriod;
		if(paymentRequest.timePeriod == 0){
			paymentRequests[id].approved = false;
		}
	}

	function acceptRequest(bytes32 id) public {
        // Only the payer should be able to accept or reject the Request
		Payment memory paymentRequest = paymentRequests[id];
		require(paymentRequest.payer == msg.sender, "Only Payer can Authorize Transaction");
		paymentRequests[id].approved = true;
		paymentRequests[id].isNew = false;
	}

	function cancelRequest(bytes32 id) public {
		Payment memory paymentRequest = paymentRequests[id];
		require(paymentRequest.payer == msg.sender, "Only Payer can Authorize Transaction");
		paymentRequests[id].approved = false;
		
		emit UnSubscribe(
			paymentRequest.reciever,
			paymentRequest.timePeriod,
			paymentRequest.amount,
			paymentRequest.message
		);
	}

	function isAuthorized(bytes32 id) public view returns(bool isAllowed){
		isAllowed = paymentRequests[id].approved;
	}

	function getPaymentsId(address _addr) view public returns(bytes32[] memory){
		return safePayments[_addr];
	}
	function getPayments(bytes32 id) view public returns(Payment memory){
		return paymentRequests[id];
	}
	function getId(
		address payer,
		address reciever,
		address token,
		uint256 amount,
		uint256 timePeriod, 
		string memory message,
        uint256 nonce
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(
			payer,
			reciever, 
			token,
			amount,
			timePeriod, 
			message,
            nonce
		));
    }
}
