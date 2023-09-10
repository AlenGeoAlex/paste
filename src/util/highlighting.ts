export const languages = {
  config: ['yaml', 'json', 'xml', 'ini'],
  code: [
    'java',
    'javascript',
    'typescript',
    'python',
    'kotlin',
    'cpp',
    'csharp',
    'shell',
    'ruby',
    'rust',
    'sql',
    'go',
  ],
  web: ['html', 'css', 'php'],
  misc: ['plain', 'dockerfile', 'markdown'],
};

// missing following the rewrite: toml, properties, log, javastacktrace, groovy, haskell, protobuf
// would be good to add these back with custom language definitions

export const languageIds = Object.values(languages).flat(1);

export const expiryDuration : { [key: string]: number }  = {
  "1 day" : 1440,
  "2 days" : 2880,
  "5 days" : 7200,
  "10 days" : 14400,
  "20 days" : 28800,
  "30 days" : 43200,
  "60 days" : 86400,
  "90 days" : 129600,
  "No expiry" : -1
}
export const expiryDurationNames = Object.keys(expiryDuration).flat(1);

export function getDurationFor(duration: string): number {
  if (duration in expiryDuration) {
    return expiryDuration[duration];
  } else {
    return 43200;
  }
}


