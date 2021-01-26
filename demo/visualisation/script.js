const activeNormalColor = "#69db37";
const activateQuantumColor = "#00acf1";

const stages = [
  {
    name: "initial",
    connection: undefined,
    peerSelected: undefined,
    text: "Receiving transaction",
    nextStage: "toeplitz-proposal-peer-1",
    previousStage: "initial",
  },
  {
    name: "toeplitz-proposal-peer-1",
    connection: "first-second-quantum",
    peerSelected: undefined,
    text: "Establishing Toeplitz matrix",
    nextStage: "toeplitz-proposal-peer-2",
    previousStage: "initial",
  },
  {
    name: "toeplitz-proposal-peer-2",
    connection: "first-third-quantum",
    peerSelected: undefined,
    text: "Establishing Toeplitz matrix",
    nextStage: "toeplitz-proposal-peer-3",
    previousStage: "toeplitz-proposal-peer-1",
  },
  {
    name: "toeplitz-proposal-peer-3",
    connection: "first-fourth-quantum",
    peerSelected: undefined,
    text: "Establishing Toeplitz matrix",
    nextStage: "one-time-pad-proposal-peer-1",
    previousStage: "toeplitz-proposal-peer-2",
  },
  {
    name: "one-time-pad-proposal-peer-1",
    connection: "first-second-quantum",
    peerSelected: undefined,
    text: "Establishing one-time pad",
    nextStage: "one-time-pad-proposal-peer-2",
    previousStage: "toeplitz-proposal-peer-3",
  },
  {
    name: "one-time-pad-proposal-peer-2",
    connection: "first-third-quantum",
    peerSelected: undefined,
    text: "Establishing one-time pad",
    nextStage: "one-time-pad-proposal-peer-3",
    previousStage: "one-time-pad-proposal-peer-1",
  },
  {
    name: "one-time-pad-proposal-peer-3",
    connection: "first-fourth-quantum",
    peerSelected: undefined,
    text: "Establishing one-time pad",
    nextStage: "toeplitz-hashes",
    previousStage: "one-time-pad-proposal-peer-2",
  },
  {
    name: "toeplitz-hashes",
    connection: undefined,
    peerSelected: "first-peer",
    text: "Calculating Toeplitz Hashes for all peers using Toeplitz matrix, transaction data and one-time pad",
    nextStage: "self-toeplitz-hash",
    previousStage: "one-time-pad-proposal-peer-3",
  },
  {
    name: "self-toeplitz-hash",
    connection: undefined,
    peerSelected: "first-peer",
    text: "Calculating Toeplitz Hash for itself",
    nextStage: "toeplitz-group-signature",
    previousStage: "toeplitz-hashes",
  },
  {
    name: "toeplitz-group-signature",
    connection: undefined,
    peerSelected: "first-peer",
    text: "Generating Toeplitz Group Signature",
    nextStage: "block-proposal-1",
    previousStage: "self-toeplitz-hash",
  },
  {
    name: "block-proposal-1",
    connection: "first-second-normal",
    text: "Sending block proposal with Toeplitz Group Signature",
    nextStage: "verifying-TGS-1",
    previousStage: "toeplitz-group-signature",
  },
  {
    name: "verifying-TGS-1",
    connection: undefined,
    peerSelected: "second-peer",
    text: "Verifying Teoplitz Group Signature",
    nextStage: "block-proposal-2",
    previousStage: "block-proposal-1",
  },
  {
    name: "block-proposal-2",
    connection: "first-third-normal",
    peerSelected: undefined,
    text: "Sending block proposal with Toeplitz Group Signature",
    nextStage: "verifying-TGS-2",
    previousStage: "verifying-TGS-1",
  },
  {
    name: "verifying-TGS-2",
    connection: undefined,
    peerSelected: "third-peer",
    text: "Verifying Teoplitz Group Signature",
    nextStage: "block-proposal-3",
    previousStage: "block-proposal-2",
  },
  {
    name: "block-proposal-3",
    connection: "first-fourth-normal",
    peerSelected: undefined,
    text: "Sending block proposal with Toeplitz Group Signature",
    nextStage: "verifying-TGS-3",
    previousStage: "verifying-TGS-2",
  },
  {
    name: "verifying-TGS-3",
    connection: undefined,
    peerSelected: "fourth-peer",
    text: "Verifying Teoplitz Group Signature",
    nextStage: "generate-random-array-1",
    previousStage: "block-proposal-3",
  },
  {
    name: "generate-random-array-1",
    connection: undefined,
    peerSelected: "first-peer",
    text: "First peer generates random array of voting peers",
    nextStage: "generate-random-array-2",
    previousStage: "verifying-TGS-3",
  },
  {
    name: "generate-random-array-2",
    connection: undefined,
    peerSelected: "second-peer",
    text: "Second peer generates random array of voting peers",
    nextStage: "generate-random-array-3",
    previousStage: "generate-random-array-1",
  },
  {
    name: "generate-random-array-3",
    connection: undefined,
    peerSelected: "third-peer",
    text: "Third peer generates random array of voting peers",
    nextStage: "generate-random-array-4",
    previousStage: "generate-random-array-2",
  },
  {
    name: "generate-random-array-4",
    connection: undefined,
    peerSelected: "fourth-peer",
    text: "Fourth peer generates random array of voting peers",
    nextStage: "vote-request-1",
    previousStage: "generate-random-array-3",
  },
  {
    name: "vote-request-1",
    connection: "first-third-normal",
    peerSelected: undefined,
    text: "Peer sends vote request to the first peer from random array together with hashed transaction",
    nextStage: "verifying-1",
    previousStage: "generate-random-array-4",
  },
  {
    name: "verifying-1",
    connection: undefined,
    peerSelected: "third-peer",
    text: "First voting peer verifies hashed transaction and votes",
    nextStage: "voting-1",
    previousStage: "vote-request-1",
  },
  {
    name: "voting-1",
    connection: "third-first-normal",
    peerSelected: undefined,
    text: "First voting peer sends add vote request",
    nextStage: "voting-2",
    previousStage: "verifying-1",
  },
  {
    name: "voting-2",
    connection: "third-fourth-normal",
    peerSelected: undefined,
    text: "First voting peer sends add vote request",
    nextStage: "voting-3",
    previousStage: "voting-1",
  },
  {
    name: "voting-3",
    connection: "third-second-normal",
    peerSelected: undefined,
    text: "First voting peer sends add vote request",
    nextStage: "vote-request-2",
    previousStage: "voting-2",
  },
  {
    name: "vote-request-2",
    connection: "third-fourth-normal",
    peerSelected: undefined,
    text: "Peer sends vote request to the second peer from random array together with hashed transaction",
    nextStage: "verifying-2",
    previousStage: "voting-3",
  },
  {
    name: "verifying-2",
    connection: undefined,
    peerSelected: "fourth-peer",
    text: "Second voting peer verifies hashed transaction and votes",
    nextStage: "voting-4",
    previousStage: "vote-request-2",
  },
  {
    name: "voting-4",
    connection: "fourth-first-normal",
    peerSelected: undefined,
    text: "Second voting peer sends add vote request",
    nextStage: "voting-5",
    previousStage: "verifying-2",
  },
  {
    name: "voting-5",
    connection: "fourth-second-normal",
    peerSelected: undefined,
    text: "Second voting peer sends add vote request",
    nextStage: "voting-6",
    previousStage: "voting-4",
  },
  {
    name: "voting-6",
    connection: "fourth-third-normal",
    peerSelected: undefined,
    text: "Second voting peer sends add vote request",
    nextStage: "vote-request-3",
    previousStage: "voting-5",
  },
  {
    name: "vote-request-3",
    connection: "fourth-second-normal",
    peerSelected: undefined,
    text: "Peer sends vote request to the third peer from random array together with hashed transaction",
    nextStage: "verifying-3",
    previousStage: "voting-6",
  },
  {
    name: "verifying-3",
    connection: undefined,
    peerSelected: "second-peer",
    text: "Third voting peer verifies hashed transaction and votes",
    nextStage: "add-block-1",
    previousStage: "voting-6",
  },
  {
    name: "enough-votes",
    connection: undefined,
    peerSelected: "second-peer",
    text: "Block is valid, enough votes",
    nextStage: "verifying-3",
    previousStage: "voting-6",
  },
  {
    name: "add-block-1",
    connection: "second-first-normal",
    peerSelected: undefined,
    text: "Third voting peer sends request to add block to chain",
    nextStage: "add-block-2",
    previousStage: "verifying-3",
  },
  {
    name: "add-block-2",
    connection: "second-third-normal",
    peerSelected: undefined,
    text: "Third voting peer sends request to add block to chain",
    nextStage: "add-block-3",
    previousStage: "add-block-1",
  },
  {
    name: "add-block-3",
    connection: "second-fourth-normal",
    peerSelected: undefined,
    text: "Third voting peer sends request to add block to chain",
    nextStage: "final",
    previousStage: "add-block-2",
  },
  {
    name: "final",
    connection: undefined,
    peerSelected: undefined,
    text: "Block is added to chain",
    nextStage: "final",
    previousStage: "add-block-3",
  },
];

