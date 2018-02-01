export function image(path) {
  return IMAGES[path];
}

export function resize(url, w, h) {
  if (url.indexOf("gravatar") > -1) {
    return url.replace("s=256", "s=" + w);
  }

  if (DEBUG) {
    return url;
  }

  url = url.replace("https://pytexas.s3.amazonaws.com", "");

  return `https://pytx.imgix.net${url}?w=${w}&h=${h}`;
}

export function time(dt) {
  return dt.toLocaleTimeString();
}
