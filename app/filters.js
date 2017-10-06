export function image(path) {
  return IMAGES[path];
}

export function resize (url, w, h) {
  if (DEBUG) {
    return url;
  }
  
  return `https://pytx.imgix.net${url}?w=${w}&h=${h}`;
}
