import { useEffect, useState } from 'react';
import Editor from './components/Editor';
import {load} from './util/storage';

const INITIAL = Symbol();
const LOADING = Symbol();
const LOADED = Symbol();

type LoadingState = typeof INITIAL | typeof LOADING | typeof LOADED;

export default function App() {
  const [pasteId] = useState<string | undefined>(getPasteIdFromUrl);
  const [state, setState] = useState<LoadingState>(INITIAL);
  const [forcedContent, setForcedContent] = useState<string>('');
  const [actualContent, setActualContent] = useState<string>('');
  const [contentType, setContentType] = useState<string>();
  const [store, setStore] = useState<'public' | 'private'>("public");

  function setContent(content: string) {
    setActualContent(content);
    setForcedContent(content);
  }

  useEffect(() => {
    if (pasteId && state === INITIAL) {
      setState(LOADING);
      setContent('Loading...');

      load(pasteId).then(({ ok, content, type, store }) => {
        if (ok) {
          setContent(content);
          if (type) {
            setContentType(type);
          }
          if(store){
            setStore(store);
          }
        } else {
          setContent(get404Message(pasteId));
        }
        setState(LOADED);
      });
    }
  }, [pasteId, state]);

  return (
    <Editor
      forcedContent={forcedContent}
      actualContent={actualContent}
      setActualContent={setActualContent}
      contentType={contentType}
      pasteId={pasteId}
      storeType={store}
    />
  );
}

function get404Message(pasteId: string) {
  return `
  ██╗  ██╗ ██████╗ ██╗  ██╗
  ██║  ██║██╔═████╗██║  ██║
  ███████║██║██╔██║███████║
  ╚════██║████╔╝██║╚════██║
       ██║╚██████╔╝     ██║
       ╚═╝ ╚═════╝      ╚═╝

  not found: '${pasteId}'
  maybe the paste expired?
`;
}

function getPasteIdFromUrl() {
  const path = window.location.pathname;
  if (path && /^\/[a-zA-Z0-9]+$/.test(path)) {
    return path.substring(1);
  } else {
    return undefined;
  }
}
