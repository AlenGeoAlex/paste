import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { ThemeProvider } from 'styled-components';

import usePreference from '../hooks/usePreference';
import themes, { Themes } from '../style/themes';
import EditorControls from './EditorControls';
import EditorGlobalStyle from './EditorGlobalStyle';
import EditorTextArea from './EditorTextArea';

export interface EditorProps {
  forcedContent: string;
  actualContent: string;
  setActualContent: (value: string) => void;
  contentType?: string;
  pasteId?: string;
  storeType : 'public' | 'private'
}

export type ResetFunction = () => void;

export default function Editor({
    forcedContent,
    actualContent,
    setActualContent,
    contentType,
    pasteId,
    storeType
}: EditorProps) {
  const [language, setLanguage] = useState<string>('plain');
  const [readOnly, setReadOnly] = useState<boolean>(isMobile && !!pasteId);
  const resetFunction = useRef<ResetFunction>();
  const [theme, setTheme] = usePreference<keyof Themes>(
    'theme',
    'dark',
    pref => !!themes[pref]
  );
  const [fontSize, setFontSize, fontSizeCheck] = usePreference<number>(
    'fontsize',
    16,
    pref => pref >= 10 && pref <= 22
  );
  const [store, setStore] = usePreference<'public' | 'private'>(
      'store',
      'public',
      pref => pref === 'public' || pref === 'private'
  )

  useEffect(() => {
    if (contentType) {
      setLanguage(contentType);
    }
    if(storeType){
      setStore(storeType);
    }
  }, [contentType]);

  function zoom(delta: number) {
    const newFontSize = fontSize + delta;
    if (fontSizeCheck(newFontSize)) {
      setFontSize(newFontSize);
    }
  }

  return (
    <>
      <ThemeProvider theme={themes[theme]}>
        <EditorGlobalStyle />
        <EditorControls
          actualContent={actualContent}
          resetFunction={resetFunction}
          language={language}
          setLanguage={setLanguage}
          readOnly={readOnly}
          setReadOnly={setReadOnly}
          theme={theme}
          setTheme={setTheme}
          zoom={zoom}
          store={store}
          setStore={setStore}
        />
        <EditorTextArea
          forcedContent={forcedContent}
          actualContent={actualContent}
          setActualContent={setActualContent}
          theme={themes[theme]}
          language={language}
          fontSize={fontSize}
          readOnly={readOnly}
          resetFunction={resetFunction}
        />
      </ThemeProvider>
    </>
  );
}
