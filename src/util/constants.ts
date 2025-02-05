export const bytebinUrl =
  process.env.REACT_APP_BYTEBIN_URL || 'https://bytebin.lucko.me/';

export const bytebinPrivateUrl = process.env.REACT_APP_BYTEBIN_PRIVATE_URL || 'https://paste-api.alenalex.me/';

export const postUrl = bytebinUrl + 'post';
export const privatePostUrl = bytebinPrivateUrl + 'post';
