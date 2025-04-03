import { getInputs, Inputs } from '../src/inputs.js'
import * as core from '@actions/core'

jest.mock('@actions/core')

describe('getInputs', () => {
  it('returns the token input', () => {
    jest.spyOn(core, 'getInput').mockReturnValueOnce('test-token')

    const inputs: Inputs = getInputs()

    expect(inputs).toEqual({ token: 'test-token' })
    expect(core.getInput).toHaveBeenCalledWith('token', { required: true })
  })
})
