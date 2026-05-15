import { useState, useRef, useEffect, useCallback } from "react";
import EVH  from './guitarists/evh.js';
import DEM  from './guitarists/demartini.js';
import LNCH from './guitarists/george-lynch.js';
import JADE from './guitarists/puget.js';
import IAN  from './guitarists/ian-dsa.js';

const STYLES = `@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap'); @keyframes flicker{0%,100%{opacity:1}93%{opacity:.7}94%{opacity:1}97%{opacity:.9}} @keyframes pulse-pink{0%,100%{text-shadow:0 0 8px #ff2d78,0 0 20px #ff2d78}50%{text-shadow:0 0 18px #ff2d78,0 0 40px #ff2d78,0 0 60px #ff2d78}} @keyframes pulse-cyan{0%,100%{text-shadow:0 0 8px #00f5ff,0 0 20px #00f5ff}50%{text-shadow:0 0 18px #00f5ff,0 0 40px #00f5ff,0 0 60px #00f5ff}} @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} .root{background:#000;min-height:100vh;font-family:'Share Tech Mono',monospace;color:#eee;padding:0 0 2rem;position:relative;} .scanlines{position:fixed;top:0;left:0;right:0;bottom:0;pointer-events:none;z-index:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px);} .logo{font-family:'Orbitron',sans-serif;font-weight:900;font-size:clamp(1.6rem,4.5vw,3rem);text-align:center;letter-spacing:.12em;color:#fff;animation:flicker 5s infinite;padding:1.2rem 0 .2rem;text-shadow:0 0 10px #ff2d78,0 0 30px #ff2d78,0 0 5px #fff;} .tagline{text-align:center;font-size:.65rem;letter-spacing:.3em;color:#666;margin-bottom:.8rem;text-transform:uppercase;} .guitarist-bar{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;padding:.4rem 1rem .8rem;position:relative;z-index:1;} .g-btn{font-family:'Share Tech Mono',monospace;font-size:.6rem;letter-spacing:.08em;padding:.25rem .5rem;border:1px solid #444;border-radius:2px;background:transparent;color:#888;cursor:pointer;text-transform:uppercase;transition:all .15s;} .g-btn:hover{border-color:#aaa;color:#eee;} .g-btn.sel{border-color:var(--gc);color:var(--gc);background:color-mix(in srgb,var(--gc) 15%,transparent);} .g-btn.random-btn{border-color:#b44fff;color:#b44fff;} .sel-hint{font-size:.58rem;color:#555;text-align:center;letter-spacing:.1em;margin-bottom:.5rem;} .panels{display:grid;grid-template-columns:1fr 1fr;gap:1rem;padding:0 .8rem;position:relative;z-index:1;} @media(max-width:680px){.panels{grid-template-columns:1fr}} .panel{border:1px solid;border-radius:4px;padding:.9rem;background:rgba(0,0,0,.85);} .panel-lead{border-color:#ff2d78;box-shadow:0 0 12px rgba(255,45,120,.25),inset 0 0 20px rgba(255,45,120,.04);} .panel-rhythm{border-color:#00f5ff;box-shadow:0 0 12px rgba(0,245,255,.25),inset 0 0 20px rgba(0,245,255,.04);} .panel-title{font-family:'Orbitron',sans-serif;font-size:.9rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;margin-bottom:.25rem;} .tl{color:#ff2d78;animation:pulse-pink 2.5s ease-in-out infinite;} .tr{color:#00f5ff;animation:pulse-cyan 2.5s ease-in-out infinite;} .panel-sub{font-size:.58rem;letter-spacing:.12em;color:#555;margin-bottom:.7rem;text-transform:uppercase;} .gen-btn{width:100%;padding:.5rem 0;font-family:'Orbitron',sans-serif;font-size:.72rem;font-weight:700;letter-spacing:.12em;border-radius:3px;cursor:pointer;text-transform:uppercase;transition:all .15s;border:1px solid;} .gen-l{background:rgba(255,45,120,.1);color:#ff2d78;border-color:#ff2d78;} .gen-l:hover{background:rgba(255,45,120,.22);box-shadow:0 0 14px rgba(255,45,120,.4);} .gen-r{background:rgba(0,245,255,.08);color:#00f5ff;border-color:#00f5ff;} .gen-r:hover{background:rgba(0,245,255,.18);box-shadow:0 0 14px rgba(0,245,255,.4);} .meta{display:flex;align-items:center;gap:.4rem;margin:.6rem 0 .3rem;font-size:.65rem;flex-wrap:wrap;} .badge{padding:2px 7px;border-radius:2px;font-size:.6rem;letter-spacing:.08em;} .bl{background:rgba(255,45,120,.18);color:#ff2d78;border:1px solid rgba(255,45,120,.45);} .br{background:rgba(0,245,255,.12);color:#00f5ff;border:1px solid rgba(0,245,255,.35);} .beat-dots{display:flex;gap:5px;align-items:center;margin-left:auto;} .dot{width:9px;height:9px;border-radius:50%;border:1px solid;transition:background .06s;} .dl{border-color:#ff2d78;}.dl.on{background:#ff2d78;box-shadow:0 0 7px #ff2d78;} .dr{border-color:#00f5ff;}.dr.on{background:#00f5ff;box-shadow:0 0 7px #00f5ff;} .prog-wrap{height:3px;background:#111;border-radius:2px;margin:.45rem 0 .35rem;overflow:hidden;} .prog{height:100%;border-radius:2px;} .pl{background:linear-gradient(90deg,#ff2d78,#ff6bab);} .pr{background:linear-gradient(90deg,#00f5ff,#7ef5ff);} .tab-box{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:3px;padding:.55rem .45rem;margin:.4rem 0;font-family:'Share Tech Mono',monospace;font-size:clamp(.54rem,1.3vw,.7rem);line-height:1.65;overflow-x:auto;min-height:85px;white-space:pre;} .tab-l{color:#ff8ab8;}.tab-r{color:#7ef5ff;} .ctrl{display:flex;gap:.4rem;margin-top:.55rem;flex-wrap:wrap;} .cb{padding:.25rem .6rem;font-size:.6rem;font-family:'Share Tech Mono',monospace;border-radius:2px;cursor:pointer;letter-spacing:.07em;border:1px solid;background:transparent;transition:all .15s;text-transform:uppercase;} .cbl{color:#ff2d78;border-color:rgba(255,45,120,.45);}.cbl:hover{background:rgba(255,45,120,.13);} .cbl.on{background:rgba(255,45,120,.22);box-shadow:0 0 7px rgba(255,45,120,.35);} .cbr{color:#00f5ff;border-color:rgba(0,245,255,.35);}.cbr:hover{background:rgba(0,245,255,.1);} .cbr.on{background:rgba(0,245,255,.18);box-shadow:0 0 7px rgba(0,245,255,.28);} .cb:disabled{opacity:.3;cursor:not-allowed;} .type-tag{font-size:.62rem;padding:1px 6px;border-radius:2px;}`;

