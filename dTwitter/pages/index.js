import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect} from 'react'
import 'bulma/css/bulma.css'
import Web3 from 'web3'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [error, setError]  = useState('')
  const [vmContract, setVmContract] = useState(null)
  const [web3, setWeb3] = useState(null)
  const [winner, setWinner] = useState(null)
  const [address, setAddress] = useState(null)
  const [successMsg, setSuccessMsg] = useState('')
  const [proposals_length, setproposals_length] = useState('')
  const [proposals, setProposals] = useState([])
  const [addressDetails, setAddressDetails] = useState('')
  const [voted, setVoted] = useState(1)
  const [weight, setWeight] = useState(0)
  const addressMap = {0:"A",1:"B",2:"C"};

  useEffect(() => {
    if (vmContract){
        winnerHandler()
        if(vmContract && proposals){
            proposal_Handler()
            if (vmContract && address ) {
                addressDetailsHandler()
            }
        }
    }
    else{
        vmContractHandler()
    }
})

const vmContractHandler = async () => {
    // if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
        try {
            
            web3 = await new Web3(window.ethereum);
            setWeb3(web3)
            // console.log("Web3 set")
            const abi2 = [{
                  "inputs": [{
                      "internalType": "string[]",
                      "name": "proposalNames",
                      "type": "string[]"}],
                  "stateMutability": "nonpayable",
                  "type": "constructor"},
                {
                  "inputs": [],
                  "name": "chairperson",
                  "outputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "to",
                      "type": "address"
                    }
                  ],
                  "name": "delegate",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "giveRightToVote",
                  "outputs": [],
                  "stateMutability": "payable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                    }
                  ],
                  "name": "proposals",
                  "outputs": [
                    {
                      "internalType": "string",
                      "name": "name",
                      "type": "string"
                    },
                    {
                      "internalType": "uint256",
                      "name": "voteCount",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "uint256",
                      "name": "proposal",
                      "type": "uint256"
                    }
                  ],
                  "name": "vote",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                },
                {
                  "inputs": [
                    {
                      "internalType": "address",
                      "name": "",
                      "type": "address"
                    }
                  ],
                  "name": "voters",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "weight",
                      "type": "uint256"
                    },
                    {
                      "internalType": "bool",
                      "name": "voted",
                      "type": "bool"
                    },
                    {
                      "internalType": "address",
                      "name": "delegate",
                      "type": "address"
                    },
                    {
                      "internalType": "uint256",
                      "name": "vote",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "winnerName",
                  "outputs": [
                    {
                      "internalType": "string",
                      "name": "winnerName_",
                      "type": "string"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                },
                {
                  "inputs": [],
                  "name": "winningProposal",
                  "outputs": [
                    {
                      "internalType": "uint256",
                      "name": "winningProposal_",
                      "type": "uint256"
                    }
                  ],
                  "stateMutability": "view",
                  "type": "function"
                }
              ]
            // console.log("Type of abi2 is", typeof(abi2))
            const vm = await new web3.eth.Contract(abi2, "0x421035fD1486b0EF23dfFae85F1DbeA41F270fa7");
            // const vm = await contract(web3);
            setVmContract(vm)
            // console.log("Contract set")
            // console.log(vmContract)
        }
        catch (err) {
            setError(err.message)
        }
}

