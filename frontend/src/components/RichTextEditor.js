import {useEffect, useState} from "react";
import {EditorState, convertToRaw} from "draft-js";
import {Editor} from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import "../css/RichTextEditor.scss"

export default function RichTextEditor(props) {
    const [state, setState] = useState(() => EditorState.createEmpty());

    const onUpdate = props.onUpdate;
    useEffect(() => {
        onUpdate(draftToHtml(convertToRaw(state.getCurrentContent())));
    }, [state, onUpdate]);

    return (
      <div className="rich-text-editor">
        <Editor
          editorState={state}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          placeholder="Description"
          onEditorStateChange={(newState) => setState(newState)}
          handleReturn={() => setState(EditorState.createEmpty())}
        />
      </div>
    );
}
