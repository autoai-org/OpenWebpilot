import '@assets/styles/base.scss'
import 'react-toastify/dist/ReactToastify.css'
import {Tabs, TabList, Tab, TabPanel} from 'react-tabs'
import {ToastContainer} from 'react-toastify'

import css from 'styled-jsx/css'

import LogoTextIcon from 'data-base64:~assets/images/logo.png'

import useConfig from '@/hooks/use-config'
import {withAIContext} from '@/components/with-ai-context'

import {gettext} from '@/utils'

import PromptSetting from './prompt-setting'
import PromptAdd from './prompt-add'
import About from './about'
import Advanced from './advanced'

export default withAIContext(function Options() {
  const {config, setConfig} = useConfig()
  const {prompts} = config

  const handlePromptChange = (newPrompt, index) => {
    prompts[index] = newPrompt
    setConfig({
      ...config,
      prompts,
    })
  }

  const handleAddNewPrompt = () => {
    setConfig({
      ...config,
      prompts: [
        ...config.prompts,
        {
          title: gettext('Code Review'),
          command: gettext('Please review these codes and provide feedback.'),
        },
      ],
    })
  }

  const handleDeletePrompt = (index: number) => {
    prompts.splice(index, 1)
    setConfig({
      ...config,
      prompts,
    })
  }

  const handleMove = (direction: 'up' | 'down', index: number) => {
    if (direction === 'up') {
      if (index <= 0) return
      prompts.splice(index - 1, 0, prompts.splice(index, 1)[0])
    } else if (direction === 'down') {
      if (index === prompts.length) return
      prompts.splice(index + 1, 0, prompts.splice(index, 1)[0])
    }

    setConfig({
      ...config,
      prompts,
    })
  }

  const loseFocus = event => {
    event.target.blur()
  }

  return (
    <section className="container">
      <section className="body">
        <main>
          <section className="header">
            <img src={LogoTextIcon} alt="" />
            <span className="slogan">{gettext('Opensource_ai_assistant_on_all_websites')}</span>
          </section>

          <Tabs>
            <TabList className="custom-list">
              <Tab className="custom-tab" onClick={loseFocus}>
                Prompts
              </Tab>
              <Tab className="custom-tab" onClick={loseFocus}>
                Advanced
              </Tab>
              <Tab className="custom-tab" onClick={loseFocus}>
                About
              </Tab>
            </TabList>

            <TabPanel>
              <section className="prompts">
                {prompts.map((item, index) => {
                  return (
                    <PromptSetting
                      key={index}
                      prompt={item}
                      onMoveUp={() => handleMove('up', index)}
                      onMoveDown={() => handleMove('down', index)}
                      onChange={p => handlePromptChange(p, index)}
                      onDelete={() => handleDeletePrompt(index)}
                    />
                  )
                })}
              </section>
              {prompts.length >= 4 ? null : <PromptAdd onClick={handleAddNewPrompt} />}
            </TabPanel>
            <TabPanel>
              <Advanced />
            </TabPanel>
            <TabPanel>
              <About />
            </TabPanel>
          </Tabs>
        </main>
        <footer>
          <span><a href='https://github.com/autoai-org/openwebpilot'>Limmat</a> is an open source fork of </span>
          <a href="https://github.com/Fluentify-IO/Fluentify" target="_blank" rel="noreferrer">
            Web Pilot
          </a>
          Compute service provided by <a href="https://ocf.autoai.org/" target="_blank" rel="noreferrer">Open Compute Framework</a>
        </footer>
      </section>

      <ToastContainer />

      <style jsx>{styles}</style>
      <style jsx global>
        {globalStyles}
      </style>
    </section>
  )
})

const styles = css`
  .container {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 100%;
    height: 100vh;
  }

  .body {
    display: flex;
    flex-direction: column;
    width: calc(100vw - 18px);
    max-width: 1438px;
    height: calc(100vh - 18px);
    padding: 24px 16px 16px;
    overflow-y: scroll;
    background: rgb(255 255 255 / 60%);
    border: 1px solid #fff;
    border-radius: 20px 20px 0 0;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    main {
      flex: 1;
    }

    .header {
      display: flex;
      align-items: flex-end;
      margin-bottom: 32px;

      .slogan {
        margin-left: 24px;
        padding-bottom: 10px;
        color: #777;
        font-weight: 400;
        font-size: 18px;
        line-height: 25px;
      }
    }

    footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      line-height: 25px;

      span {
        margin-top: 32px;
        color: #929497;
      }

      a {
        color: #4f5aff;
        text-decoration: none;
      }
    }
  }

  .prompts {
    margin-top: 28px;
  }

  @media (max-width: 820px) {
    .slogan {
      display: none;
    }
  }

  .custom-tablist {
    display: flex;
    height: 34px;
    margin-top: 50px;
    padding: 0 12px;
    background-color: red;

    .tab {
      position: relative;
      margin-right: 48px;
      color: #000;
      font-size: 24px;

      &::after {
        position: absolute;
        display: block;
        width: 100px;
        height: 4px;
        background-color: #4128d3;
        border-radius: 2px;
        content: '';
      }
    }
  }
`

const globalStyles = css.global`
  body {
    width: 100%;
    height: 100vh;
    background: linear-gradient(150.76deg, #efdaff 12.93%, #b28aff 64.87%, #6f63ff 108.73%);
  }

  .prompt-item + .prompt-item {
    margin-top: 16px;
  }
  .custom-list {
    display: flex;
    list-style: none;
    padding-left: 4px;
    .custom-tab {
      margin-right: 48px;
      font-weight: 400;
      font-size: 24px;
      line-height: 34px;
      cursor: pointer;
    }
    .react-tabs__tab--selected {
      font-weight: 600;
      color: #4f5aff;
      border-bottom: 4px solid #4f5aff;
    }
  }
`
