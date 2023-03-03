import {createContext, useReducer} from 'react'

import {askOpenAI} from '@/io'
import useConfig from '@/hooks/use-config'
import {gettext, getSelectedText, toast} from '@/utils'

export const AIContext = createContext({ai: null, aiDispatch: null})

export const AI_REDUCER_ACTION_TYPE = {
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  SET_RESULT: 'SET_RESULT',
}

const initialState = {
  loading: false,
  error: null,
  result: null,
}

export function withAIContext(Component) {
  return function WithAIContext(props) {
    const [ai, aiDispatch] = useReducer(reducer, initialState)

    const {config, setConfig} = useConfig()

    const askAI = async ({authKey, command, onlyCommand = false}) => {
      let selectedText = ''

      if (!onlyCommand) {
        try {
          selectedText = await getSelectedText()
        } catch (e) {}

        if (!selectedText.trim()) {
          return toast.error(gettext('Please select any text on the webpage first'))
        }
      }

      aiDispatch({type: AI_REDUCER_ACTION_TYPE.REQUEST})

      return askOpenAI({
        authKey: authKey || config.authKey,
        model: config.model,
        prompt: `${command}:\n\n${selectedText}\n\n`,
      })
        .then(res => {
          const result = onlyCommand ? '' : res
          aiDispatch({type: AI_REDUCER_ACTION_TYPE.SUCCESS, payload: {result}})
          return result
        })
        .catch(err => {
          aiDispatch({type: AI_REDUCER_ACTION_TYPE.FAILURE, payload: err})

          if (err.response && err.response.status === 401) {
            toast.error(gettext('Auth key not available, please reset'))
          } else {
            toast.error(err?.response?.data?.error?.message || '')
          }

          setConfig({...config, isAuth: false})
          throw err
        })
    }

    const context = {ai, askAI, aiDispatch}

    return (
      <AIContext.Provider value={context}>
        <Component {...props} />
      </AIContext.Provider>
    )
  }
}

function reducer(state, action) {
  switch (action.type) {
    case AI_REDUCER_ACTION_TYPE.REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        result: gettext('Generating content, takes about 10 seconds'),
      }

    case AI_REDUCER_ACTION_TYPE.SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        result: action.payload.result,
      }

    case AI_REDUCER_ACTION_TYPE.FAILURE:
      return {
        ...state,
        loading: false,
        error: {
          ...action.payload,
        },
        result: null,
      }

    case AI_REDUCER_ACTION_TYPE.SET_RESULT:
      return {
        ...state,
        result: action.payload.result,
      }
  }
}