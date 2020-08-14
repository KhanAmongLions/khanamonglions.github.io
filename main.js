var DEBUG=true

var startTime=0
var tokenDecimals=0

function main(){
    if(DEBUG){console.log('test')}
    refreshData()
    window.setInterval('refreshData()',2500)

    //controlLoopFaster()
}
function controlLoopFaster(){
    //put faster update stuff here
    refreshTimers()
    setTimeout(controlLoopFaster,30)
}
function refreshData(){
  console.log('refreshdata called')
  //document.getElementById('buyButton').onclick=buy2;
  document.getElementById('approveButton').onclick=approve2;
  document.getElementById('distribute').onclick=distribute2;

  web3.eth.getAccounts(function (err, accounts) {
    let addr=accounts[0]
    oldEthAddress=addr
    tokenContractAddress=document.getElementById('tokenAddress').value
    if(tokenContractAddress){
      window.tokenContract=new web3.eth.Contract(tokenAbi,tokenContractAddress)
      tokenContract.methods.decimals().call().then(function(decimals){
        tokenDecimals=decimals;
        document.getElementById('tokenDecimals').textContent=decimals
        tokenContract.methods.balanceOf(addr).call().then(function(bal){
          document.getElementById('tokenBalance').textContent=parseFloat((bal/(10**decimals)).toFixed(3)).toLocaleString()
        })
        tokenContract.methods.name().call().then(function(name){
          document.getElementById('tokenName').textContent=name;
        })
      })
    }
    //processRecentEvents()
    //updateReflink()
  })
}
function addToList(listid,content){
  var list = document.getElementById(listid);
  var entry = document.createElement('li');
  entry.appendChild(document.createTextNode(content));
  list.appendChild(entry);
}
MAX_LIST_ELEMENTS=7
lastevent=null
//web3.eth.getBlock()
function processRecentEvents(){
  web3.eth.getAccounts(function (err, accounts) {
    web3.eth.getBlockNumber().then(function(bnum){
      tokenContract.getPastEvents("Transfer",{ fromBlock: (bnum-20000)+'', toBlock: 'latest' },function(error,events){
        events=events.reverse()
        $("#recentrewards").empty()
        $("#yourrecentrewards").empty()
        var count=0
        var usercount=0
        events.forEach(function(eventResult){
          //web3.eth.getBlock(eventResult.blockNumber).then(function(block){
            lastevent=eventResult
            if (error){
              console.log('Error in myEvent event handler: ' + error);
            }
            else if(count<MAX_LIST_ELEMENTS){
              //console.log('myEvent: ' + JSON.stringify(eventResult.returnValues));
              var timedisplay=""//new Date(1000*block.timestamp)
              addToList('recentrewards',weiToDisplay(eventResult.returnValues._value)+" "+eventResult.returnValues._addr+" "+timedisplay)
              count++
              if(usercount<MAX_LIST_ELEMENTS && eventResult.returnValues._addr==accounts[0]){
                //console.log('found user payout event ')
                addToList('yourrecentrewards',weiToDisplay(eventResult.returnValues._value)+" "+timedisplay)
                usercount++
              }
            }
          //})
        })
      });
    })
  })
}
function refreshTimers(){
  var nowtime=new Date().getTime()/1000
  setTimerFromSeconds(Number(startTime)-nowtime)
  // if(nowtime>startTime){
  // }
  // else{
  //
  // }
}
function disableButton(buttonId){
  //console.log('placeholder, button disabled ',buttonId)
  document.getElementById(buttonId).disabled=true
}
function enableButton(buttonId){
  //console.log('placeholder, button enabled ',buttonId)
  document.getElementById(buttonId).disabled=false
}
function setTimerFromSeconds(seconds){
  //console.log('secondssettimer ',seconds)
  if(seconds<0){
    seconds=86400
  }
  var days        = 0//Math.floor(seconds/24/60/60);
  var hoursLeft   = Math.floor((seconds))// - (days*86400));
  var hours       = Math.floor(hoursLeft/3600);
  var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
  var minutes     = Math.floor(minutesLeft/60);
  var remainingSeconds = seconds % 60;
  setTimer(days,hours,minutes,remainingSeconds)
}
function setTimer(days,hours,minutes,seconds){
  //console.log('settimer ',days,hours,minutes,seconds)
  //document.getElementById('days').textContent=days

  document.getElementById('hours').textContent=hours
  document.getElementById('minutes').textContent=minutes
  document.getElementById('seconds').textContent=seconds.toFixed(2)
}
function weiToDisplay(wei){
    return formatEthValue(web3.utils.fromWei(wei,'ether'))
}
function formatEthValue(ethstr){
    return parseFloat(parseFloat(ethstr).toFixed(2));
}
/*
  ApproveAndCall example
*/
/*
function buy2(){
  if(DEBUG){console.log('buy2')}
  let tospend=document.getElementById('buyamount').value
  if(Number(tospend)>0){
      web3.eth.getAccounts(function (err, accounts) {
        address=accounts[0]
        console.log('buy ',lotteryAddress,web3.utils.toWei(tospend,'ether'),address)
        tokenContract.methods.approveAndCall(lotteryAddress,web3.utils.toWei(tospend,'ether'),'0x0000000000000000000000000000000000000000').send({from:address}).then(function(err,result){
          if(DEBUG){console.log('buy')}
        })
      })
  }
}
*/
function approve2(){
  if(DEBUG){console.log('approve2')}
  web3.eth.getAccounts(function (err, accounts) {
    address=accounts[0]
    tokenContract.methods.approve(airdropContractAddress,web3.utils.toWei("10000000000",'ether')).send({from:address}).then(function(err,result){
      if(DEBUG){console.log('approve')}
    })
  })
}
function distribute2(){
  if(DEBUG){console.log('distribute2')}
  web3.eth.getAccounts(function (err, accounts) {
    var address=accounts[0]
//airdrop(address[] memory toAirdrop,uint[] memory ethFromEach,uint totalEth,uint tokensRewarded,address tokenAddress) public{
    var tokensToDistribute=document.getElementById('tokenstodistribute').value
    if(!tokenDecimals){
      alert('please wait for token to load')
      return;
    }
    //Number(tokensToDistribute)*(10**tokenDecimals)
    tokensToDistribute=web3.utils.toBN(tokensToDistribute).mul(web3.utils.toBN(10**tokenDecimals))//web3.utils.toWei(tokensToDistribute,'ether')
    var text=document.getElementById('relativeShares').value
    console.log('.aeigroaejrgo')
    var values=processTextValues(text)
    console.log('.aeigroaejrgo2')
    if(!values){
      alert('check your text formatting, one comma per line etc')
      return null;
    }
    if(values.addresses.length!=values.amounts.length){
      alert('mismatch in address/amount counts')
      return null;
    }
    console.log('distributing with parameters ',values,tokensToDistribute.toString(),tokenContractAddress)
    airdropContract.methods.airdrop(values.addresses,values.amounts,values.total.toString(),tokensToDistribute.toString(),tokenContractAddress).send({from:address}).then(function(err,result){
      if(DEBUG){console.log('approve')}
    })
  })
}
function processTextValues(text){
  var lines=text.split('\n')
  var addresses=[]
  var amounts=[]
  var total=web3.utils.toBN(0)
  for(var i=0;i<lines.length;i++){
    var count = (lines[i].match(/,/g) || []).length;
    if(count!=1){
      return null;
    }
    var parts=lines[i].split(',')
    addresses.push(parts[0])
    var weivalue=web3.utils.toWei(parts[1]+'','ether')
    amounts.push(weivalue)
    total=total.add(web3.utils.toBN(weivalue))
  }
  //total=web3.utils.toWei(total,'ether')
  return {total:total,addresses:addresses,amounts:amounts}
}
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}
function copyRef() {
  console.log('copied reflink to clipboard')
  copyToClipboard(document.getElementById('myreflink'))
  alert('copied to clipboard '+document.getElementById('myreflink').textContent)
  //alert("Copied the text: " + copyText.value);
}
function updateReflink(){
  web3.eth.getAccounts(function (err, accounts) {
    var prldoc=document.getElementById('myreflink')
    prldoc.textContent=window.location.origin.replace('http://','https://')+"?ref="+accounts[0]
  })
}
function getRefToUse(){
  var reftouse=0;
  var urlref=getQueryVariable('ref')
  if(!urlref){
    urlref='0x0000000000000000000000000000000000000000'
  }
  reftouse=escape(urlref)
  if(reftouse.length!=42){
    reftouse='0x0000000000000000000000000000000000000000'
  }
  return reftouse
}
function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}