// ── Tunings ───────────────────────────────────────────────────────────────────
const STD   = [40,45,50,55,59,64]; // E A D G B e
const DROPD = [38,45,50,55,59,64]; // D A D G B e
const SNAMES = { std:["e","B","G","D","A","E"], dropd:["e","B","G","D","A","D"] };

// ── Guitarists ────────────────────────────────────────────────────────────────
const GUITARISTS = [
  {id:"evh",  name:EVH.name,  band:EVH.band,  color:EVH.color},
  {id:"dem",  name:DEM.name,  band:DEM.band,  color:DEM.color},
  {id:"lnch", name:LNCH.name, band:LNCH.band, color:LNCH.color},
  {id:"jade", name:JADE.name, band:JADE.band,  color:JADE.color},
  {id:"ian",  name:IAN.name,  band:IAN.band,  color:IAN.color},
  {id:"rnd",  name:"Random",  band:"",         color:"#aaaaaa"},
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const ri   = n => Math.floor(Math.random()*n);
const pick = a => a[ri(a.length)];
const coin = p => Math.random()<(p??0.5);
const midiHz = m => 440*Math.pow(2,(m-69)/12);
const gf = (midi,s,open) => { const f=midi-open[s]; return f>=0&&f<=22?f:null; };
const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));

// Scale intervals (semitones from root)
const PENTA  = [0,3,5,7,10];
const BLUES  = [0,3,5,6,7,10];
const HARM   = [0,2,3,5,7,8,11];
const AEOL   = [0,2,3,5,7,8,10];
const PHRYG  = [0,1,3,5,7,8,10];

// Notes in a 4-fret position window on specific strings
function posNotes(scale, root, pos, open, strs=[0,1,2,3,4,5]) {
  const out=[]; const seen=new Set();
  for(const s of strs) {
    for(const iv of scale) {
      for(const oct of [0,12,-12,24]) {
        const midi=root+iv+oct;
        const f=gf(midi,s,open);
        if(f!==null && f>=pos && f<=pos+4) {
          const k=`${s}-${f}`;
          if(!seen.has(k)) { seen.add(k); out.push({str:s,fret:f,midi}); }
        }
      }
    }
  }
  return out.sort((a,b)=>a.fret-b.fret||a.str-b.str);
}

// ── TAB builder ───────────────────────────────────────────────────────────────
function buildTab(events, open) {
  const COLS=64;
  const isDropD = open[0]===DROPD[0];
  const names = isDropD ? SNAMES.dropd : SNAMES.std;
  const rows = Array.from({length:6},()=>Array(COLS).fill('-'));
  const deco = Array.from({length:6},()=>Array(COLS).fill(''));
  events.forEach(({col,str,fret,d=''})=>{
    if(col<0||col>=COLS||fret<0||fret>22) return;
    const fs=String(fret);
    rows[str][col]=fs[0];
    if(fs.length>1&&col+1<COLS) rows[str][col+1]=fs[1];
    if(d&&col+fs.length<COLS) deco[str][col+fs.length]=d;
  });
  const CPM=16;
  return rows.map((row,si)=>{
    const m=row.map((ch,ci)=>deco[si][ci]||ch);
    let s=names[5-si]+'|';
    for(let i=0;i<4;i++) s+=m.slice(i*CPM,(i+1)*CPM).join('')+'|';
    return s;
  }).reverse().join('\n');
}

function toAudio(events,bpm,open) {
  const s16=60/bpm/4; const seen=new Set();
  return events
    .filter(({col,str})=>{const k=`${col}-${str}`;if(seen.has(k))return false;seen.add(k);return true;})
    .map(({col,str,fret})=>({t:col*s16,hz:midiHz(open[str]+fret)}))
    .filter(e=>e.hz>20&&isFinite(e.hz));
}

// ── Power chord helpers ───────────────────────────────────────────────────────
function pwrE(rf,open,dd) {
  if(dd&&rf<=14) return[[0,rf],[1,rf],[2,rf]];
  return[[0,rf],[1,clamp(rf+2,0,22)],[2,clamp(rf+2,0,22)]];
}
function pwrA(rf,open) {
  return[[1,rf],[2,clamp(rf+2,0,22)],[3,clamp(rf+2,0,22)]];
}
function addPwr(ev,col,ch){ ch.forEach(([s,f])=>ev.push({col,str:s,fret:f})); }

// ════════════════════════════════════════════════════════════════════════════════
// GUITARIST GENERATORS
// ════════════════════════════════════════════════════════════════════════════════

// ── EVH ──────────────────────────────────────────────────────────────────────
function evh_lead(root,open) {
  const type=pick(['tap','scale','triads_lead']);

  if(type==='tap') {
    const [hi,lo,mid]=pick(EVH.tapPatterns); // profile: [tap, pull, hammer]
    const str=pick(EVH.tapStrings);
    if(hi>22) return null;
    const groupSize=pick(EVH.tapGroupSizes);
    const ev=[];
    for(let col=0;col<64;col+=groupSize) {
      if(col+4>=64) break;
      ev.push({col,str,fret:hi,d:'p'});
      ev.push({col:col+2,str,fret:mid,d:'h'});
      ev.push({col:col+4,str,fret:lo});
      if(coin(0.4)&&col+6<64) {
        const cf=gf(root+pick([7,10,12]),pick([4,5]),open);
        if(cf!==null) ev.push({col:col+6,str:pick([4,5]),fret:cf,d:'~'});
      }
    }
    return{events:ev,label:`EVH Tap (${lo}-${mid}-${hi})`};
  }

  if(type==='scale') {
    const pos=pick(EVH.leadPositions);
    const ivs=EVH.scales.evhOctatonic;
    const phrase=[];
    const strOrder=coin()?[3,4,5]:[5,4,3];
    strOrder.forEach(str=>ivs.forEach(iv=>{
      const f=gf(root+iv,str,open);
      if(f!==null&&f>=pos&&f<=pos+4) phrase.push({str,fret:f});
    }));
    if(phrase.length<5) return null;
    const seq=coin()?[...phrase,...[...phrase].reverse()]:[...phrase];
    const ev=[]; let col=0;
    seq.forEach((n,i)=>{ if(col<64){ev.push({col,str:n.str,fret:n.fret,d:i>0&&n.str===seq[i-1].str?'h':''});col+=2;} });
    while(col<64){ const n=seq[(col/2)%seq.length]; ev.push({col,str:n.str,fret:n.fret}); col+=2; }
    return{events:ev,label:`EVH Scale (pos ${pos})`};
  }

  // triads_lead
  const pos=pick(EVH.leadPositions);
  const triads=[[0,4,7],[0,3,7],[0,4,8]];
  const triad=pick(triads);
  const ev=[]; let col=0;
  for(let rep=0;rep<4&&col<62;rep++) {
    const dir=coin()?triad:[...triad].reverse();
    dir.forEach(iv=>{
      for(const s of [3,4,5]) {
        const f=gf(root+iv,s,open);
        if(f!==null&&f>=pos&&f<=pos+4&&col<62){
          ev.push({col,str:s,fret:f,d:col>0&&coin(0.3)?'h':''});
          col+=pick([2,2,3]);
          break;
        }
      }
    });
    if(col<60) ev.push({col:col-1,str:ev[ev.length-1].str,fret:ev[ev.length-1].fret,d:'~'});
  }
  while(col<64){ev.push({...ev[ev.length-1],col});col+=2;}
  return{events:ev,label:`EVH Triad Run (pos ${pos})`};
}

