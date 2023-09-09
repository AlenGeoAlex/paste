import { gzip } from 'pako';
import MIMEType from 'whatwg-mimetype';
import {bytebinPrivateUrl, bytebinUrl, postUrl, privatePostUrl} from './constants';
import { languageIds } from './highlighting';

interface LoadResultSuccess {
  ok: true;
  content: string;
  type?: string;
  store : 'public' | 'private'
}

interface LoadResultFail {
  ok: false;
  content?: never;
  type?: never;
  store?: never;
}

export type LoadResult = LoadResultSuccess | LoadResultFail;

export async function loadFromBytebin(id: string, store : 'public' | 'private'): Promise<LoadResult> {
  try {
    const resp = await fetch(store === 'public' ? bytebinUrl : bytebinPrivateUrl + id);
    if (resp.ok) {
      const content = await resp.text();
      const type = contentTypeToLanguage(
        resp.headers.get('content-type') as string
      );

      document.title = 'pastes | ' + id;
      return { ok: true, content, type, store };
    } else {
      return { ok: false };
    }
  } catch (e) {
    return { ok: false };
  }
}

export async function load(id : string) : Promise<LoadResult> {
  var resp = await loadFromBytebin(id, 'private');
  if(!resp.ok){
    resp = await loadFromBytebin(id, 'public');
  }

  return resp;
}


export async function saveToBytebin(
  code: string,
  language: string,
  store : "private" | "public"
): Promise<string | null> {
  try {
    const compressed = gzip(code);
    const contentType = languageToContentType(language);

    const resp = await fetch(store === 'public' ? postUrl : privatePostUrl, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        'Content-Encoding': 'gzip',
        'Accept': 'application/json',
      },
      body: compressed,
    });

    if (resp.ok) {
      const json = await resp.json();
      return json.key;
    }
  } catch (e) {
    console.log(e);
  }
  return null;
}

export function contentTypeToLanguage(contentType: string) {
  const { type, subtype: subType } = new MIMEType(contentType);
  if (type === 'application' && subType === 'json') {
    return 'json';
  }
  if (type === 'text' && languageIds.includes(subType.toLowerCase())) {
    return subType.toLowerCase();
  }
}

export function languageToContentType(language: string) {
  if (language === 'json') {
    return 'application/json';
  } else {
    return 'text/' + language;
  }
}
