function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

if (isIOS()) {
  document.getElementById('fullscreen-button').style.display = 'none';
}