function evh_rhythm(root,open,dd) {
  const type=pick(['mixo','pedal_triad','chug']);

  if(type==='mixo') {
    const rootF=gf(root,1,open)??3;
    const moves=[
      [rootF, Math.max(0,rootF-2), Math.max(0,rootF-4), Math.max(0,rootF-2)],
      [rootF, Math.min(22,rootF+5), Math.min(22,rootF+7), rootF],
      [rootF, Math.max(0,rootF-2), rootF, Math.min(22,rootF+3)],
    ];
    const seq=pick(moves);
    const pat=pick(EVH.rhythmPatterns);
    const ev=[];
    for(let m=0;m<4;m++){
      const rf=seq[m%seq.length];
      pat.forEach(off=>addPwr(ev,m*16+off,pwrA(clamp(rf,0,22),open)));
    }
    return{events:ev,label:'EVH Mixolydian'};
  }

  if(type==='pedal_triad') {
    const pos=pick([2,3,5,7]);
    const shapes=[
      [[3,pos+2],[4,pos],[5,pos+3]],
      [[3,pos+4],[4,pos+2],[5,pos]],
      [[3,pos+1],[4,pos+3],[5,pos+2]],
      [[3,pos],[4,pos+2],[5,pos+4]],
    ].map(t=>t.filter(([,f])=>f>=0&&f<=22));
    const pat=pick(EVH.rhythmPatterns);
    const ev=[];
    for(let m=0;m<4;m++){
      const sh=shapes[m%shapes.length];
      for(let c=0;c<16;c+=2) ev.push({col:m*16+c,str:0,fret:0});
      pat.forEach(off=>sh.forEach(([s,f])=>ev.push({col:m*16+off,str:s,fret:f})));
    }
    return{events:ev,label:'EVH Triad/Pedal'};
  }

  // chug
  const rootF=gf(root,0,open)??0;
  const accents=[Math.min(22,rootF+5),Math.min(22,rootF+7),Math.min(22,rootF+3),Math.max(0,rootF-2)];
  const ev=[];
  for(let m=0;m<4;m++){
    const acc=accents[m%accents.length];
    for(let i=0;i<8;i++){
      const col=m*16+i*2;
      ev.push({col,str:0,fret:rootF});
      ev.push({col,str:1,fret:clamp(rootF+2,0,22)});
      if(i===4||i===6) {
        ev.push({col,str:2,fret:clamp(acc+2,0,22)});
        ev.push({col,str:0,fret:acc});
      }
    }
  }
  return{events:ev,label:'EVH Chug/Accent'};
}

// ── DeMartini / Ratt ──────────────────────────────────────────────────────────
function dem_lead(root,open) {
  const type=pick(['burst','harmony','box_shift','blues_phrase']);

  if(type==='burst') {
    const pos=pick(DEM.leadPositions);
    const slow=posNotes(BLUES,root,pos,open,[2,3,4,5]);
    const fast=posNotes(PENTA,root,pos,open,[2,3,4,5]);
    if(!slow.length||!fast.length) return null;
    const ev=[];
    const slowCols=pick([[0,4,8,12,16,20,24,28],[0,3,6,9,12,16,20,24],[0,6,12,18,24,28]]);
    slowCols.forEach((c,i)=>{ const n=slow[i%slow.length]; ev.push({col:c,str:n.str,fret:n.fret,d:i%3===2?'~':''}); });
    for(let c=32,i=0;c<64;c+=2,i++){ const n=fast[i%fast.length]; ev.push({col:c,str:n.str,fret:n.fret}); }
    return{events:ev,label:`DeMartini Burst (pos ${pos})`};
  }

  if(type==='harmony') {
    const pos=pick(DEM.leadPositions);
    const [lowerStr,upperStr]=pick(DEM.harmonyIntervals.stringPairs);
    const mel=posNotes(AEOL,root,pos,open,[lowerStr]);
    if(mel.length<4) return null;
    const thirds=pick([DEM.harmonyIntervals.minor3rds,DEM.harmonyIntervals.dorian3rds,DEM.harmonyIntervals.minor6ths]);
    const ev=[];
    for(let c=0,i=0;c<64;c+=2,i++){
      const n=mel[i%mel.length];
      const deco=i%mel.length===mel.length-1?'~':'';
      ev.push({col:c,str:lowerStr,fret:n.fret,d:deco});
      const hf=gf(n.midi+thirds[i%thirds.length],upperStr,open);
      if(hf!==null) ev.push({col:c,str:upperStr,fret:hf});
    }
    return{events:ev,label:`Ratt Twin Harmony (pos ${pos})`};
  }

  if(type==='box_shift') {
    const pos1=pick(DEM.leadPositions.filter(p=>p<=12)); const pos2=clamp(pos1+3,0,18);
    const b1=posNotes(PENTA,root,pos1,open,[3,4,5]);
    const b2=posNotes(PENTA,root,pos2,open,[3,4,5]);
    if(!b1.length||!b2.length) return null;
    const ev=[];
    const r1=pick([[0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30],[0,4,6,8,12,16,18,20,22,26,28,30]]);
    r1.forEach((c,i)=>ev.push({col:c,str:b1[i%b1.length].str,fret:b1[i%b1.length].fret}));
    const sf=gf(root+3,3,open); if(sf!==null) ev.push({col:30,str:3,fret:sf,d:'/'});
    for(let c=32,i=0;c<64;c+=2,i++) ev.push({col:c,str:b2[i%b2.length].str,fret:b2[i%b2.length].fret,d:i===Math.floor(b2.length/2)?'~':''});
    return{events:ev,label:`DeMartini Box Shift (${pos1}→${pos2})`};
  }

  // blues_phrase
  const pos=pick(DEM.leadPositions);
  const notes=posNotes(BLUES,root,pos,open,[2,3,4]);
  if(!notes.length) return null;
  const ev=[];
  const phrase=pick([
    [0,7,3,10,5,3,7,10,5,0,3,7,10,7,5,3],
    [0,3,5,7,10,7,5,3,0,5,7,10,7,5,3,0],
    [10,7,5,3,0,3,5,7,10,12,10,7,5,3,5,7],
  ]);
  phrase.forEach((iv,i)=>{
    const c=i*4;
    for(const s of [2,3,4]){
      const f=gf(root+iv,s,open);
      if(f!==null&&f>=pos&&f<=pos+4&&c<64){
        ev.push({col:c,str:s,fret:f,d:[2,5,8,11].includes(i)?'~':[3,7].includes(i)?'p':''});
        break;
      }
    }
  });
  return{events:ev,label:`DeMartini Blues Bends (pos ${pos})`};
}

