
//mainnet
//tokenContractAddress=""
//airdropContractAddress=""

//testnet
//0xEfA85A029fcaA1Ec462019998A7B537b686BfF34
//tokenContractAddress="0xc258c7e80E9e441f69fc3d25582c0B577b8df0ba"
airdropContractAddress="0x69b0e7dE2819307CeB366B4032547Abea0df499A"//"0x0DC282E46Bf1A7b3Eec97ba77b05F308C68D851e"//"0xacd98510386cA008133D8Ac230990D4c15F7edc6"
//"0x297FBB0688945d15Be3Eed8df08D34b8780D5a63"//
setup()
function setup(){
  window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      console.log('interface starting modern')
      window.web3 = new Web3(ethereum);
      try {
        // Request account access if needed
        await ethereum.enable();
        // Acccounts now exposed
        web3.eth.sendTransaction({/* ... */});
      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('legacydapp')
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
      web3.eth.sendTransaction({/* ... */});
    }
    // Non-dapp browsers...
    else {
      alert('please ensure https://metamask.io/ is installed and connected ')
      web3 = new Web3('wss://ropsten.infura.io/ws');
      //web3 = new Web3('wss://mainnet.infura.io/ws');
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    web3.eth.net.getId().then(function(nid){
      window.netId=nid;
			console.log('netid ',window.netId)
    })
		console.log('should be checking network')
    web3.eth.net.getNetworkType().then(function(ntype){
      console.log('network ',ntype)
      //if(ntype!='main'){
      if(ntype!='rinkeby'){
        alert('please switch to rinkeby in Metamask')
        //alert('please switch to mainnet in Metamask')
      }
    })
		//window.tokenContract=new web3.eth.Contract(tokenAbi,tokenContractAddress)
    window.airdropContract=new web3.eth.Contract(airdropAbi,airdropContractAddress)
		window.main()
  });
}
