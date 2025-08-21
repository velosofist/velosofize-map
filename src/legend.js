document.getElementById('close-legend-button').onclick = function() {
  document.getElementById('legend-overlay').style.display = 'none';
};

document.getElementById('switch-language-legend-button').onclick = function() {
  const iframe = document.getElementById('legend-iframe');
  if (iframe.src.includes('/legend/bg/legend.html')) {
    iframe.src = '/legend/en/legend.html';
  } else {
    iframe.src = '/legend/bg/legend.html';
  }
};