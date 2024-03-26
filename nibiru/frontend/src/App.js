import './App.css'
import { Reclaim } from '@reclaimprotocol/js-sdk'
import { useState } from 'react'
import VerifyProof from './VerifyProof'
import ConnectButton from './ConnectButton'

function App() {
  const [url, setUrl] = useState('')
  const [ready, setReady] = useState(false);
  const [proof, setProof] = useState({});

  const reclaimClient = new Reclaim.ProofRequest('') //TODO: replace with your applicationId
 
  async function generateVerificationRequest() {
    const providerId = '' //TODO: replace with your provider ids you had selected while creating the application
    const APP_SECRET = "" //TODO : replace with your APP_SECRET
 
    await reclaimClient.addContext(
      (`user's address`),
      ('for acmecorp.com on 1st january')
    )
 
    await reclaimClient.buildProofRequest(providerId)
 
    reclaimClient.setSignature(
      await reclaimClient.generateSignature(
        APP_SECRET 
      )
    )
 
    const { requestUrl, statusUrl } =
      await reclaimClient.createVerificationRequest()
 
    setUrl(requestUrl)

    await reclaimClient.startSession({
      onSuccessCallback: proof => {
        console.log('Verification success', proof)
        setReady(true);
        setProof(proof[0]);
        // Your business logic here
      },
      onFailureCallback: error => {
        console.error('Verification failed', error)
        // Your business logic here to handle the error
      }
    })
  }
 
  return (
    <div className='App'>
      <ConnectButton/>
      <button onClick={() => generateVerificationRequest()}>
        Generate Verification Request
      </button>
      <button onClick={() => window.open(url, '_blank')}>Open link</button>
      {ready && <VerifyProof proof={proof}></VerifyProof>}
    </div>
  )
}
 
export default App