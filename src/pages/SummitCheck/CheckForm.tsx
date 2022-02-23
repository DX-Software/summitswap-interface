import React, { useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Button } from '@summitswap-uikit'
import web3 from 'web3'
import { SUMMITCHECK_API } from '../../constants'

const Container = styled.div`
  width: 100%;
`
const Form = styled.form`
  display: flex;
`
const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 10px 20px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 30px 0 0 30px;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.menuItemBackground};
  -webkit-appearance: none;
  font-size: 16px;
  font-weight: 400;
  ::placeholder {
    color: rgba(255, 255, 255, 0.4);
    font-size: 16px;
    font-weight: 400;
  }
  transition: border 100ms;
  :focus {
    outline: none;
  }
`
const ResultsBox = styled.div`
  border-radius: 16px;
  background: #011724;
  box-shadow: inset 0px 2px 2px -1px rgb(74 74 104 / 10%);
  padding: 40px;
  font-weight: 600;
  font-size: 16px;
  margin: 15px 0;
  line-height: 16px;
  > p,
  > div > p {
    margin-bottom: 15px;
    line-height: 26px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    > span.value {
      text-transform: capitalize;
      padding: 5px;
      font-weight: bold;
      word-break: break-all;
      margin-left: auto;
    }
  }
`

const CheckForm: React.FunctionComponent = () => {
  const [term, setTerm] = useState('')
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [result, setResult] = useState<any>()

  const anaLyzeAddress = async () => {
    setLoading(true)
    setError(undefined)
    setResult(undefined)

    try {
      await web3.utils.toChecksumAddress(term)
    } catch (err) {
      setLoading(false)
      setError('Invalid address')
      return
    }

    let res;

    try {
      res = await axios(SUMMITCHECK_API, {
        params: {
          address: term,
        },
      })

      if (res.data === 'our servers are a little busy please retry again later ;)') {
        setError('Something went wrong')
      } else {
        setToken(term)
        setResult(res.data)
      }
    } catch (err) {
      setError('Something went wrong')
    }

    setLoading(false)
  }

  return (
    <Container>
      <Form onSubmit={(e) => e.preventDefault()}>
        <SearchInput
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          type="text"
          placeholder="Enter address"
          className="input"
          autoFocus
        />
        <Button
          onClick={anaLyzeAddress}
          style={{ borderRadius: '0 33px 33px 0' }}
          type="submit"
          className="btn"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </Form>

      {!!result && (
        <div id="result">
          <ResultsBox style={{ fontSize: '0.9rem' }}>
            <p>
              <span>Token Address:</span>
              <span className="value">{token}</span>
            </p>
            <p>
              <span>Non Transfer ratio:</span>
              <span className="value">{result.non_transfers_ratio.toFixed(3)}</span>
            </p>
            <p>
              <span>Fail Ratio:</span>
              <span className="value">{result.failRatio.toFixed(3)}</span>
            </p>
            <p>
              <span>Non Transfer Ratio mean deviation:</span>
              <span className="value">{result.non_transfers_mean_deviation.toFixed(3)}</span>
            </p>
            <p>
              <span style={{ maxWidth: '80%' }}>
                Reverse Likelihood (Token being used by Addresses more than other normal addresses):
              </span>
              <span className="value">{result.revLikelihood.toFixed(3)}</span>
            </p>
            <p>
              <span>Script verified:</span>
              <span className="value">{result.verified === '1' ? 'true' : 'false'}</span>
            </p>

            <p>
              <span>Scam Score:</span>
              <span className="value">{result.scamScore}</span>
            </p>
            <p>
              <span>Result:</span>
              <span className="value">{result.conclusion}</span>
            </p>
          </ResultsBox>
        </div>
      )}

      {!!error && <ResultsBox>{error}</ResultsBox>}
    </Container>
  )
}

export default CheckForm