const ConnectWalletHandler = async() => {
    // console.log("Connect wallet fired")
    // if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            // console.log("Accounts accessed")
            const account = accounts[0];
            setAddress(account)
            // console.log("Address is ", address)
            setError('')
            setSuccessMsg(WalletConnected)
        }
        catch (err) {
            setError("Unable to connect wallet")
        }
}




    // FIRST COME IRST SERVE

    const winnerHandler = async () => {
        // console.log("Entered the winner handler")
        const winner_this = await vmContract.methods.winnerName().call();
        console.log("Winner is =>", winner_this)
        if(winner_this == "None") setWinner("0")
        else setWinner(winner_this)
        }

    const proposal_Handler = async () => {
        setproposals_length(3)
        const proposal = []
        for (let index = 0; index < proposals_length; index++) {
            const element = await vmContract.methods.proposals(index).call()
            // console.log(index," => ")
            // console.log(element)
            proposal.push(element)   

        }
        setProposals(proposal)
    }

    const addressDetailsHandler = async () => {
        // console.log("Address is from detail =>", address)
        const detail1 = await vmContract.methods.voters(address).call()
        // console.log("Detail fetched")
        setAddressDetails(detail1)
        // console.log("Name =>",addressDetails[0])
        const voted = addressDetails[1]
        if (voted == false) {
            setVoted(0)
        }
        else {
            setVoted(1)
        }
        setWeight(addressDetails[0])
    }

    const votingHandler_0 = async () => {
        if (address == null) setError("Connect Wallet")
        else 
        if(weight == 0) setError("Get right to Vote")
        else 
        if(voted == 1){
            setError("Already voted")
        }
        else {
            // console.log("Get ready to vote")
            try{
                await vmContract.methods.vote(0).send({
                    from: address
                    // ,
                    // value: web3.utils.toWei('0.001', "ether") * buyCount
                })
                // setPurchases(purchases++);
                setSuccessMsg(`Congratulations, Voted Successfully`)
                // getValueHandler()
                }
                catch(err){
                    setError(err.message)
                }
            
        }
    }

    const votingHandler_1 = async () => {
        if (address == null) setError("Connect Wallet")
        else 
        if(weight == 0) setError("Get right to Vote")
        else 
        if(voted == 1){
            setError("Already voted")
        }
        else {
            // console.log("Get ready to vote")
            try{
                await vmContract.methods.vote(1).send({
                    from: address
                    // ,
                    // value: web3.utils.toWei('0.001', "ether") * buyCount
                })
                // setPurchases(purchases++);
                setSuccessMsg(`Congratulations, Voted Successfully`)
                // getValueHandler()
                }
                catch(err){
                    setError(err.message)
                }
            
        }
    }

    const votingHandler_2 = async () => {
        if (address == null) setError("Connect Wallet")
        else 
        if(weight == 0) setError("Get right to Vote")
        else 
        if(voted == 1){
            setError("Already voted")
        }
        else {
            // console.log("Get ready to vote")
            try{
                await vmContract.methods.vote(2).send({
                    from: address
                    // ,
                    // value: web3.utils.toWei('0.001', "ether") * buyCount
                })
                // setPurchases(purchases++);
                setSuccessMsg(`Congratulations, Voted Successfully`)
                // getValueHandler()
                }
                catch(err){
                    setError(err.message)
                }
            
        }
    }

    const getRightToVote = async () => {
        if (weight != 1){
            try {
                await vmContract.methods.giveRightToVote().send({
                    from: address
                })
                setSuccessMsg("Given the right to vote")
            } 
            catch (error) {
                setError(error.message)
            }
        }
        else {
            setError("Already have the right to vote")
        }
    }


    // const 
    


  return (
    <div>
     <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Vote your Crypto</title>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT"
    crossOrigin="anonymous"
  />
  <svg xmlns="https://fonts.googleapis.com/icon?family=Material+Icons" style={{ display: "none" }}>
    <symbol id="check" viewBox="0 0 16 16">
      <title>Check</title>
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
    </symbol>
  </svg>
  <div className="container py-3">
    <header>
      <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
        <div
          href="/"
          className="d-flex align-items-center text-dark text-decoration-none"
        >
          <svg
            xmlns="https://fonts.googleapis.com/icon?family=Material+Icons"
            width={40}
            height={32}
            className="me-2"
            viewBox="0 0 118 94"
            role="img"
          >
            <title>Bootstrap</title>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M24.509 0c-6.733 0-11.715 5.893-11.492 12.284.214 6.14-.064 14.092-2.066 20.577C8.943 39.365 5.547 43.485 0 44.014v5.972c5.547.529 8.943 4.649 10.951 11.153 2.002 6.485 2.28 14.437 2.066 20.577C12.794 88.106 17.776 94 24.51 94H93.5c6.733 0 11.714-5.893 11.491-12.284-.214-6.14.064-14.092 2.066-20.577 2.009-6.504 5.396-10.624 10.943-11.153v-5.972c-5.547-.529-8.934-4.649-10.943-11.153-2.002-6.484-2.28-14.437-2.066-20.577C105.214 5.894 100.233 0 93.5 0H24.508zM80 57.863C80 66.663 73.436 72 62.543 72H44a2 2 0 01-2-2V24a2 2 0 012-2h18.437c9.083 0 15.044 4.92 15.044 12.474 0 5.302-4.01 10.049-9.119 10.88v.277C75.317 46.394 80 51.21 80 57.863zM60.521 28.34H49.948v14.934h8.905c6.884 0 10.68-2.772 10.68-7.727 0-4.643-3.264-7.207-9.012-7.207zM49.948 49.2v16.458H60.91c7.167 0 10.964-2.876 10.964-8.281 0-5.406-3.903-8.178-11.425-8.178H49.948z"
              fill="currentColor"
            />
          </svg>
          <span className="fs-4">VoteIt</span>
        </div>
        <nav className="ms-md-auto">
        {/* <a class="me-3 py-2 text-dark text-decoration-none" href="#">Enterprise</a>
        <a class="me-3 py-2 text-dark text-decoration-none" href="#">Support</a>
        <a class="py-2 text-dark text-decoration-none" href="#">Pricing</a> */} 
        {address == null && <button type="button" className="btn btn-primary"  onClick={ConnectWalletHandler}>
            Connect(Rinkeby Testnet)
          </button>}
        {address != null && <button type="button" className="btn btn-primary"  onClick={ConnectWalletHandler}>
            Connected
          </button>}
        </nav>
      </div>
<h6 className='center fw-light' style = {{color:"blue"}}>Make sure to have Metamask extension installed in your browser</h6>
{/* <h6 className='center fw-light' style = {{color:"red"}}>{error}</h6> */}
<h6 className='center fw-light' style = {{color:"green"}}>{successMsg}</h6>

      <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
        <h1 className="display-4 fw-normal">Crypto Survey</h1>
        <p className="fs-5 text-muted">
          *This survey is conducted only for voluntarily purpose. These results don`&apos;`t represent the actual sentiments of peoples, nor do we holdreponsibility for the results
        </p>
      </div>
    </header>
    <main>
      <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
      {winner == 'A' && <><div className="col">
          <div className="card mb-4 rounded-3 border-primary">
                <div className="card-header py-3 text-bg-primary border-primary">
                    <h4 className="my-0 fw-normal">{proposals.length != 0 && <>{proposals[0][1]} votes</>}</h4>
                </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                $0<small className="text-muted fw-light">/mo</small>
              </h1>
                <ul className="list-unstyled mt-3 mb-4">
                    <li>10 users included</li>
                    <li>2 GB of storage</li>
                    <li>Email support</li>
                    <li>Help center access</li>
                </ul>
              <button
                type="button"
                className="w-100 btn btn-lg btn-outline-primary" onClick = {votingHandler_0}>
                Vote to support
              </button>
            </div>
          </div>
        </div></>}

        {winner != 'A' && <><div className="col">
          <div className="card mb-4 rounded-3">
                <div className="card-header py-3">
                    <h4 className="my-0 fw-normal">{proposals.length != 0 && <>{proposals[0][1]} votes</>}</h4>
                </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                $0<small className="text-muted fw-light">/mo</small>
              </h1>
                <ul className="list-unstyled mt-3 mb-4">
                    <li>10 users included</li>
                    <li>2 GB of storage</li>
                    <li>Email support</li>
                    <li>Help center access</li>
                </ul>
              <button
                type="button"
                className="w-100 btn btn-lg btn-outline-primary" onClick = {votingHandler_0}>
                Vote to support
              </button>
            </div>
          </div>
        </div></>}

        {winner == 'B' && <><div className="col">
          <div className="card mb-4 rounded-3 border-primary">
                <div className="card-header py-3 text-bg-primary border-primary">
                    <h4 className="my-0 fw-normal">{proposals.length != 0 && <>{proposals[1][1]} votes</>}</h4>
                </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                $8<small className="text-muted fw-light">/mo</small>
              </h1>
                <ul className="list-unstyled mt-3 mb-4">
                    <li>10 users included</li>
                    <li>2 GB of storage</li>
                    <li>Email support</li>
                    <li>Help center access</li>
                </ul>
              <button
                type="button"
                className="w-100 btn btn-lg btn-outline-primary" onClick = {votingHandler_1}>
                Vote to support
              </button>
            </div>
          </div>
        </div></>}

        {winner != 'B' && <><div className="col">
          <div className="card mb-4 rounded-3">
                <div className="card-header py-3">
                    <h4 className="my-0 fw-normal">{proposals.length != 0 && <>{proposals[1][1]} votes</>}</h4>
                </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                $1<small className="text-muted fw-light">/mo</small>
              </h1>
                <ul className="list-unstyled mt-3 mb-4">
                    <li>10 users included</li>
                    <li>2 GB of storage</li>
                    <li>Email support</li>
                    <li>Help center access</li>
                </ul>
              <button
                type="button"
                className="w-100 btn btn-lg btn-outline-primary" onClick = {votingHandler_1}>
                Vote to support
              </button>
            </div>
          </div>
        </div></>}

        
        {winner == 'C' && <><div className="col">
          <div className="card mb-4 rounded-3 border-primary">
                <div className="card-header py-3 text-bg-primary border-primary">
                    <h4 className="my-0 fw-normal">{proposals.length != 0 && <>{proposals[2][1]} votes</>}</h4>
                </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                $2<small className="text-muted fw-light">/mo</small>
              </h1>
                <ul className="list-unstyled mt-3 mb-4">
                    <li>10 users included</li>
                    <li>2 GB of storage</li>
                    <li>Email support</li>
                    <li>Help center access</li>
                </ul>
              <button
                type="button"
                className="w-100 btn btn-lg btn-outline-primary" onClick = {votingHandler_2}>
                Vote to support
              </button>
            </div>
          </div>
        </div></>}

        {winner != 'C' && <><div className="col">
          <div className="card mb-4 rounded-3">
                <div className="card-header py-3">
                    <h4 className="my-0 fw-normal">{proposals.length != 0 && <>{proposals[2][1]} votes</>}</h4>
                </div>
            <div className="card-body">
              <h1 className="card-title pricing-card-title">
                $2<small className="text-muted fw-light">/mo</small>
              </h1>
                <ul className="list-unstyled mt-3 mb-4">
                    <li>10 users included</li>
                    <li>2 GB of storage</li>
                    <li>Email support</li>
                    <li>Help center access</li>
                </ul>
              <button
                type="button"
                className="w-100 btn btn-lg btn-outline-primary" onClick = {votingHandler_2}>
                Vote to support
              </button>
            </div>
          </div>
        </div></>}



      </div>
      <h2 className="display-6 text-center mb-4">
        <b>Your Status</b>
      </h2>
      <h5 className="display-10 text-center mb-4">
        <div>
            {address == null && <h5>You are not connected</h5>}
        </div>
        <div>
            {address!=null && weight == 0 && <>You don`&apos;`t have the right to vote</>}
        </div>
        <div>
            {address != null && weight == 1 && voted == 1 && <>You have already voted</>}
        </div>
        
      </h5>
      <div className="display-6 text-center mb-4">
        <div>
            {address == null && <><button type="button" className="btn btn-secondary align-items-center" onClick={ConnectWalletHandler}>
          Click to Connect
        </button></>}
        </div>
        <div>
            {address!=null && weight == 0 && <><button type="button" className="btn btn-secondary align-items-center" onClick={getRightToVote}>
          Click to get Voting right
        </button></>}
        </div>
      </div>
      <div className="display-8 text-center mb-4">
      <h3>{voted == 0 && <></>}</h3>
        <h3>{voted == 1 && address != null &&  weight != 0 && <>{<>You voted {addressMap[addressDetails[3]]}</>}</>}</h3>
      </div>
      <hr />
      <div className="p-3 pb-md-5 mx-auto text-center">
        <h5 className="display-6 fw-light">About</h5>
        <p className="fs-5 text-muted">
          *This DeFi application is built using Web3.0 technology. It is a voluntarily voting ballot to collect the opinion of users on their favourite cryptocurrency.
          The highlighted box shows the most popular crypto chosen by users. First, You have to connect your account through Metamask on Rinkeby Testnet. It will then ask you to 
          get voting right by clicking the button. After you are notified for getting voting right through notification popup, you can vote for any of the cryptocurrency by clicking 
          the `&quot;`Vote to Support`&quot;` button. You will be notified if your vote has been casted succesfully through popup notification. 
          <br/>Ps- In case of a tie, the one which reaches the maximum support first is declared as current winner.
        </p>
      </div>
      
      <footer className="pt-4 my-md-5 pt-md-5 border-top">
        <div className="row">
          <div className=" col-md">
            <small className="d-block mb-3 text-muted">©2022- Pratham Chaurasia</small>
          </div>
          <div className="col-6 col-md">
            <h5>Connect with me Here</h5>
            <ul className="list-unstyled text-small">
              <li className="mb-1">
                <a className="link-secondary text-decoration-none" href="#">
                  Github
                </a>
              </li>
              <li className="mb-1">
                <a className="link-secondary text-decoration-none" href="#">
                  LinkedIn
                </a>
              </li>
              <li className="mb-1">
                <a className="link-secondary text-decoration-none" href="#">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  </div>
        {/* <Head>
        <title>Ballot App</title>
        <meta name="description" content="A blockchain vending machine app" />
        </Head> */}
        <nav className = "navbar mt-4 mb-4">
            <div className="container">
                <div className = "navbar-brand">
                    {/* <h1><b>Ballot</b></h1> */}
                    {/* <h1>Works on Rinkeby testnet</h1> */}
                </div>
                <div className = "navbar-brand">
                    {/* <button className='button is-primary' onClick={ConnectWalletHandler}>Connect</button> */}
                </div>
                <div className="navbar-brand">
                {/* <button className='button is-primary' onClick={EnableEthereumHandler}>Enable Ethereum</button> */}
                </div>
            </div>
        </nav>
        
        {/* <section>
            <div className="container has-text-success">
                <p>{successMsg}</p>
            </div>
        </section>

        <section>
            <div className="container has-text-success">
                <p>Winner is {winner}</p>
            </div>
        </section>

        <section>
            <div>
                <Frontpart name ="Pratham"/>
            </div>
        </section>

        <section>
            <div className="container has-text-danger">
                <p>{error}</p>
            </div>
        </section>
        <section>
            <h3>This is button</h3>
            <Button/>
        </section> */}

        {/* <section>
            <div>
            <h1>Proposals are</h1>
            {proposals.length != 0 && 
            <div>
            <h2>{proposals[0][0]}</h2>
            <h2>{proposals[1][0]}</h2>
            <h2>{proposals[2][0]}</h2>
            </div>
            }
            </div>
            

        </section> */}

        {/* <section>
            <div>
            <h1>your current details</h1>
            <h2>Voted- {voted}</h2>
            <h2>Right to vote {weight}</h2>
            <button className='button is-primary' onClick={votingHandler}>Vote</button>
            <button className='button is-primary' onClick={getRightToVote}>Get right to Vote</button>
            </div>
            

        </section> */}
        
        
        
        </div>
        
    )
}

//GO TO ADDRESS DETAILS HANDLER    
//use state is working unexpectedly
//refresh or wait for soe time
//go to 165 and add syntaxes 
//line 126 write function to vote
