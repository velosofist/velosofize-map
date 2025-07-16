document.getElementById('legend-button').onclick = function() {
  document.getElementById('legend-overlay').style.display = 'flex';
};
document.getElementById('close-legend').onclick = function() {
  document.getElementById('legend-overlay').style.display = 'none';
};
document.getElementById('switch-language-legend').onclick = function() {
  const iframe = document.getElementById('legend-iframe');
  if (iframe.src.includes('/legend/bg/cyclosm_legend.html')) {
    iframe.src = '/legend/en/cyclosm_legend.html';
  } else {
    iframe.src = '/legend/bg/cyclosm_legend.html';
  }
};