function dem_rhythm(root,open,dd) {
  const type=pick(['round_round','lay_down','back_more','slip_lip']);
  const rootF=gf(root,0,open)??0;

  if(type==='round_round') {
    const stab1=pwrE(rootF,open,dd);
    const stab2=pwrE(clamp(rootF+5,0,22),open,dd);
    const stab3=pwrE(clamp(rootF+7,0,22),open,dd);
    const progs=pick([
      [[0,stab1],[4,stab2],[8,stab1],[12,stab3]],
      [[2,stab1],[6,stab1],[10,stab2],[14,stab1]],
      [[0,stab1],[4,stab3],[6,stab2],[10,stab1],[14,stab2]],
    ]);
    const ev=[];
    for(let m=0;m<4;m++){
      for(let c=0;c<16;c+=2) ev.push({col:m*16+c,str:0,fret:0});
      progs.forEach(([off,ch])=>addPwr(ev,m*16+off,ch));
    }
    return{events:ev,label:'Ratt Round/Round Riff'};
  }

  if(type==='lay_down') {
    const f5=clamp(rootF+5,0,22), f7=clamp(rootF+7,0,22), f3=clamp(rootF+3,0,22);
    const pat=pick([
      [rootF,rootF,f5,f7,rootF,rootF,f3,rootF],
      [rootF,f5,f7,rootF,f5,f3,rootF,f7],
      [f3,rootF,f5,rootF,f7,f5,rootF,f3],
    ]);
    const ev=[];
    for(let m=0;m<4;m++){
      pat.forEach((f,i)=>{
        const col=m*16+i*2;
        addPwr(ev,col,pwrE(f,open,dd));
        if(i===3) ev.push({col,str:0,fret:f5,d:'/'});
      });
    }
    return{events:ev,label:'Ratt Lay It Down Riff'};
  }

  if(type==='back_more') {
    const f5=clamp(rootF+5,0,22);
    const seq=pick([
      [rootF,rootF,f5,rootF],
      [f5,rootF,rootF,f5],
      [rootF,f5,rootF,rootF],
    ]);
    const pat=pick(DEM.rhythmPatterns);
    const ev=[];
    for(let m=0;m<4;m++){
      const rf=seq[m%seq.length];
      for(let c=0;c<16;c+=2) ev.push({col:m*16+c,str:0,fret:rootF});
      pat.forEach(off=>addPwr(ev,m*16+off,pwrE(rf,open,dd)));
    }
    return{events:ev,label:'Ratt Driving Riff'};
  }

  // slip_lip
  const dyads=pick([[[7,9],[5,7],[8,10],[5,7]],[[5,8],[7,9],[5,7],[8,10]],[[9,11],[7,9],[5,7],[7,9]]]);
  const ev=[];
  for(let m=0;m<4;m++){
    const d=dyads[m%dyads.length];
    const pat=pick(DEM.rhythmPatterns);
    for(let c=0;c<16;c+=2) ev.push({col:m*16+c,str:0,fret:rootF});
    pat.forEach(off=>{ ev.push({col:m*16+off,str:3,fret:d[0]}); ev.push({col:m*16+off,str:4,fret:d[1]}); });
  }
  return{events:ev,label:'Ratt Double-Stop'};
}

// ── George Lynch / Dokken ─────────────────────────────────────────────────────
function lnch_lead(root,open) {
  const type=pick(['phrygian','harm_sweep','open_penta','mr_scary_tap']);

  if(type==='phrygian') {
    const pos=pick([4,5,7,9]);
    const scale=posNotes(PHRYG,root,pos,open,[2,3,4,5]);
    if(scale.length<4) return null;
    const n0=scale[0];
    const legLen=pick([3,4,5]);
    const unit=[];
    unit.push({col:0,str:n0.str,fret:n0.fret,d:'h'});
    unit.push({col:2,str:n0.str,fret:clamp(n0.fret+pick([1,2,3]),0,22)});
    for(const s of [2,3,4]){const f=gf(root+6,s,open);if(f!==null&&f>=pos&&f<=pos+4){unit.push({col:4,str:s,fret:f,d:'~'});break;}}
    scale.slice(2,2+legLen).forEach((n,i)=>unit.push({col:8+i*2,str:n.str,fret:n.fret,d:i===1?'p':i===legLen-1?'~':''}));
    const unitLen=8+legLen*2;
    const ev=[];
    for(let col=0;col<64;col+=unitLen){
      unit.forEach(e=>{ if(col+e.col<64) ev.push({...e,col:col+e.col}); });
    }
    return{events:ev,label:`Lynch Phrygian (pos ${pos})`};
  }

  if(type==='harm_sweep') {
    const pos=pick([4,5,7]);
    const phrase=[];
    [0,1,2,3,4,5].forEach(str=>{
      const frets=new Set();
      HARM.forEach(iv=>[0,12,-12].forEach(oct=>{const f=gf(root+iv+oct,str,open);if(f!==null&&f>=pos&&f<=pos+4)frets.add(f);}));
      [...frets].sort((a,b)=>a-b).slice(0,pick([2,3])).forEach(f=>phrase.push({str,fret:f}));
    });
    if(phrase.length<6) return null;
    const full=[...phrase,...[...phrase].reverse()];
    const ev=[]; let col=0;
    while(col<64){full.forEach(n=>{if(col<64){ev.push({col,str:n.str,fret:n.fret});col+=2;}});}
    return{events:ev,label:`Lynch HM Sweep (pos ${pos})`};
  }

  if(type==='open_penta') {
    const pos=pick([3,5,7]);
    const penNotes=posNotes(PENTA,root,pos,open,[1,2,3]);
    const openNotes=[{str:0,fret:0},{str:1,fret:0},{str:2,fret:0}];
    const merged=[];
    penNotes.forEach((n,i)=>{merged.push(n);if(i%2===1) merged.push(pick(openNotes));});
    if(merged.length<4) return null;
    const ev=[]; let col=0;
    while(col<64){merged.forEach(n=>{if(col<64){ev.push({col,str:n.str,fret:n.fret,d:coin(0.3)?'h':''});col+=2;}});}
    return{events:ev,label:`Lynch Open/Penta (pos ${pos})`};
  }

  // mr_scary_tap
  const [hi,lo,mid]=pick(LNCH.tapPatterns.filter(([t,p,h])=>h>p&&t<=22)); // profile: [tap, pull, hammer]
  const str=pick(LNCH.tapStrings);
  if(hi>22) return null;
  const pos=lo;
  const tapStep=pick(LNCH.tapGroupSizes);
  const ev=[];
  for(let col=0;col<56;col+=tapStep){
    ev.push({col,str,fret:hi,d:'p'});
    ev.push({col:col+2,str,fret:clamp(mid,0,22),d:'h'});
    ev.push({col:col+4,str,fret:lo});
    if(col+6<64&&coin(0.5)) ev.push({col:col+6,str,fret:clamp(lo+1,0,22),d:'/'});
  }
  while(ev.length*2<63){const last=ev[ev.length-1];ev.push({...last,col:last.col+2});}
  return{events:ev,label:`Lynch Mr.Scary Tap (pos ${pos})`};
}

