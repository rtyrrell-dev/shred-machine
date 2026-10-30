// HTML for the print-to-PDF popup. Every interpolated value is escaped so
// text can never become markup in this page's origin.
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ESCAPES[c]);
}

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function buildPrintHtml({ color, nc, label, bpm, isLead, tab }) {
  return `<html><head><title>SHRED MACHINE</title><style>body{background:#000;color:#eee;font-family:monospace;padding:2rem;}h1{color:${color};font-size:1.3rem;}p{color:#888;font-size:.8rem;margin:0 0 1rem;}pre{font-size:.85rem;line-height:1.8;color:${nc};}</style></head><body><h1>⚡ SHRED MACHINE</h1><p>${escapeHtml(label)} | ${escapeHtml(bpm)} BPM | ${isLead?'LEAD':'RHYTHM'}</p><pre>${escapeHtml(tab)}</pre></body></html>`;
}
