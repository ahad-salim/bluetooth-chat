const PC1_IP = '192.168.15.11';
let ws = null; let mode = null;

const messagesDiv = document.getElementById('messages');
const statusEl = document.getElementById('status');
const input = document.getElementById('msgInput');

function addMsg(t,me=false){ const d=document.createElement('div'); d.className='msg'+(me?' me':''); d.textContent=t; messagesDiv.appendChild(d); messagesDiv.scrollTop=messagesDiv.scrollHeight; }
function setStatus(t,c){ statusEl.textContent=t; statusEl.style.color=c; }

async function autoConnect(){
  setStatus('● TRYING WS...','#ff0');
  try{ await tryWS(); }catch{ await tryBT(); }
}

function tryWS(){
  return new Promise((res,rej)=>{
    const socket = new WebSocket(`ws://${PC1_IP}:8080`);
    let to = setTimeout(()=>{ socket.close(); rej(); },4000);
    socket.onopen=()=>{ clearTimeout(to); ws=socket; mode='WS'; setStatus('● ONLINE WS','#0f0'); addMsg('✅ Connected WS (Hotspot)'); res(); };
    socket.onmessage=e=>addMsg(`[Ubuntu]: ${e.data}`);
    socket.onclose=()=>{ if(mode==='WS'){ addMsg('WS lost, switching to BT...'); tryBT(); } };
    socket.onerror=()=>{ clearTimeout(to); rej(); };
  });
}

async function tryBT(){
  setStatus('● TRYING BT...','#0af'); mode='BT';
  try{
    const device = await navigator.bluetooth.requestDevice({ filters:[{namePrefix:'UB_ATT'}], optionalServices:['battery_service'] });
    setStatus(`● BT ${device.name}`,'#0af'); addMsg(`✅ OFFLINE via ${device.name} - Use Node client for data chat`);
  }catch(e){
    setStatus('● RETRYING...','#f55'); setTimeout(autoConnect,3000);
  }
}

function send(){
  const t=input.value.trim(); if(!t) return;
  if(ws && ws.readyState===1){ ws.send(t); addMsg(`You: ${t}`,true); }
  else addMsg('⚠️ Not connected - auto retrying...',true);
  input.value='';
}

document.getElementById('sendBtn').onclick=send;
input.addEventListener('keydown',e=>{ if(e.key==='Enter') send(); });
window.onload=autoConnect;