function lnch_rhythm(root,open,dd) {
  const type=pick(['tooth_nail','into_fire','breaking_chains','speed_riff']);
  const rootF=gf(root,0,open)??2;

  if(type==='tooth_nail') {
    const seqs=pick(LNCH.rhythmProgressions.toothAndNail);
    const pat=pick(LNCH.rhythmPatterns);
    const ev=[];
    for(let m=0;m<4;m++){
      const cf=clamp(rootF+seqs[m%seqs.length],0,22);
      for(let c=0;c<16;c+=2) ev.push({col:m*16+c,str:0,fret:rootF});
      pat.forEach(off=>addPwr(ev,m*16+off,pwrE(cf,open,dd)));
      ev.push({col:m*16+10,str:0,fret:clamp(rootF+1,0,22)});
    }
    return{events:ev,label:'Lynch Tooth & Nail'};
  }

  if(type==='into_fire') {
    const f5=clamp(rootF+2,0,22), fch=clamp(rootF+1,0,22), f3=clamp(rootF+3,0,22);
    const beatPats=pick([
      [[0,rootF],[0,rootF],[1,f5],[0,fch]],
      [[0,rootF],[1,f5],[0,rootF],[0,f3]],
      [[0,rootF],[0,fch],[1,f5],[0,rootF]],
    ]);
    const ev=[];
    for(let m=0;m<4;m++){
      for(let b=0;b<4;b++) beatPats.forEach(([s,f],i)=>ev.push({col:m*16+b*4+i,str:s,fret:f}));
      ev.push({col:m*16+8,str:1,fret:f3});
    }
    return{events:ev,label:'Lynch Into the Fire'};
  }

  if(type==='breaking_chains') {
    const ch1=pwrE(rootF,open,dd), ch2=pwrE(clamp(rootF+5,0,22),open,dd);
    const ch3=pwrE(clamp(rootF-2,0,22),open,dd);
    const sequences=pick([[ch1,ch1,ch2,ch1],[ch1,ch3,ch1,ch2],[ch2,ch1,ch3,ch1]]);
    const ev=[];
    for(let m=0;m<4;m++){
      const ch=sequences[m%sequences.length];
      pick(LNCH.rhythmPatterns).forEach(off=>addPwr(ev,m*16+off,ch));
    }
    return{events:ev,label:'Lynch Breaking Chains'};
  }

  // speed_riff
  const f5=clamp(rootF+2,0,22), f3=clamp(rootF+3,0,22), fch=clamp(rootF+1,0,22);
  const pats=pick([
    [[0,rootF],[0,rootF],[1,f5],[0,fch]],
    [[0,rootF],[1,f3],[0,rootF],[1,f5]],
    [[0,rootF],[0,fch],[0,rootF],[1,f5]],
  ]);
  const ev=[];
  for(let m=0;m<4;m++) for(let b=0;b<4;b++) pats.forEach(([s,f],i)=>ev.push({col:m*16+b*4+i,str:s,fret:f}));
  return{events:ev,label:'Lynch Speed Riff'};
}

// ── Jade Puget / AFI ──────────────────────────────────────────────────────────
function jade_lead(root,open) {
  const type=pick(['days_phoenix','goth_tap','leaving_song','girl_grey']);

  if(type==='days_phoenix') {
    const pos=pick([5,7,9]);
    const eNotes=posNotes(AEOL,root,pos,open,[5]);
    if(!eNotes.length) return null;
    const rhythms=pick([
      [0,4,6,8,12,14,16,20,22,24,28,30,32,36,38,40,44,46,48,52,54,56,60,62],
      [0,3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63],
    ]);
    const ev=[];
    rhythms.forEach((c,i)=>{
      if(c>=64) return;
      if(i%2===0) ev.push({col:c,str:4,fret:0});
      else { const n=eNotes[Math.floor(i/2)%eNotes.length]; ev.push({col:c,str:5,fret:n.fret,d:coin(0.25)?'/':''}); }
    });
    return{events:ev,label:'Jade Days of Phoenix'};
  }

  if(type==='goth_tap') {
    const [hi,lo]=pick(JADE.tapPatterns); // profile: [tap, pull, hammer]
    const pos=lo;
    const mel=posNotes(AEOL,root,pos,open,[3,4,5]);
    if(!mel.length) return null;
    const str=pick(JADE.tapStrings);
    if(hi>22) return null;
    const ev=[];
    const slowCols=pick([[0,4,8,12,16,20,24,28],[0,6,10,14,18,24,28]]);
    slowCols.forEach((c,i)=>{const n=mel[i%mel.length];ev.push({col:c,str:n.str,fret:n.fret,d:i%4===3?'~':''});});
    const tapStep=pick(JADE.tapGroupSizes);
    for(let col=32;col<62;col+=tapStep){
      ev.push({col,str,fret:hi,d:'p'});
      ev.push({col:col+2,str,fret:lo,d:'h'});
      ev.push({col:col+4,str,fret:clamp(lo+3,0,22)});
    }
    return{events:ev,label:'Jade Goth Tap'};
  }

  if(type==='leaving_song') {
    const pos=pick([5,7,9,12]);
    const notes=posNotes(PHRYG,root,pos,open,[3,4,5]);
    if(!notes.length) return null;
    const phrase=[...notes,...[...notes].reverse()];
    const ev=[]; let col=0;
    while(col<64){phrase.forEach(n=>{if(col<64){ev.push({col,str:n.str,fret:n.fret,d:coin(0.2)?'h':''});col+=2;}});}
    return{events:ev,label:`Jade Leaving Song Lead`};
  }

  // girl_grey
  const pos=pick([7,9,12]);
  const notes=posNotes(AEOL,root,pos,open,[4,5]);
  if(!notes.length) return null;
  const ev=[];
  const rhythm=pick([
    [0,4,8,10,12,16,18,20,24,26,28,32,34,36,40,44,46,48,52,54,56,60,62],
    [0,3,6,8,12,14,16,20,22,24,28,30,32,36,38,40,44,46,48,52,54,56,60],
  ]);
  rhythm.forEach((c,i)=>{
    if(c>=64) return;
    const n=notes[i%notes.length];
    ev.push({col:c,str:n.str,fret:n.fret,d:i%5===0?'~':i%4===2?'h':''});
  });
  return{events:ev,label:`Jade Girl's Not Grey Lead`};
}

