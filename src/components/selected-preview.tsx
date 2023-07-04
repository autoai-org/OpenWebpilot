import css from 'styled-jsx/css'

import {gettext} from '@/utils'

export default function SelectedPreview({selectedText = ''}) {
  return (
    <p className="preview">
      {gettext('With_the_select_content')} "<span className="selected-text">{selectedText}</span>",{' '}
      {gettext('What_do_you_want')}
      <style jsx> {styles}</style>
    </p>
  )
}

const styles = css`
  .preview {
    display: flex;
    align-items: flex-end;
    margin-top: 14px;
    color: #000;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;

    .selected-text {
      display: inline-block;
      max-width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
`