let currentStage = stages.filter((stage) => stage.name === "initial")[0];
const onStageChange = (stageType) => {
  document.getElementById("transaction-details-channel").innerHTML = "";
  if (currentStage.connection) {
    document.getElementById(`dots-${currentStage.connection}`).style.display = "none";
  }

  if (currentStage.peerSelected) {
    document.getElementById(currentStage.peerSelected).style.filter = "brightness(100%)";
  }

  currentStage = getCurrentStage(stageType);

  document.getElementById("transaction-details-text").innerHTML = currentStage.text;

  if (currentStage.connection) {
    document.getElementById(`dots-${currentStage.connection}`).style.display = "block";
    const color = currentStage.connection.includes("quantum") ? activateQuantumColor : activeNormalColor;
    document.getElementById("transaction-details-channel").style.color = color;
    const connectionType = currentStage.connection.includes("quantum") ? "Quantum channel" : "Normal channel";
    document.getElementById("transaction-details-channel").innerHTML = connectionType;

  }

  if (currentStage.peerSelected) {
    document.getElementById(currentStage.peerSelected).style.filter = "brightness(175%)";
  }
}

const getCurrentStage = (stageType) => {
  return currentStage = stages.filter(
    (stage) => stage.name === currentStage[stageType]
  )[0];
}