function jade_rhythm(root,open,dd) {
  const type=pick(['days_verse','girls_grey','bleed_black','art_drowning']);
  const rootF=gf(root,1,open)??2;

  if(type==='days_verse') {
    const positions=pick([
      [rootF,rootF,clamp(rootF-2,0,22),rootF,clamp(rootF+2,0,22),clamp(rootF+5,0,22)],
      [rootF,clamp(rootF+2,0,22),rootF,clamp(rootF-2,0,22),rootF,clamp(rootF+5,0,22)],
      [clamp(rootF+5,0,22),rootF,clamp(rootF+2,0,22),rootF,clamp(rootF-2,0,22),rootF],
    ]);
    const ev=[];
    for(let m=0;m<4;m++){
      positions.forEach((f,i)=>{
        const col=m*16+Math.round(i*16/positions.length);
        if(col<m*16+16) addPwr(ev,col,pwrA(clamp(f,0,22),open));
      });
    }
    return{events:ev,label:'Jade DoTP Riff'};
  }

  if(type==='girls_grey') {
    const progs=pick([
      [rootF,clamp(rootF-4,0,22),clamp(rootF-2,0,22),clamp(rootF-4,0,22)],
      [rootF,clamp(rootF-2,0,22),clamp(rootF+3,0,22),clamp(rootF-2,0,22)],
      [rootF,clamp(rootF-4,0,22),rootF,clamp(rootF+3,0,22)],
    ]);
    const pat=pick(JADE.rhythmPatterns);
    const ev=[];
    for(let m=0;m<4;m++){
      const f=progs[m%progs.length];
      pat.forEach(off=>addPwr(ev,m*16+off,pwrA(f,open)));
    }
    return{events:ev,label:"Jade Girl's Not Grey"};
  }

  if(type==='bleed_black') {
    const f5=clamp(rootF+2,0,22), fch=clamp(rootF+1,0,22);
    const ev=[];
    for(let m=0;m<4;m++){
      for(let i=0;i<8;i++){
        const col=m*16+i*2;
        if(i%3===0) addPwr(ev,col,pwrA(rootF,open));
        else ev.push({col,str:1,fret:i%2===0?f5:fch});
      }
    }
    return{events:ev,label:'Jade Bleed Black Riff'};
  }

  // art_drowning
  const f5=clamp(rootF+2,0,22), f3=clamp(rootF-2,0,22);
  const beatPat=pick([
    [[1,rootF],[1,rootF],[1,f5],[1,f3]],
    [[1,rootF],[1,f5],[1,rootF],[1,rootF]],
    [[1,f3],[1,rootF],[1,f5],[1,rootF]],
  ]);
  const ev=[];
  for(let m=0;m<4;m++) for(let b=0;b<4;b++) beatPat.forEach(([s,f],i)=>ev.push({col:m*16+b*4+i,str:s,fret:f}));
  return{events:ev,label:'AFI Art of Drowning Riff'};
}

// ── Ian D'Sa / Billy Talent ───────────────────────────────────────────────────
function ian_lead(root,open) {
  const type=pick(['d_string_melody','fallen_leaves_lead','river_below']);

  if(type==='d_string_melody') {
    const melodies=pick(IAN.dStringMelodies.ascDesc);
    const ev=[];
    const mel=melodies;
    for(let c=0,i=0;c<64;c+=2,i++){
      const iv=mel[i%mel.length];
      const f=gf(root+iv,2,open);
      if(f!==null){
        const prev=mel[(i-1+mel.length)%mel.length];
        ev.push({col:c,str:2,fret:f,d:iv>prev?'h':iv<prev?'p':''});
      }
    }
    return{events:ev,label:"Ian D-String Melody"};
  }

  if(type==='fallen_leaves_lead') {
    const pos=pick([5,7,9,12]);
    const notes=posNotes(AEOL,root,pos,open,[2,3,4,5]);
    if(!notes.length) return null;
    const patterns=pick([
      [...notes,...[...notes].reverse()],
      [...notes,notes[notes.length-1],...[...notes].reverse()],
      [notes[0],...notes,...[...notes].slice(0,-1).reverse()],
    ]);
    const ev=[]; let col=0;
    while(col<64){patterns.forEach(n=>{if(col<64){ev.push({col,str:n.str,fret:n.fret,d:coin(0.15)?'~':''});col+=2;}});}
    return{events:ev,label:`Ian Fallen Leaves Lead (pos ${pos})`};
  }

  // river_below
  const ivs=pick(IAN.dStringMelodies.descending);
  const ev=[];
  for(let c=0,i=0;c<64;c+=2,i++){
    const iv=ivs[i%ivs.length];
    const f=gf(root+iv,2,open);
    if(f!==null) ev.push({col:c,str:2,fret:f,d:i%4===3?'~':''});
    if(i%4===1) ev.push({col:c,str:0,fret:0});
  }
  return{events:ev,label:"Ian River Below Lead"};
}

