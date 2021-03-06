import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import { useState } from "react";
const { ethers } = require("ethers");

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function FaucetInput() {
  const [BDopen, BDsetOpen] = React.useState(false);
  const BDhandleClose = () => {
    BDsetOpen(false);
  };
  const BDhandleOpen = () => {
    BDsetOpen(true);
  };

  const [SBopen, SBsetOpen] = React.useState(false);

  const SBhandleOpen = () => {
    SBsetOpen(true);
  };

  const SBhandleClose = (event, reason) => {
    SBsetOpen(false);
  };

  const [ethAddress, setEthAddress] = useState("");

  const addressChangeHandler = (event) => {
    setEthAddress(event.target.value);
  };

  const submitHandler = async (event) => {
    BDhandleOpen();

    const provider = new ethers.providers.JsonRpcProvider(
      "https://f4fc-202-88-234-181.ngrok.io"
    );

    // When using seed //
    // const mnemonic =
    //   "liberty fade indoor way jazz tonight symbol error super loud earth allow";
    // const walletAddress = ethers.Wallet.fromMnemonic(mnemonic);

    const keystore = require('./keyfile/UTC--2022-03-01T17-15-18.508358800Z--a9c229f4674de0d1fa53565f5ff4c5988c9fae49');
    const walletAddress = await ethers.Wallet.fromEncryptedJson(keystore);

    const tx = {
      to: ethAddress,
      value: ethers.utils.parseEther("1.0"),
    };

    // Signing a transaction
    await walletAddress.signTransaction(tx);

    // The connect method returns a new instance of the
    // Wallet connected to a provider
    const wallet = walletAddress.connect(provider);

    // Sending ether
    await wallet.sendTransaction(tx);

    BDhandleClose();
    SBhandleOpen();
    setEthAddress("");
  };

  return (
    <Box
      sx={{
        width: 900,
        maxWidth: "100%",
        marginLeft: 10,
        marginTop: 10,
      }}
    >
      <Typography variant="h4" component="div" gutterBottom>
        <b>Ethereum Testnet Faucet</b>
      </Typography>

      <Typography variant="subtitle2" component="div" gutterBottom>
        <b>Your Ethereum wallet address</b>
      </Typography>

      <TextField
        fullWidth
        onChange={addressChangeHandler}
        id="fullWidth"
        value={ethAddress}
        autoFocus
        helperText="Please enter your ethereum account addres eg: 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
      />

      <br />
      <br />
      <Button id="submitButton" variant="contained" onClick={submitHandler}>
        <b>Request Ether</b>
      </Button>

      <br />
      <br />
      <br />
      <br />
      <Typography variant="subtitle2" component="div" gutterBottom>
        <b>Developed and maintained by Decentralized Labs</b>
      </Typography>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={BDopen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={SBopen} autoHideDuration={3000} onClose={SBhandleClose}>
        <Alert
          onClose={SBhandleClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Account Funded with Test Ether
        </Alert>
      </Snackbar>
    </Box>
  );
}
