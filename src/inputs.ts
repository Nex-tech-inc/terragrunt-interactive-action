import * as core from '@actions/core'

export type Inputs = {
  token: string
}

export const getInputs = (): Inputs => {
  const token = core.getInput('token', { required: true })

  const inputs: Inputs = {
    token
  }
  return inputs
}