function ian_rhythm(root,open,dd) {
  const type=pick(['midnight_mass','try_honesty','red_flag','viking_march']);
  const rootF=gf(root,0,open)??0;

  if(type==='midnight_mass') {
    const dpats=pick([
      [0,8,0,7,0,8,0,5],[0,7,0,8,0,5,0,7],[0,5,0,7,0,8,7,5],
    ]);
    const apats=pick([
      [0,5,0,7,0,3,0,0],[0,3,0,5,0,7,5,3],[0,5,7,5,0,3,5,0],
    ]);
    const ev=[];
    for(let m=0;m<4;m++){
      dpats.forEach((f,i)=>{
        const col=m*16+i*2;
        ev.push({col,str:0,fret:clamp(f,0,22)});
        if(apats[i]>0) ev.push({col,str:1,fret:clamp(apats[i],0,22)});
      });
    }
    return{events:ev,label:"Ian Midnight Mass Riff"};
  }

  if(type==='try_honesty') {
    const melpats=pick([
      [0,2,3,5,7,5,3,2],[0,3,5,3,0,2,5,3],[5,3,2,0,3,5,7,5],
    ]);
    const ev=[];
    for(let m=0;m<4;m++){
      melpats.forEach((iv,i)=>{
        const col=m*16+i*2;
        const f=clamp(rootF+iv,0,22);
        if(i%2===0) addPwr(ev,col,pwrE(f,open,true));
        else ev.push({col,str:2,fret:f});
      });
    }
    return{events:ev,label:"Ian Try Honesty Riff"};
  }

  if(type==='red_flag') {
    const ch1=pwrE(rootF,open,true), ch2=pwrE(clamp(rootF+3,0,22),open,true);
    const ch3=pwrE(clamp(rootF-2,0,22),open,true);
    const seqs=pick([[ch1,ch2,ch1,ch3],[ch1,ch3,ch2,ch1],[ch2,ch1,ch1,ch3]]);
    const ev=[];
    for(let m=0;m<4;m++){
      const ch=seqs[m%seqs.length];
      [0,4,6,8,12,14].forEach(off=>addPwr(ev,m*16+off,ch));
    }
    return{events:ev,label:'Ian Red Flag Gallop'};
  }

  // viking_march
  const f5=clamp(rootF+5,0,22), f7=clamp(rootF+7,0,22);
  const march=pick([
    [rootF,f5,rootF,f7,rootF,f5,rootF,rootF],
    [rootF,rootF,f5,rootF,f7,f5,rootF,f5],
    [f5,rootF,rootF,f7,rootF,f5,rootF,rootF],
  ]);
  const ev=[];
  for(let m=0;m<4;m++){
    march.forEach((f,i)=>{
      const col=m*16+i*2;
      addPwr(ev,col,pwrE(f,open,true));
    });
  }
  return{events:ev,label:'Ian Viking March'};
}

// ── Generator map ─────────────────────────────────────────────────────────────
const GEN_MAP={
  evh: {lead:evh_lead, rhythm:evh_rhythm, open:EVH.open,  dd:false, bpmL:EVH.bpmLead,  bpmR:EVH.bpmRhythm},
  dem: {lead:dem_lead, rhythm:dem_rhythm, open:DEM.open,  dd:false, bpmL:DEM.bpmLead,  bpmR:DEM.bpmRhythm},
  lnch:{lead:lnch_lead,rhythm:lnch_rhythm,open:LNCH.open, dd:false, bpmL:LNCH.bpmLead, bpmR:LNCH.bpmRhythm},
  jade:{lead:jade_lead,rhythm:jade_rhythm,open:JADE.open,  dd:false, bpmL:JADE.bpmLead, bpmR:JADE.bpmRhythm},
  ian: {lead:ian_lead, rhythm:ian_rhythm, open:IAN.open,   dd:true,  bpmL:IAN.bpmLead,  bpmR:IAN.bpmRhythm},
};

function resolveIds(sel){
  const real=sel.filter(x=>x!=='rnd');
  if(!real.length) return [pick(Object.keys(GEN_MAP))];
  return real;
}

function generateExercise(sel,isLead){
  const ids=resolveIds(sel);
  for(let attempt=0;attempt<12;attempt++){
    const id=pick(ids);
    const prof=GEN_MAP[id];
    const root=pick([40,42,43,45,47,38,41]);
    let result;
    try{ result=isLead?prof.lead(root,prof.open):prof.rhythm(root,prof.open,prof.dd); }catch(e){continue;}
    if(!result||result.events.length<6) continue;
    const valid=result.events.filter(e=>e.fret>=0&&e.fret<=22&&e.col>=0&&e.col<64);
    if(valid.length<6) continue;
    const [bLo,bHi]=isLead?prof.bpmL:prof.bpmR;
    const bpm=bLo+ri(bHi-bLo);
    const guitarist=GUITARISTS.find(g=>g.id===id);
    const tag=ids.length>1?` [${guitarist.name.split(' ').pop()}]`:'';
    return{tab:buildTab(valid,prof.open),bpm,label:result.label+tag,audioEvents:toAudio(valid,bpm,prof.open),guitId:id};
  }
  const ev=[{col:0,str:2,fret:5},{col:4,str:3,fret:5},{col:8,str:4,fret:5},{col:12,str:3,fret:5}];
  return{tab:buildTab(ev,STD),bpm:120,label:'Pentatonic',audioEvents:toAudio(ev,120,STD),guitId:'evh'};
}

// ── Playback ──────────────────────────────────────────────────────────────────
function startPlay({audioEvents,bpm,clickOn,onBeat,onDone,ctxRef,nodesRef}){
  const ctx=new AudioContext(); ctxRef.current=ctx; nodesRef.current=[];
  const now=ctx.currentTime+0.1;
  const dur=64*(60/bpm/4);
  audioEvents.forEach(({t,hz})=>{
    const g=ctx.createGain(); g.gain.setValueAtTime(0.17,now+t); g.gain.exponentialRampToValueAtTime(0.001,now+t+0.22); g.connect(ctx.destination);
    const o=ctx.createOscillator(); o.type='sawtooth'; o.frequency.value=hz; o.connect(g); o.start(now+t); o.stop(now+t+0.25);
    nodesRef.current.push(g,o);
  });
  if(clickOn){
    const bd=60/bpm;
    for(let i=0;i<16;i++){
      const t=now+i*bd; const ac=i%4===0;
      const buf=ctx.createBuffer(1,Math.floor(ctx.sampleRate*.03),ctx.sampleRate);
      const d=buf.getChannelData(0);
      for(let j=0;j<d.length;j++) d[j]=(Math.random()*2-1)*Math.exp(-j/(ctx.sampleRate*(ac?.008:.004)))*(ac?1:.5);
      const s=ctx.createBufferSource(); s.buffer=buf;
      const g=ctx.createGain(); g.gain.value=ac?.7:.4;
      s.connect(g); g.connect(ctx.destination); s.start(t);
      nodesRef.current.push(s,g);
      const tid=setTimeout(()=>onBeat(i%4),Math.max(0,(t-ctx.currentTime)*1000));
      nodesRef.current.push({stop:()=>clearTimeout(tid),disconnect:()=>{}});
    }
  }
  const tid=setTimeout(()=>onDone(),(dur+.4)*1000);
  nodesRef.current.push({stop:()=>clearTimeout(tid),disconnect:()=>{}});
  return dur;
}

