const {readFileSync, promises: fsPromises} = require('fs');
require('dotenv').config()


const { OnApplicationComplete } = require('algosdk');
global.atob = require("atob");
const algosdk = require('algosdk');
const { config } = require('process');
const { domainToASCII } = require('url');
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const port = '';
const token = {
    'X-API-Key': process.env.API_KEY
}

function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
  
    const arr = contents.split(/\r?\n/);
  
    console.log(arr); // 👉️ ['One', 'Two', 'Three', 'Four']
  
    return arr;
  }

// let approvalCode = "#pragma version 5\nint 1"; 
let approvalCode = syncReadFile('./build/approvalCode.teal');
let AC = approvalCode.join('\n');
console.log(approvalCode.join('\n'));
let clearCode = "#pragma version 5\nint 1";

const algodclient = new algosdk.Algodv2(token, baseServer, port);

function _base64ToArrayBuffer(base64) {
    var binary_string = global.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

async function compileProgram(algodClient, programSource){
    let encoder = new TextEncoder();
    let programBytes = encoder.encode(programSource);
    let compileResponse = await algodClient.compile(programBytes).do();

    let compileBytes = new Uint8Array(Buffer.from(compileResponse.result, "base64"));

    return compileBytes;
}

let applicationID = 114882863;

async function makeApplication(){
    let accountSender = algosdk.mnemonicToSecretKey(process.env.MNUEMONIC_KEY);
    let params = await algodclient.getTransactionParams().do();   
    // let compiledApprovalTeal = await algodclient.compile(approvalCode).do();
    // let compiledClearTeal = await algodclient.compile(clearCode).do();
    let compiledApprovalTeal = await compileProgram(algodclient,AC);
    let compiledClearTeal = await await compileProgram(algodclient,clearCode);
    // let Uint8TransformedApproval =  _base64ToArrayBuffer(compiledApprovalTeal.result);
    // let Uint8TransformedClear =  _base64ToArrayBuffer(compiledClearTeal.result);
    // let approvalProgramCompiled = await algosdk.compileProgram(algodclient, approvalCode);

    // let Uint8Transformed = Uint8Array.from(atob(compiledApprovalTeal.result), c => c.charCodeAt(0)); 
    const onComplete = algosdk.OnApplicationComplete.NoOpOC;   
    
    let action = await algosdk.makeApplicationCreateTxn(accountSender.addr,params,onComplete,compiledApprovalTeal,compiledClearTeal,1,1,3,3);
    let signedTxn = action.signTxn(accountSender.sk);
    let txId = action.txID().toString();
    console.log("Signed Txn",signedTxn)
    console.log("Signed transaction with txID: %s", txId);
    console.log(accountSender);

      // Submit the transaction
    let check =   await algodclient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation(algodclient, txId, 4);
    console.log(compiledApprovalTeal);
    // console.log((Uint8TransformedApproval));
    // console.log(approvalProgramCompiled);
    // console.log((Uint8Transformed));  

    // console.log(params);
    console.log(action);
    console.log(check);

    console.log(confirmedTxn);

}

async function optInApp(){
  let accountSender = algosdk.mnemonicToSecretKey(process.env.MNUEMONIC_KEY);
  let params = await algodclient.getTransactionParams().do(); 

    encodedString = Buffer.from("ADD").toString('base64')

    // appArgs = Uint8Array[encodedString];

    // var enc = new TextEncoder() ;
    // let appArgs = [];
    // appArgs.push(enc.encode("SET"));

    let action = algosdk.makeApplicationOptInTxn(accountSender.addr,params,applicationID);

    let signedTxn = action.signTxn(accountSender.sk);
    let txId = action.txID().toString();
    console.log("Signed Txn",signedTxn)
    console.log("Signed transaction with txID: %s", txId);
    console.log(accountSender);

      // Submit the transaction
    let check =   await algodclient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation(algodclient, txId, 4);
    console.log(confirmedTxn)
}


async function setupAdder(){
  let accountSender = algosdk.mnemonicToSecretKey(process.env.MNUEMONIC_KEY);
  let params = await algodclient.getTransactionParams().do(); 

    encodedString = Buffer.from("ADD").toString('base64')

    // appArgs = Uint8Array[encodedString];

    var enc = new TextEncoder() ;
    let appArgs = [];
    appArgs.push(enc.encode("SET"));

    let action = algosdk.makeApplicationNoOpTxn(accountSender.addr,params,applicationID,appArgs);

    let signedTxn = action.signTxn(accountSender.sk);
    let txId = action.txID().toString();
    console.log("Signed Txn",signedTxn)
    console.log("Signed transaction with txID: %s", txId);
    console.log(accountSender);

      // Submit the transaction
    let check =   await algodclient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation(algodclient, txId, 4);
    console.log(confirmedTxn)
}

async function incrementCounter(){
  let accountSender = algosdk.mnemonicToSecretKey(process.env.MNUEMONIC_KEY);
  let params = await algodclient.getTransactionParams().do(); 

    encodedString = Buffer.from("ADD").toString('base64')

    // appArgs = Uint8Array[encodedString];

    var enc = new TextEncoder() ;
    let appArgs = [];
    appArgs.push(enc.encode("ADD"));

    let action = algosdk.makeApplicationNoOpTxn(accountSender.addr,params,applicationID,appArgs);

    let signedTxn = action.signTxn(accountSender.sk);
    let txId = action.txID().toString();
    console.log("Signed Txn",signedTxn)
    console.log("Signed transaction with txID: %s", txId);
    console.log(accountSender);

      // Submit the transaction
    let check =   await algodclient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation(algodclient, txId, 4);
    console.log(confirmedTxn)
}

async function assetCreation(){
  let accountSender = algosdk.mnemonicToSecretKey(process.env.MNUEMONIC_KEY);
  let params = await algodclient.getTransactionParams().do(); 

  encodedString = Buffer.from("ADD").toString('base64')

  // appArgs = Uint8Array[encodedString];

  var enc = new TextEncoder() ;
  let appArgs = [];
  appArgs.push(enc.encode("ASSET"));

  let action = algosdk.makeApplicationNoOpTxn(accountSender.addr,params,applicationID,appArgs);

  let signedTxn = action.signTxn(accountSender.sk);
  let txId = action.txID().toString();
  console.log("Signed Txn",signedTxn)
  console.log("Signed transaction with txID: %s", txId);
  console.log(accountSender);

    // Submit the transaction
  let check =   await algodclient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
  let confirmedTxn = await algosdk.waitForConfirmation(algodclient, txId, 4);
  console.log(confirmedTxn)
}

async function incrementAdder(){
  let accountSender = algosdk.mnemonicToSecretKey(process.env.MNUEMONIC_KEY);
  let params = await algodclient.getTransactionParams().do(); 

    // encodedString = Buffer.from("ADD").toString('base64')

    // appArgs = Uint8Array[encodedString];

    var enc = new TextEncoder() ;
    let appArgs = [];
    appArgs.push(enc.encode("INCR"));

    let action = algosdk.makeApplicationNoOpTxn(accountSender.addr,params,114079483,appArgs);

    let signedTxn = action.signTxn(accountSender.sk);
    let txId = action.txID().toString();
    console.log("Signed Txn",signedTxn)
    console.log("Signed transaction with txID: %s", txId);
    console.log(accountSender);

      // Submit the transaction
    let check =   await algodclient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation(algodclient, txId, 4);
    console.log(confirmedTxn)
}

const createAccount =  function (){
    try{  
        const myaccount = algosdk.generateAccount();
        console.log("Account Address = " + myaccount.addr);
        let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
        console.log("Account Mnemonic = "+ account_mnemonic);
        console.log("Account created. Save off Mnemonic and address");
        console.log("Add funds to account using the TestNet Dispenser: ");
        console.log("https://dispenser.testnet.aws.algodev.network/ ");

        console.log(myaccount);
    }
    catch (err) {
        console.log("err", err);
    }
};

// createAccount();

// makeApplication();

// optInApp();

// setupAdder();

// incrementCounter();

// incrementAdder();

// decrementCounter();

// decrementAdder();

// assetCreation();

// sendAsset();



console.log(algodclient);


