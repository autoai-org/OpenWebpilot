import {OCF_API} from '@/config'

let prevAbortController = null

export async function askOCF({authKey, model, prompt}) {
  model.messages = [{role: 'user', content: prompt}]
  model.stream = true
  let chatml_prompt =
    '<|im_start|>system\nA conversation between a user and an LLM-based AI assistant. The assistant gives helpful and honest answers.<|im_end|>\n'
  chatml_prompt += '<|im_start|>user\n' + prompt + '<|im_end|>\n<|im_start|>assistant\n'
  const abortController = new AbortController()

  if (prevAbortController) {
    prevAbortController.abort()
  }

  prevAbortController = abortController

  return fetch(OCF_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // ignored for now
      // Authorization: `Bearer ${authKey}`,
    },
    body: JSON.stringify({
      model_name: model.model,
      params: {
        prompt: chatml_prompt,
        temperature: model.temperature,
        top_p: model.top_p,
      },
    }),
    signal: abortController.signal,
  }).then(async response => {
    if (response.ok) {
      try {
        let data = await response.json()
        data = JSON.parse(data.data).output
        data.text = data.text.replace(chatml_prompt, '')
        // split by <|im_end|> and take the first one
        data.text = data.text.split('<|im_end|>')[0]
        return data
      } catch (e) {
        console.log(e)
      }
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({response})
    }
  })
}

export async function parseStream(streamReader, onUpdate = () => null) {
  const decoder = new TextDecoder()
  let text = ''

  while (true) {
    const {done, value} = await streamReader.read()

    if (done) return text

    const chunk = decoder.decode(value, {stream: true})
    const dataStrList = chunk.split('\n\n')

    dataStrList.forEach(dataStr => {
      const dataJson = dataStr.replace(/^data:/, '').trim()
      try {
        const data = JSON.parse(dataJson)
        const content = data?.choices[0]?.delta?.content
        if (!content) return

        text += content

        onUpdate(text)
      } catch (e) {}
    })
  }
}