// ── Panel ─────────────────────────────────────────────────────────────────────
function Panel({type,sel}){
  const isLead=type==='lead'; const cls=isLead?'lead':'rhythm';
  const [tab,setTab]=useState(''); const [bpm,setBpm]=useState(null);
  const [label,setLabel]=useState(''); const [playing,setPlaying]=useState(false);
  const [clickOn,setClickOn]=useState(true); const [progress,setProgress]=useState(0);
  const [beat,setBeat]=useState(-1); const [guitId,setGuitId]=useState('');
  const [hasAudio,setHasAudio]=useState(false);
  const audioRef=useRef(null); const ctxRef=useRef(null); const nodesRef=useRef([]);
  const progRef=useRef(null); const startRef=useRef(null); const durRef=useRef(null);

  const stopAll=useCallback(()=>{
    clearInterval(progRef.current);
    nodesRef.current.forEach(n=>{try{n.stop?.();n.disconnect?.();}catch(e){}});
    nodesRef.current=[]; try{ctxRef.current?.close();}catch(e){} ctxRef.current=null;
    setPlaying(false); setProgress(0); setBeat(-1);
  },[]);
  useEffect(()=>()=>{stopAll();},[stopAll]);

  const generate=()=>{
    stopAll();
    const ex=generateExercise(sel,isLead);
    setTab(ex.tab); setBpm(ex.bpm); setLabel(ex.label); setGuitId(ex.guitId);
    audioRef.current=ex.audioEvents; setHasAudio(true);
  };

  const playStop=()=>{
    if(playing){stopAll();return;}
    if(!tab||!audioRef.current) return;
    const dur=startPlay({audioEvents:audioRef.current,bpm,clickOn,onBeat:idx=>setBeat(idx),onDone:()=>{setPlaying(false);setProgress(0);setBeat(-1);},ctxRef,nodesRef});
    durRef.current=dur; startRef.current=Date.now();
    progRef.current=setInterval(()=>setProgress(Math.min(((Date.now()-startRef.current)/1000)/durRef.current*100,100)),50);
    setPlaying(true);
  };

  const exportPdf=()=>{
    if(!tab) return;
    const color=isLead?'#ff2d78':'#00f5ff'; const nc=isLead?'#ff8ab8':'#7ef5ff';
    const w=window.open('','_blank');
    w.document.write(`<html><head><title>SHRED MACHINE</title><style>body{background:#000;color:#eee;font-family:monospace;padding:2rem;}h1{color:${color};font-size:1.3rem;}p{color:#888;font-size:.8rem;margin:0 0 1rem;}pre{font-size:.85rem;line-height:1.8;color:${nc};}</style></head><body><h1>⚡ SHRED MACHINE</h1><p>${label} | ${bpm} BPM | ${isLead?'LEAD':'RHYTHM'}</p><pre>${tab}</pre><script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  const gc=guitId?GUITARISTS.find(g=>g.id===guitId)?.color:'#888';
  const side=isLead?'l':'r';
  return(
    <div className={`panel panel-${cls}`}>
      <div className={`panel-title ${isLead?'tl':'tr'}`}>{isLead?'⚡ LEAD SHRED':'🔥 RHYTHM MACHINE'}</div>
      <div className="panel-sub">{isLead?'Lead · Solo · Melody':'Riff · Groove · Rhythm'}</div>
      <button
        className={`gen-btn gen-${side}`}
        onClick={generate}
      >
        {`▶ Generate ${isLead?'Lead':'Rhythm'} Exercise`}
      </button>
      <div className="meta">
        {bpm&&<span className={`badge b${side}`}>{bpm} BPM</span>}
        {label&&<span style={{fontSize:'.6rem',color:gc,padding:'1px 6px',border:`1px solid ${gc}`,borderRadius:'2px',background:`${gc}18`}}>{label}</span>}
        <div className="beat-dots">{[0,1,2,3].map(i=><div key={i} className={`dot d${side}${beat===i?' on':''}`}/>)}</div>
      </div>
      <div className="prog-wrap"><div className={`prog p${side}`} style={{width:`${progress}%`}}/></div>
      <div className={`tab-box tab-${side}`}>{tab||<span style={{color:'#2a2a2a'}}>{'//'} select a guitarist above, then generate</span>}</div>
      <div className="ctrl">
        <button className={`cb cb${side}${playing?' on':''}`} onClick={playStop} disabled={!tab||!hasAudio}>{playing?'■ Stop':'▶ Play'}</button>
        <button className={`cb cb${side}${clickOn?' on':''}`} onClick={()=>setClickOn(v=>!v)} disabled={playing}>{clickOn?'✓ Click':'✗ Click'}</button>
        <button className={`cb cb${side}`} onClick={exportPdf} disabled={!tab}>⬇ PDF</button>
      </div>
    </div>
  );
}

// ── Guitarist Selector ────────────────────────────────────────────────────────
function GuitaristBar({sel,setSel}){
  const toggle=id=>{
    if(id==='rnd'){setSel(['rnd']);return;}
    setSel(prev=>{
      const cur=prev.filter(x=>x!=='rnd');
      if(cur.includes(id)) return cur.filter(x=>x!==id).length?cur.filter(x=>x!==id):['rnd'];
      if(cur.length>=3) return cur;
      return [...cur,id];
    });
  };
  return(
    <div>
      <div className="guitarist-bar">
        {GUITARISTS.map(g=>{
          const isSel=sel.includes(g.id);
          return(
            <button key={g.id} className={`g-btn${isSel?' sel':''}${g.id==='rnd'?' random-btn':''}`}
              style={{'--gc':g.color}}
              onClick={()=>toggle(g.id)}>
              {g.name}{g.band?` — ${g.band}`:''}
            </button>
          );
        })}
      </div>
      <div className="sel-hint">
        {sel.includes('rnd')?'Random guitarist each time':
          sel.length===0?'Select up to 3 guitarists':
          `${sel.length}/3 — ${sel.map(id=>GUITARISTS.find(g=>g.id===id)?.name.split(' ').pop()).join(' + ')} styles`}
      </div>
    </div>
  );
}

export default function App(){
  const [sel,setSel]=useState(['rnd']);

  return(
    <>
      <style>{STYLES}</style>
      <div className="root">
        <div className="scanlines"/>
        <div className="logo">⚡ SHRED MACHINE ⚡</div>
        <div className="tagline">Guitar Practice System v2.0 — EST. 1984</div>
        <GuitaristBar sel={sel} setSel={setSel}/>
        <div className="panels">
          <Panel type="lead" sel={sel}/>
          <Panel type="rhythm" sel={sel}/>
        </div>
      </div>
    </>
  );
}
