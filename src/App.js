import "./App.css";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk, { waitForConfirmation } from "algosdk";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";

//const crypto = require("crypto");

const peraWallet = new PeraWalletConnect();

// The app ID on testnet
// MORRA app
const appIndex = 168752855;
const appAddress = "QCS7PQACBU45EPRRIY2LNKKQRQTI2PSVYCIY43GMMWMZPOQ3VBPLPWMMOE";

// connect to the algorand node
// token, address(server), port
const algod = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  443
);

function App() {
  const [accountAddress, setAccountAddress] = useState(null);
  const [owner, setOwner] = useState(null);
  const [realhand, setRealHand] = useState(null);
  const isConnectedToPeraWallet = !!accountAddress; //convert string to boolean

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        console.log(accounts);
        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Container>
      <meta name="name" content="Testing frontend for PyTeal" />
      <h1> Test frontend for PyTeal</h1>
      <Row>
        <Col>
          <Button
            onClick={
              isConnectedToPeraWallet
                ? handleDisconnectWalletClick
                : handleConnectWalletClick
            }
          >
            {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button onClick={() => optInMorraApp()}>OptIn</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button onClick={() => setOwner(true)}>Start Game</Button>
        </Col>
        <Col>
          <Button onClick={() => setOwner(false)}>Join Game</Button>
        </Col>
        <Col>
          <Button onClick={() => resolveMorraApplication()}>Resolve Game</Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button
            onClick={
              !!owner === true
                ? () =>
                    startMorraApplication(
                      "K/GTtAFY6MUn2D1iIJm56DXU64NQyftRNErvk9UGj7Q=",
                      "ZERO"
                    )
                : () => joinMorraApplication("ZERO")
            }
          >
            ZERO
          </Button>
        </Col>
        <Col>
          <Button
            onClick={
              !!owner === true
                ? () =>
                    startMorraApplication(
                      "IZLolV1eGtFlHy8MY35vGsgoVXR6X0L5eNsoZpWV3CE=",
                      "ONE"
                    )
                : () => joinMorraApplication("ONE")
            }
          >
            ONE
          </Button>
        </Col>
        <Col>
          <Button
            onClick={
              !!owner === true
                ? () =>
                    startMorraApplication(
                      "oaioy77U61OuYu5PsHh1BAhyMsKapNgXdX0Gto0FAco=",
                      "TWO"
                    )
                : () => joinMorraApplication("TWO")
            }
          >
            TWO
          </Button>
        </Col>
        <Col>
          <Button
            onClick={
              !!owner === true
                ? () =>
                    startMorraApplication(
                      "HXm/YINetc0Wze8SRBOnVShX4J/1D2LEDrCd3FXSWCk=",
                      "THREE"
                    )
                : () => joinMorraApplication("THREE")
            }
          >
            THREE
          </Button>
        </Col>
        <Col>
          <Button
            onClick={
              !!owner === true
                ? () =>
                    startMorraApplication(
                      "7fnjYw+3MFpWLTW/TLIK+4ecjU3PFuLCH6BRB5mcf2w=",
                      "FOUR"
                    )
                : () => joinMorraApplication("FOUR")
            }
          >
            FOUR
          </Button>
        </Col>
        <Col>
          <Button
            onClick={
              !!owner === true
                ? () =>
                    startMorraApplication(
                      "s1zxuhEbvPOm8kdV8i7RNGqDAqpiuc+M6C+LXyhU64M=",
                      "FIVE"
                    )
                : () => joinMorraApplication("FIVE")
            }
          >
            FIVE
          </Button>
        </Col>
      </Row>
    </Container>
  );

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0]);
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();
    setAccountAddress(null);
  }

  async function optInMorraApp() {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();

      const actionTx = algosdk.makeApplicationOptInTxn(
        accountAddress,
        suggestedParams,
        appIndex
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTx = await peraWallet.signTransaction([actionTxGroup]);
      console.log(signedTx);
      const { txId } = await algod.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(algod, txId, 2);
    } catch (e) {
      console.error(`There was an error calling the morra app: ${e}`);
    }
  }

  async function startMorraApplication(
    hashedhand = "K/GTtAFY6MUn2D1iIJm56DXU64NQyftRNErvk9UGj7Q=",
    hand = "ZERO"
  ) {
    try {
      setRealHand(hand);
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("start")),
        new Uint8Array(Buffer.from(hashedhand, "base64")),
      ];
      
      //second account
      const accounts = [
        "3JS2RLGIUM5RKL24PBFTOCWRGWWQ4LKPLUQHX7LVRIQFLUVQX4OBR2CJ4A",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams,
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] },
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the morra app: ${e}`);
    }
  }

  async function joinMorraApplication(hand) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("accept")),
        new Uint8Array(Buffer.from(hand)),
      ];
      
      //first account
      const accounts = [
        "2O2PSJPVWNZ5RZC6H55VTDVWXLPGWJXEBJZ2E2R3OJMCQDHR3WPCJ5BIJ4",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams,
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] },
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the morra app: ${e}`);
    }
  }

  // RESOLVE MORRA WINNER
  async function resolveMorraApplication() {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("resolve")),
        new Uint8Array(Buffer.from(realhand)),
      ];

      //opponents account
      const accounts = [
        "3JS2RLGIUM5RKL24PBFTOCWRGWWQ4LKPLUQHX7LVRIQFLUVQX4OBR2CJ4A",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);
      const txns = [signedTxns];

      console.log(signedTxns);

      //const dr = algosdk.createDryrun(algod, txns);

      //test debugging
      //const dryRunResult = await algod.dryrun(dr).do();
      //console.log(dryRunResult);

      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      console.log(result);
    } catch (e) {
      console.error(`There was an error calling the morra app: ${e}`);
    }
  }

  // Clear state
  // {
  //   "txn": {
  //     "apan": 3,
  //     "apid": 51,
  //     "fee": 1000,
  //     "fv": 13231,
  //     "gh": "ALXYc8IX90hlq7olIdloOUZjWfbnA3Ix1N5vLn81zI8=",
  //     "lv": 14231,
  //     "note": "U93ZQy24zJ0=",
  //     "snd": "LNTMAFSF43V7RQ7FBBRAWPXYZPVEBGKPNUELHHRFMCAWSARPFUYD2A623I",
  //     "type": "appl"
  //   }
  // }
}

export default App;
