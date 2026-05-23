import { LOGO } from "./logo.js";
import { useState, useEffect, useMemo } from "react";

const USERS = [
  { user:"Bragajunior5640@gmail.com", pass:"Jbx1502", nome:"Junior Braga" },
  { user:"admin", pass:"Jbx1502", nome:"Junior Braga" },
];
const AUTH_KEY = "jbx_auth_v1";
const DATA_KEY = "jbx_crm_v1";
const getAuth   = () => { try{return JSON.parse(localStorage.getItem(AUTH_KEY));}catch{return null;} };
const setAuth   = u  => localStorage.setItem(AUTH_KEY, JSON.stringify(u));
const clearAuth = () => localStorage.removeItem(AUTH_KEY);
const saveData  = d  => { try{localStorage.setItem(DATA_KEY,JSON.stringify(d));}catch{} };
const loadData  = () => { try{const r=localStorage.getItem(DATA_KEY);return r?JSON.parse(r):null;}catch{return null;} };

const uid    = () => Math.random().toString(36).slice(2,9);
const today  = () => new Date().toISOString().slice(0,10);
const money  = v => v!=null&&v!==""&&!isNaN(Number(v)) ? new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(v)) : "—";
const dateBR = d => d ? new Date(d+"T00:00:00").toLocaleDateString("pt-BR") : "—";
const daysTo = d => Math.ceil((new Date(d+"T00:00:00")-new Date())/86400000);
const pct    = (n,t) => t?Math.round((n/t)*100):0;

const ETAPAS = ["Prospecção","Proposta","Em Análise","Contrato","Ativo","Contemplado","Cancelado"];
const STATUS = ["Ativo","Contemplado","Cancelado","Inadimplente"];
const TIPOS  = ["Imóvel","Veículo","Moto","Serviços","Pesado"];
const PLANOS = ["Plano Cheio","Meia Parcela","75/25"];
const INT_T  = ["Ligação","WhatsApp","Email","Reunião","Visita"];
const ADMINS = ["Porto Seguro","Embracon","Rodobens","CAIXA","Banco do Brasil","Outra"];
const SCOR = {Ativo:"#22c55e",Contemplado:"#3b82f6",Cancelado:"#ef4444",Inadimplente:"#f59e0b"};
const ECOR = {Prospecção:"#a78bfa",Proposta:"#60a5fa","Em Análise":"#fbbf24",Contrato:"#34d399",Ativo:"#22c55e",Contemplado:"#3b82f6",Cancelado:"#f87171"};


const WA_NUM="5567992673716";


const SEED = [
  { id:uid(), nome:"Ana Claudia Barros", cpf:"", telefone:"(67) 99999-0000", email:"",
    tipo:"Veículo", plano:"Meia Parcela", administradora:"Porto Seguro",
    prazoMedio:67, prazoMedio2:80,
    valor:70000, parcelaInicial:772.65, lanceTotal:31500, recursosProprios:25000,
    embutido:6500, porcentagemLance:45, creditoDisponivel:63500, parcelaAposContemplacao:815.72,
    valor2:75000, parcelaInicial2:684.38, lanceTotal2:33750, recursosProprios2:25000,
    embutido2:8750, porcentagemLance2:45, creditoDisponivel2:66750, parcelaAposContemplacao2:842.60,
    modelosInteresse:"HB20, Toyota Yaris, Nissan Kicks", cidade:"Campo Grande MS",
    etapa:"Proposta", statusCota:"Ativo", dataVencimento:"", historico:[], followUp:"", anotacoes:"" },
];

function buildHTML(c) {
  const now      = new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"});
  const validade = new Date(Date.now()+30*86400000).toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"});
  const tipoLabel = c.tipo||"Bem";
  const planoLabel = c.plano||"Meia Parcela";
  const modelos = (c.modelosInteresse||"").split(",").map(m=>m.trim()).filter(Boolean);
  const temOpcao2 = c.valor2 && Number(c.valor2) > 0;
  const checks = ["Sem juros", c.porcentagemLance?`Lance de ${c.porcentagemLance}%`:null,
    c.prazoMedio?`Prazo ${c.prazoMedio}${c.prazoMedio2?" ou "+c.prazoMedio2:""} meses`:null, c.cidade||null].filter(Boolean);
  const modeloDesc = {
    hb20:"Um dos hatchbacks mais vendidos do Brasil. Design moderno, econômico e ótimo custo-benefício.",
    yaris:"Sedã compacto com acabamento premium, grande espaço interno e confiabilidade Toyota.",
    kicks:"SUV compacto com visual arrojado, câmera 360° e tecnologia avançada.",
    corolla:"Sedã médio líder de mercado, sinônimo de confiabilidade.",
    civic:"Sedã esportivo com tecnologia de ponta e excelente desempenho.",
  };
  const getDesc = n => { for(const [k,v] of Object.entries(modeloDesc)) if(n.toLowerCase().includes(k)) return v; return "Veículo selecionado conforme perfil do cliente."; };
  const getIco  = n => { const m=n.toLowerCase(); return m.includes("hilux")||m.includes("s10")?"🛻":m.includes("kicks")||m.includes("hrv")||m.includes("compass")?"🚙":"🚗"; };
  const H = "#0a0e2a";

  const planCard = (titulo,tag,rec,cr,prazo,parc,lt,rp,emb,pctL,cd,apos) => `
    <div style="flex:1;min-width:240px;border:2px solid ${rec?"#c4a028":"#e2e8f0"};border-radius:16px;overflow:hidden;background:#fff;box-shadow:${rec?"0 8px 32px rgba(196,160,40,.2)":"0 2px 8px rgba(0,0,0,.06)"};position:relative">
      ${rec?`<div style="position:absolute;top:12px;right:12px;background:linear-gradient(135deg,#c4a028,#e8c94a);color:#0d1544;font-size:10px;font-weight:800;padding:4px 12px;border-radius:99px;z-index:1">✦ RECOMENDADO</div>`:""}
      <div style="background:${H};padding:22px 22px 18px">
        <div style="color:rgba(255,255,255,.55);font-size:11px;font-weight:700;text-transform:uppercase;margin-bottom:3px">${titulo}</div>
        <div style="color:rgba(255,255,255,.4);font-size:11px;margin-bottom:12px">${tag}</div>
        <div style="color:rgba(255,255,255,.45);font-size:10px;font-weight:700;text-transform:uppercase;margin-bottom:3px">Carta de Crédito</div>
        <div style="color:#e8c94a;font-size:34px;font-weight:900;letter-spacing:-1px;line-height:1">${money(cr)}</div>
        <div style="color:rgba(255,255,255,.45);font-size:12px;margin-top:5px">Prazo médio ${prazo} meses</div>
      </div>
      <div style="padding:18px 22px">
        <div style="margin-bottom:14px">
          <div style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;margin-bottom:3px">Parcela inicial (${planoLabel.toLowerCase()})</div>
          <div style="color:#1e293b;font-size:22px;font-weight:800">${money(parc)}</div>
        </div>
        <div style="background:#f8fafc;border-radius:10px;padding:14px">
          <div style="font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;margin-bottom:10px">■ Estratégia de Lance (${pctL}%)</div>
          ${[["Lance Total",money(lt),"#c4a028"],["Recursos Próprios",money(rp),"#1e293b"],["Lance Embutido",money(emb),"#1e293b"],["Porcentagem do Lance",pctL+"%","#1e293b"]].map(([l,v,col])=>`
          <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid #f1f5f9">
            <span style="font-size:13px;color:#64748b">${l}</span>
            <span style="font-size:13px;font-weight:700;color:${col}">${v}</span>
          </div>`).join("")}
          <div style="margin-top:10px;padding:10px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0">
            <div style="font-size:10px;color:#065f46;font-weight:700;text-transform:uppercase;margin-bottom:2px">Crédito Disponível após lance</div>
            <div style="font-size:20px;font-weight:800;color:#065f46">${money(cd)}</div>
          </div>
          <div style="margin-top:8px;padding:10px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0">
            <div style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;margin-bottom:2px">Parcela após contemplação</div>
            <div style="font-size:20px;font-weight:800;color:#0d1544">${money(apos)}</div>
          </div>
        </div>
      </div>
    </div>`;

  return `<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Proposta JBX - ${c.nome}</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#fff;color:#1e293b}
@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style></head><body>
<div style="background:${H};padding:32px 44px 28px;position:relative;overflow:hidden">
  <div style="position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(196,160,40,.2),transparent 70%);top:-150px;right:-60px;border-radius:50%"></div>
  <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#c4a028,#e8c94a,#c4a028,transparent)"></div>
  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;position:relative;z-index:1">
    <img src="${LOGO}" alt="JBX" style="height:68px;width:auto;filter:drop-shadow(0 4px 14px rgba(196,160,40,.5))">
    <div style="text-align:right">
      <div style="color:rgba(255,255,255,.4);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Proposta Exclusiva</div>
      <div style="color:rgba(255,255,255,.3);font-size:11px;margin-top:4px">${now} · Válida até ${validade}</div>
    </div>
  </div>
  <div style="position:relative;z-index:1">
    <div style="color:rgba(255,255,255,.4);font-size:11px;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px">PROPOSTA EXCLUSIVA · CONSÓRCIO DE ${tipoLabel.toUpperCase()}</div>
    <div style="color:rgba(255,255,255,.42);font-size:13px;margin-bottom:4px">Preparada especialmente para:</div>
    <div style="color:#fff;font-size:30px;font-weight:900;letter-spacing:-.5px;margin-bottom:8px">${c.nome}</div>
    ${c.tipo==="Veículo"?`<div style="color:rgba(255,255,255,.55);font-size:13px;margin-bottom:14px">Realize o sonho do carro novo com planejamento, sem juros e com lance para contemplação rápida.</div>`:""}
    ${modelos.length?`<div style="color:rgba(255,255,255,.45);font-size:12px;margin-bottom:14px">■ Modelos de interesse: <span style="color:#e8c94a;font-weight:600">${modelos.join(" · ")}</span></div>`:""}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      ${checks.map(ch=>`<span style="background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:99px;padding:4px 13px;color:#fff;font-size:12px;font-weight:600">✓ ${ch}</span>`).join("")}
    </div>
    <div style="color:rgba(255,255,255,.45);font-size:12px">Seu consultor: <strong style="color:#e8c94a">Junior Braga</strong> | <strong style="color:#e8c94a">(67) 99267-3716</strong></div>
  </div>
</div>
<div style="padding:36px 44px">
  <div style="font-size:20px;font-weight:800;color:#0d1544;margin-bottom:5px">Opções de Plano</div>
  ${temOpcao2?`<div style="font-size:13px;color:#64748b;margin-bottom:20px">Duas simulações com lance de ${c.porcentagemLance||45}% para maximizar suas chances de contemplação rápida.</div>`:`<div style="margin-bottom:20px"></div>`}
  <div style="display:flex;gap:18px;flex-wrap:wrap">
    ${planCard("Menor prazo · Contemplação rápida",`Prazo médio ${c.prazoMedio||67} meses`,false,c.valor,c.prazoMedio||67,c.parcelaInicial,c.lanceTotal,c.recursosProprios,c.embutido,c.porcentagemLance||45,c.creditoDisponivel,c.parcelaAposContemplacao)}
    ${temOpcao2?planCard("Parcela menor · Mais conforto",`Prazo médio ${c.prazoMedio2||80} meses`,true,c.valor2,c.prazoMedio2||80,c.parcelaInicial2,c.lanceTotal2,c.recursosProprios2,c.embutido2,c.porcentagemLance2||45,c.creditoDisponivel2,c.parcelaAposContemplacao2):""}
  </div>
  ${c.recursosProprios?`<div style="margin-top:14px;font-size:11px;color:#94a3b8;font-style:italic">* Os recursos próprios (${money(c.recursosProprios)}) são pagos no momento do lance. O embutido é descontado do crédito ao ser contemplado.</div>`:""}
</div>
${modelos.length?`
<div style="padding:0 44px 36px">
  <div style="font-size:20px;font-weight:800;color:#0d1544;margin-bottom:18px">Modelos de Interesse</div>
  <div style="display:flex;gap:14px;flex-wrap:wrap">
    ${modelos.map(m=>`<div style="flex:1;min-width:160px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:13px;padding:18px 16px"><div style="font-size:26px;margin-bottom:8px">${getIco(m)}</div><div style="font-size:15px;font-weight:800;color:#0d1544;margin-bottom:4px">■ ${m}</div><div style="font-size:12px;color:#64748b;line-height:1.5">${getDesc(m)}</div></div>`).join("")}
  </div>
</div>`:""}
<div style="background:#f8fafc;padding:36px 44px">
  <div style="font-size:20px;font-weight:800;color:#0d1544;margin-bottom:18px">Por que Consórcio?</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:13px">
    ${[["💸","Sem juros","Pague apenas a taxa de administração."],["🏆",`Lance de ${c.porcentagemLance||45}%`,"Chances altíssimas de contemplação antecipada."],["🤝","Compra à vista","Poder de negociação na concessionária."],["📅","Flexibilidade",`Prazo de ${c.prazoMedio||67}${c.prazoMedio2?" ou "+c.prazoMedio2:""} meses.`],["📈","Crédito corrigido","Valor atualizado, protegendo seu poder de compra."],["🚘","Qualquer modelo","Novo ou seminovo — você escolhe."]].map(([i,t,d])=>`<div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:16px 14px"><div style="font-size:22px;margin-bottom:6px">${i}</div><div style="font-size:13px;font-weight:700;color:#0d1544;margin-bottom:3px">${t}</div><div style="font-size:12px;color:#64748b;line-height:1.5">${d}</div></div>`).join("")}
  </div>
</div>
<div style="padding:36px 44px">
  <div style="font-size:20px;font-weight:800;color:#0d1544;margin-bottom:20px">Passo a Passo</div>
  ${[["Adesão ao grupo","Escolha o plano, assine o contrato e comece a pagar mensalmente."],["Assembleias mensais",`Todo mês há sorteios e lances. Com ${c.porcentagemLance||45}% de lance suas chances são altíssimas.`],["Oferta de lance",`${money(c.recursosProprios)} próprios + embutido = lance total de ${c.porcentagemLance||45}%.`],["Contemplação","Você recebe a carta de crédito para comprar o veículo."],["Compra","Compra à vista com mais poder de negociação."]].map(([t,d],i)=>`
  <div style="display:flex;gap:18px;padding:14px 0;border-bottom:1px solid #f1f5f9">
    <div style="width:34px;height:34px;border-radius:50%;background:${H};color:#e8c94a;font-weight:900;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i+1}</div>
    <div style="padding-top:4px"><div style="font-size:14px;font-weight:700;color:#0d1544;margin-bottom:2px">${t}</div><div style="font-size:13px;color:#64748b;line-height:1.5">${d}</div></div>
  </div>`).join("")}
</div>
${c.anotacoes?`<div style="padding:0 44px 36px"><div style="background:#fffbeb;border:1px solid #fde68a;border-radius:13px;padding:18px 20px"><div style="font-size:10px;font-weight:800;color:#b45309;margin-bottom:6px">OBSERVAÇÕES ESPECIAIS</div><div style="font-size:14px;color:#92400e;line-height:1.65">${c.anotacoes}</div></div></div>`:""}
<div style="background:${H};padding:36px 44px;position:relative;overflow:hidden">
  <div style="position:absolute;bottom:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,#c4a028,#e8c94a,#c4a028,transparent)"></div>
  <div style="text-align:center;position:relative;z-index:1">
    <div style="color:#fff;font-size:22px;font-weight:800;margin-bottom:8px">PRÓXIMO PASSO</div>
    <div style="color:rgba(255,255,255,.65);font-size:15px;margin-bottom:22px">${c.nome.split(" ")[0]}, vamos garantir o seu ${tipoLabel.toLowerCase()} novo?</div>
    <a href="https://wa.me/${WA_NUM}" style="display:inline-block;background:linear-gradient(135deg,#c4a028,#e8c94a);color:#0d1544;font-weight:800;font-size:14px;padding:13px 32px;border-radius:99px;text-decoration:none">■ Chamar no WhatsApp - Junior Braga</a>
    <div style="margin-top:14px;color:rgba(255,255,255,.45);font-size:12px">(67) 99267-3716 · Bragajunior5640@gmail.com</div>
  </div>
</div>
<div style="padding:14px 44px;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #e2e8f0">
  <div style="font-size:10px;color:#94a3b8;line-height:1.6">Proposta válida sujeita à disponibilidade de grupos. Contemplação não é garantida em prazo determinado.</div>
  <img src="${LOGO}" alt="JBX" style="height:32px;width:auto;opacity:.6">
</div>
</body></html>`;
}

// Gera PDF via impressão — funciona em qualquer navegador real
function abrirEImprimir(c) {
  const html = buildHTML(c);
  const w = window.open("", "_blank");
  if (!w) { alert("Permita pop-ups no navegador para gerar o PDF."); return; }
  w.document.write(html);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 800);
}

// Compartilha via WhatsApp Web com link da proposta
function compartilharWA(c, url) {
  const msg = `Olá ${c.nome.split(" ")[0]}! 😊\n\nSua proposta de Consórcio de ${c.tipo} está pronta!\n\n📋 *Resumo:*\n• Crédito: ${money(c.valor)}${c.valor2?" ou "+money(c.valor2):""}\n• Parcela inicial: ${money(c.parcelaInicial)}\n• Lance: ${c.porcentagemLance||45}% → ${money(c.lanceTotal)}\n• Parcela após contemplação: ${money(c.parcelaAposContemplacao)}\n\n👉 *Ver proposta completa:*\n${url}\n\n*Junior Braga — JBX Consórcios*\n📱 (67) 99267-3716`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
}

const Badge = ({label,color}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 10px",fontSize:12,fontWeight:600}}>{label}</span>
);
function Modal({title,onClose,children,wide}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.82)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{background:"#0f1117",border:"1px solid #1e2535",borderRadius:16,padding:28,maxWidth:wide?960:720,width:"100%",maxHeight:"92vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
          <h2 style={{margin:0,color:"#e2e8f0",fontSize:18}}>{title}</h2>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#94a3b8",fontSize:22,cursor:"pointer"}}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
function Inp({label,...p}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={{color:"#94a3b8",fontSize:11,fontWeight:700,letterSpacing:1}}>{label.toUpperCase()}</label>
      <input {...p} style={{background:"#1a2035",border:"1px solid #2d3748",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:14,outline:"none",...(p.style||{})}}/>
    </div>
  );
}
function Sel({label,options,...p}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={{color:"#94a3b8",fontSize:11,fontWeight:700,letterSpacing:1}}>{label.toUpperCase()}</label>
      <select {...p} style={{background:"#1a2035",border:"1px solid #2d3748",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:14,outline:"none"}}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
function Btn({children,variant="gold",...p}) {
  const vs={gold:{background:"linear-gradient(135deg,#c4a028,#e8c94a)",color:"#0d1544",border:"none"},navy:{background:"linear-gradient(135deg,#0d1544,#1a1f5e)",color:"#e8c94a",border:"1px solid rgba(196,160,40,.3)"},ghost:{background:"transparent",color:"#94a3b8",border:"1px solid #2d3748"},green:{background:"linear-gradient(135deg,#25d366,#128c7e)",color:"#fff",border:"none"}};
  return <button {...p} style={{padding:"9px 18px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700,...vs[variant],...(p.style||{})}}>{children}</button>;
}

function LoginScreen({onLogin}) {
  const [u,setU]=useState(""), [p,setP]=useState(""), [err,setErr]=useState(""), [loading,setLoading]=useState(false);
  const submit=()=>{setErr("");setLoading(true);setTimeout(()=>{const found=USERS.find(x=>x.user.toLowerCase()===u.trim().toLowerCase()&&x.pass===p);if(found){setAuth(found);onLogin(found);}else{setErr("E-mail ou senha incorretos.");setLoading(false);}},500);};
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(150deg,#0a0e2a 0%,#0d1544 60%,#1a1f5e 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",width:500,height:500,background:"radial-gradient(circle,rgba(196,160,40,.14),transparent 70%)",top:"-150px",right:"-100px",borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{position:"absolute",width:380,height:380,background:"radial-gradient(circle,rgba(196,160,40,.07),transparent 70%)",bottom:"-120px",left:"-80px",borderRadius:"50%",pointerEvents:"none"}}/>
      <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(196,160,40,.22)",borderRadius:24,padding:"44px 40px",maxWidth:400,width:"100%",position:"relative"}}>
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,#c4a028,#e8c94a,#c4a028,transparent)",borderRadius:"24px 24px 0 0"}}/>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src={LOGO} alt="JBX" style={{height:96,width:"auto",filter:"drop-shadow(0 4px 20px rgba(196,160,40,.4))"}}/>
          <p style={{color:"rgba(255,255,255,.4)",fontSize:11,marginTop:10,letterSpacing:2,textTransform:"uppercase"}}>Sistema de Gestão de Carteira</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{color:"rgba(255,255,255,.45)",fontSize:11,fontWeight:700,letterSpacing:1}}>E-MAIL</label>
            <input value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="seu@email.com" style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(196,160,40,.22)",borderRadius:10,padding:"12px 15px",color:"#fff",fontSize:14,outline:"none"}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{color:"rgba(255,255,255,.45)",fontSize:11,fontWeight:700,letterSpacing:1}}>SENHA</label>
            <input type="password" value={p} onChange={e=>setP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="••••••••" style={{background:"rgba(255,255,255,.07)",border:"1px solid rgba(196,160,40,.22)",borderRadius:10,padding:"12px 15px",color:"#fff",fontSize:14,outline:"none"}}/>
          </div>
          {err&&<div style={{background:"rgba(239,68,68,.13)",border:"1px solid rgba(239,68,68,.35)",borderRadius:8,padding:"10px 14px",color:"#fca5a5",fontSize:13}}>⚠️ {err}</div>}
          <button onClick={submit} disabled={loading} style={{marginTop:6,background:loading?"rgba(196,160,40,.35)":"linear-gradient(135deg,#c4a028,#e8c94a)",border:"none",borderRadius:10,padding:"13px",color:"#0d1544",fontSize:15,fontWeight:800,cursor:loading?"not-allowed":"pointer"}}>{loading?"Entrando…":"Entrar"}</button>
        </div>
        <p style={{textAlign:"center",color:"rgba(255,255,255,.18)",fontSize:11,marginTop:22}}>JBX Consórcios · Multiplicando conquistas.</p>
      </div>
    </div>
  );
}

// Tela da proposta com PDF real e WhatsApp com link
function ProposalView({cliente, onClose}) {
  const html = useMemo(() => buildHTML(cliente), [cliente]);
  const propUrl = window.location.href; // URL do sistema hospedado

  return (
    <div style={{position:"fixed",inset:0,zIndex:2000,background:"#080b12",display:"flex",flexDirection:"column"}}>
      <div style={{background:"#0a0e1a",borderBottom:"1px solid #1e2535",padding:"10px 12px",display:"flex",alignItems:"center",gap:8,flexShrink:0,flexWrap:"wrap"}}>
        <button onClick={onClose} style={{background:"#1a2035",border:"1px solid #2d3748",borderRadius:8,padding:"8px 14px",color:"#e2e8f0",cursor:"pointer",fontSize:13,fontWeight:700}}>← Voltar</button>
        <div style={{flex:1,minWidth:0,background:"#1a2035",border:"1px solid #2d3748",borderRadius:8,padding:"6px 12px",display:"flex",alignItems:"center",gap:8,overflow:"hidden"}}>
          <img src={LOGO} alt="" style={{height:20,width:"auto",flexShrink:0}}/>
          <span style={{color:"#e2e8f0",fontSize:13,fontWeight:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cliente.nome}</span>
        </div>
        {/* GERAR PDF — abre nova aba e imprime */}
        <button onClick={()=>abrirEImprimir(cliente)}
          style={{background:"linear-gradient(135deg,#c4a028,#e8c94a)",border:"none",borderRadius:8,padding:"8px 16px",color:"#0d1544",cursor:"pointer",fontSize:13,fontWeight:800,whiteSpace:"nowrap"}}>
          🖨️ Gerar PDF
        </button>
        {/* ENVIAR PELO WHATSAPP COM LINK */}
        <button onClick={()=>compartilharWA(cliente, propUrl)}
          style={{background:"linear-gradient(135deg,#25d366,#128c7e)",border:"none",borderRadius:8,padding:"8px 16px",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:800,whiteSpace:"nowrap"}}>
          💬 Enviar por WA
        </button>
      </div>
      <iframe srcDoc={html} sandbox="allow-same-origin" style={{flex:1,border:"none",width:"100%",background:"#fff"}} title="Proposta"/>
    </div>
  );
}

function ClienteForm({initial,onSave,onClose}) {
  const blank={nome:"",cpf:"",telefone:"",email:"",tipo:"Veículo",plano:"Meia Parcela",administradora:"Porto Seguro",cidade:"",modelosInteresse:"",prazoMedio:"",prazoMedio2:"",valor:"",parcelaInicial:"",lanceTotal:"",recursosProprios:"",embutido:"",porcentagemLance:"",creditoDisponivel:"",parcelaAposContemplacao:"",valor2:"",parcelaInicial2:"",lanceTotal2:"",recursosProprios2:"",embutido2:"",porcentagemLance2:"",creditoDisponivel2:"",parcelaAposContemplacao2:"",etapa:"Prospecção",statusCota:"Ativo",dataVencimento:"",followUp:"",anotacoes:"",historico:[]};
  const [f,setF]=useState(initial||blank);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const ss={borderTop:"1px solid #1e2535",paddingTop:20};
  const sep=(color,icon,txt)=><p style={{color,fontSize:11,fontWeight:800,letterSpacing:2,marginBottom:14}}>{icon} {txt}</p>;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:22}}>
      <div>{sep("#c4a028","👤","DADOS PESSOAIS")}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"1/-1"}}><Inp label="Nome completo" value={f.nome} onChange={e=>set("nome",e.target.value)}/></div>
          <Inp label="CPF" value={f.cpf||""} onChange={e=>set("cpf",e.target.value)} placeholder="000.000.000-00"/>
          <Inp label="Telefone / WhatsApp" value={f.telefone} onChange={e=>set("telefone",e.target.value)}/>
          <Inp label="Email" value={f.email||""} onChange={e=>set("email",e.target.value)} type="email"/>
          <Inp label="Cidade / UF" value={f.cidade||""} onChange={e=>set("cidade",e.target.value)} placeholder="Campo Grande MS"/>
        </div>
      </div>
      <div style={ss}>{sep("#22c55e","📋","DADOS DO PLANO")}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Sel label="Tipo do consórcio" options={TIPOS} value={f.tipo} onChange={e=>set("tipo",e.target.value)}/>
          <Sel label="Tipo de Plano" options={PLANOS} value={f.plano} onChange={e=>set("plano",e.target.value)}/>
          <Sel label="Administradora" options={ADMINS} value={f.administradora} onChange={e=>set("administradora",e.target.value)}/>
          <div style={{gridColumn:"1/-1"}}><Inp label="Modelos de interesse (vírgula)" value={f.modelosInteresse||""} onChange={e=>set("modelosInteresse",e.target.value)} placeholder="HB20, Toyota Yaris, Nissan Kicks"/></div>
        </div>
      </div>
      <div style={ss}>{sep("#6366f1","1️⃣","OPÇÃO 1")}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Prazo médio (meses)" value={f.prazoMedio} onChange={e=>set("prazoMedio",e.target.value)} type="number" placeholder="67"/>
          <Inp label="Carta de Crédito (R$)" value={f.valor} onChange={e=>set("valor",e.target.value)} type="number" placeholder="70000"/>
          <Inp label="Parcela Inicial (R$)" value={f.parcelaInicial} onChange={e=>set("parcelaInicial",e.target.value)} type="number" placeholder="772.65"/>
          <Inp label="% do Lance" value={f.porcentagemLance} onChange={e=>set("porcentagemLance",e.target.value)} type="number" placeholder="45"/>
          <Inp label="Lance Total (R$)" value={f.lanceTotal} onChange={e=>set("lanceTotal",e.target.value)} type="number" placeholder="31500"/>
          <Inp label="Recursos Próprios (R$)" value={f.recursosProprios} onChange={e=>set("recursosProprios",e.target.value)} type="number" placeholder="25000"/>
          <Inp label="Lance Embutido (R$)" value={f.embutido} onChange={e=>set("embutido",e.target.value)} type="number" placeholder="6500"/>
          <Inp label="Crédito Disponível (R$)" value={f.creditoDisponivel} onChange={e=>set("creditoDisponivel",e.target.value)} type="number" placeholder="63500"/>
          <Inp label="Parcela após Contemplação (R$)" value={f.parcelaAposContemplacao} onChange={e=>set("parcelaAposContemplacao",e.target.value)} type="number" placeholder="815.72"/>
        </div>
      </div>
      <div style={ss}>{sep("#f59e0b","2️⃣","OPÇÃO 2 (opcional)")}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Prazo médio (meses)" value={f.prazoMedio2||""} onChange={e=>set("prazoMedio2",e.target.value)} type="number" placeholder="80"/>
          <Inp label="Carta de Crédito (R$)" value={f.valor2||""} onChange={e=>set("valor2",e.target.value)} type="number" placeholder="75000"/>
          <Inp label="Parcela Inicial (R$)" value={f.parcelaInicial2||""} onChange={e=>set("parcelaInicial2",e.target.value)} type="number" placeholder="684.38"/>
          <Inp label="% do Lance" value={f.porcentagemLance2||""} onChange={e=>set("porcentagemLance2",e.target.value)} type="number" placeholder="45"/>
          <Inp label="Lance Total (R$)" value={f.lanceTotal2||""} onChange={e=>set("lanceTotal2",e.target.value)} type="number" placeholder="33750"/>
          <Inp label="Recursos Próprios (R$)" value={f.recursosProprios2||""} onChange={e=>set("recursosProprios2",e.target.value)} type="number" placeholder="25000"/>
          <Inp label="Lance Embutido (R$)" value={f.embutido2||""} onChange={e=>set("embutido2",e.target.value)} type="number" placeholder="8750"/>
          <Inp label="Crédito Disponível (R$)" value={f.creditoDisponivel2||""} onChange={e=>set("creditoDisponivel2",e.target.value)} type="number" placeholder="66750"/>
          <Inp label="Parcela após Contemplação (R$)" value={f.parcelaAposContemplacao2||""} onChange={e=>set("parcelaAposContemplacao2",e.target.value)} type="number" placeholder="842.60"/>
        </div>
      </div>
      <div style={ss}>{sep("#94a3b8","🗂","CRM")}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Sel label="Etapa no funil" options={ETAPAS} value={f.etapa} onChange={e=>set("etapa",e.target.value)}/>
          <Sel label="Status da cota" options={STATUS} value={f.statusCota} onChange={e=>set("statusCota",e.target.value)}/>
          <Inp label="Vencimento" value={f.dataVencimento||""} onChange={e=>set("dataVencimento",e.target.value)} type="date"/>
          <Inp label="Follow-up" value={f.followUp||""} onChange={e=>set("followUp",e.target.value)} type="date"/>
        </div>
        <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:5}}>
          <label style={{color:"#94a3b8",fontSize:11,fontWeight:700,letterSpacing:1}}>ANOTAÇÕES / CONDIÇÕES ESPECIAIS</label>
          <textarea value={f.anotacoes} onChange={e=>set("anotacoes",e.target.value)} rows={3} style={{background:"#1a2035",border:"1px solid #2d3748",borderRadius:8,padding:"9px 12px",color:"#e2e8f0",fontSize:14,outline:"none",resize:"vertical"}}/>
        </div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <Btn variant="ghost" onClick={onClose}>Cancelar</Btn>
        <Btn onClick={()=>onSave(f)}>💾 Salvar</Btn>
      </div>
    </div>
  );
}

function ClienteDetalhe({cliente,onClose,onUpdate,onEdit,onProposta}) {
  const [ni,setNi]=useState({tipo:"Ligação",texto:""});
  const add=()=>{if(!ni.texto.trim())return;onUpdate({...cliente,historico:[...(cliente.historico||[]),{id:uid(),data:today(),...ni}]});setNi({tipo:"Ligação",texto:""});};
  const planoC={"Plano Cheio":"#3b82f6","Meia Parcela":"#22c55e","75/25":"#f59e0b"};
  const temOpcao2=cliente.valor2&&Number(cliente.valor2)>0;
  return (
    <Modal title={cliente.nome} onClose={onClose} wide>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:18,alignItems:"center"}}>
        <Badge label={cliente.statusCota} color={SCOR[cliente.statusCota]||"#64748b"}/>
        <Badge label={cliente.etapa} color={ECOR[cliente.etapa]||"#64748b"}/>
        <Badge label={cliente.tipo} color="#94a3b8"/>
        <Badge label={cliente.plano||"Meia Parcela"} color={planoC[cliente.plano]||"#6366f1"}/>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <Btn variant="ghost" onClick={()=>onEdit(cliente)} style={{fontSize:12,padding:"7px 14px"}}>✏️ Editar</Btn>
          <Btn variant="navy" onClick={()=>{onClose();onProposta(cliente);}} style={{fontSize:12,padding:"7px 14px"}}>📄 Ver Proposta</Btn>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:temOpcao2?"1fr 1fr":"1fr",gap:12,marginBottom:14}}>
        {[{l:"Opção 1",cr:cliente.valor,pa:cliente.parcelaInicial,lt:cliente.lanceTotal,pt:cliente.porcentagemLance,ap:cliente.parcelaAposContemplacao,pr:cliente.prazoMedio},
          temOpcao2&&{l:"Opção 2 ✦",cr:cliente.valor2,pa:cliente.parcelaInicial2,lt:cliente.lanceTotal2,pt:cliente.porcentagemLance2,ap:cliente.parcelaAposContemplacao2,pr:cliente.prazoMedio2}
        ].filter(Boolean).map(op=>(
          <div key={op.l} style={{background:"linear-gradient(135deg,#0d1544,#1a2035)",border:"1px solid rgba(196,160,40,.2)",borderRadius:12,padding:"12px 14px"}}>
            <div style={{color:"#e8c94a",fontSize:11,fontWeight:800,marginBottom:8}}>{op.l}</div>
            {[["Crédito",money(op.cr),"#c4a028"],["Prazo",op.pr?op.pr+"m":"—",null],["Parcela",money(op.pa),null],["Lance",op.pt?op.pt+"%":"—","#c4a028"],["Após contempl.",money(op.ap),"#22c55e"]].map(([l,v,col])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",borderBottom:"1px solid #1e2535",padding:"4px 0"}}>
                <span style={{color:"#94a3b8",fontSize:12}}>{l}</span>
                <span style={{color:col||"#e2e8f0",fontSize:12,fontWeight:700}}>{v}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={()=>{onClose();onProposta(cliente);}}
        style={{width:"100%",background:"linear-gradient(135deg,#0d1544,#1a1f5e)",border:"2px solid rgba(196,160,40,.4)",borderRadius:12,padding:"14px",color:"#e8c94a",cursor:"pointer",fontSize:14,fontWeight:800,marginBottom:14}}>
        📄 Abrir proposta → Gerar PDF ou enviar pelo WhatsApp
      </button>
      {cliente.anotacoes&&<div style={{background:"#1a1505",border:"1px solid #f59e0b33",borderRadius:10,padding:12,marginBottom:12}}><div style={{color:"#f59e0b",fontSize:10,fontWeight:800,marginBottom:3}}>CONDIÇÕES ESPECIAIS</div><p style={{color:"#fcd34d",fontSize:13,lineHeight:1.6,margin:0}}>{cliente.anotacoes}</p></div>}
      <p style={{color:"#64748b",fontSize:10,fontWeight:800,letterSpacing:2,marginBottom:10}}>HISTÓRICO</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:130,overflowY:"auto",marginBottom:10}}>
        {(cliente.historico||[]).length===0?<p style={{color:"#475569",fontSize:13}}>Nenhuma interação registrada.</p>:[...(cliente.historico||[])].reverse().map(h=>(
          <div key={h.id} style={{background:"#1a2035",borderRadius:8,padding:"8px 12px",display:"flex",gap:10}}>
            <div style={{minWidth:70,color:"#c4a028",fontSize:11,fontWeight:800}}>{h.tipo}</div>
            <div style={{flex:1}}><div style={{color:"#e2e8f0",fontSize:13}}>{h.texto}</div><div style={{color:"#475569",fontSize:11,marginTop:1}}>{dateBR(h.data)}</div></div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8}}>
        <select value={ni.tipo} onChange={e=>setNi(p=>({...p,tipo:e.target.value}))} style={{background:"#1a2035",border:"1px solid #2d3748",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:13}}>{INT_T.map(t=><option key={t}>{t}</option>)}</select>
        <input value={ni.texto} onChange={e=>setNi(p=>({...p,texto:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Interação…" style={{flex:1,background:"#1a2035",border:"1px solid #2d3748",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,outline:"none"}}/>
        <Btn onClick={add} style={{padding:"8px 12px"}}>＋</Btn>
      </div>
    </Modal>
  );
}

function Dashboard({clientes}) {
  const total=clientes.length, carteira=clientes.reduce((s,c)=>s+Number(c.valor||0),0), recorrente=clientes.reduce((s,c)=>s+Number(c.parcelaInicial||0),0);
  const alertas=clientes.filter(c=>{const fu=c.followUp?daysTo(c.followUp):null,vn=c.dataVencimento?daysTo(c.dataVencimento):null;return (fu!==null&&fu<=3&&fu>=0)||(vn!==null&&vn<=5&&vn>=0);});
  const cards=[{l:"Total",v:total,i:"👥",c:"#6366f1"},{l:"Ativos",v:clientes.filter(c=>c.statusCota==="Ativo").length,i:"✅",c:"#22c55e"},{l:"Contemplados",v:clientes.filter(c=>c.statusCota==="Contemplado").length,i:"🏆",c:"#3b82f6"},{l:"Inadimplentes",v:clientes.filter(c=>c.statusCota==="Inadimplente").length,i:"⚠️",c:"#f59e0b"},{l:"Cancelados",v:clientes.filter(c=>c.statusCota==="Cancelado").length,i:"❌",c:"#ef4444"},{l:"Carteira",v:money(carteira),i:"💰",c:"#c4a028"},{l:"Receita/mês",v:money(recorrente),i:"📈",c:"#10b981"}];
  const porEtapa=ETAPAS.map(e=>({e,n:clientes.filter(c=>c.etapa===e).length})).filter(x=>x.n>0);
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:24}}>
        {cards.map(c=><div key={c.l} style={{background:"#0f1117",border:`1px solid ${c.c}33`,borderRadius:12,padding:"14px 16px",position:"relative",overflow:"hidden"}}><div style={{fontSize:20,marginBottom:8}}>{c.i}</div><div style={{color:c.c,fontSize:19,fontWeight:800,fontFamily:"monospace"}}>{c.v}</div><div style={{color:"#64748b",fontSize:11,marginTop:4}}>{c.l}</div><div style={{position:"absolute",right:-8,bottom:-8,width:46,height:46,borderRadius:"50%",background:c.c+"15"}}/></div>)}
      </div>
      {alertas.length>0&&<div style={{background:"#1a1505",border:"1px solid #f59e0b44",borderRadius:12,padding:"12px 16px",marginBottom:20}}><p style={{color:"#f59e0b",fontWeight:800,fontSize:11,marginBottom:8}}>⚡ {alertas.length} URGENTE(S)</p>{alertas.map(c=>{const fu=c.followUp?daysTo(c.followUp):null,vn=c.dataVencimento?daysTo(c.dataVencimento):null;return <div key={c.id} style={{color:"#fcd34d",fontSize:13,marginBottom:3}}>• <strong>{c.nome}</strong>{fu!==null&&fu<=3&&fu>=0&&` — Follow-up ${fu===0?"HOJE":"em "+fu+"d"}`}{vn!==null&&vn<=5&&vn>=0&&` — Vencimento ${vn===0?"HOJE":"em "+vn+"d"}`}</div>;})}</div>}
      <p style={{color:"#64748b",fontSize:10,fontWeight:800,letterSpacing:2,marginBottom:12}}>POR ETAPA</p>
      {porEtapa.map(({e,n})=><div key={e} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><div style={{minWidth:108,color:"#94a3b8",fontSize:12}}>{e}</div><div style={{flex:1,background:"#1a2035",borderRadius:4,height:8,overflow:"hidden"}}><div style={{width:`${pct(n,total)}%`,height:"100%",background:ECOR[e],borderRadius:4}}/></div><div style={{color:"#e2e8f0",fontSize:12,minWidth:18}}>{n}</div></div>)}
    </div>
  );
}

function Kanban({clientes,onCardClick,onProposta}) {
  return (
    <div style={{display:"flex",gap:12,overflowX:"auto",paddingBottom:8}}>
      {ETAPAS.slice(0,6).map(etapa=>{
        const cols=clientes.filter(c=>c.etapa===etapa);
        return <div key={etapa} style={{minWidth:196,flex:"0 0 196px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"7px 12px",background:ECOR[etapa]+"22",borderRadius:8,border:`1px solid ${ECOR[etapa]}44`}}><span style={{color:ECOR[etapa],fontWeight:800,fontSize:13}}>{etapa}</span><span style={{background:ECOR[etapa],color:"#fff",borderRadius:99,fontSize:11,padding:"1px 7px",marginLeft:"auto"}}>{cols.length}</span></div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {cols.map(c=>{const urgent=c.followUp&&daysTo(c.followUp)<=3&&daysTo(c.followUp)>=0;return(
              <div key={c.id} onClick={()=>onCardClick(c)} style={{background:"#0f1117",border:"1px solid #1e2535",borderRadius:10,padding:12,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor="#c4a028"} onMouseLeave={e=>e.currentTarget.style.borderColor="#1e2535"}>
                <div style={{color:"#e2e8f0",fontSize:13,fontWeight:700,marginBottom:4}}>{c.nome}</div>
                <div style={{color:"#c4a028",fontSize:14,fontWeight:800}}>{money(c.valor)}{c.valor2?` / ${money(c.valor2)}`:""}</div>
                <Badge label={c.statusCota} color={SCOR[c.statusCota]||"#64748b"}/>
                {urgent&&<div style={{color:"#f59e0b",fontSize:11,marginTop:4}}>⚡ Follow-up</div>}
                <button onClick={e=>{e.stopPropagation();onProposta(c);}} style={{marginTop:8,width:"100%",background:"linear-gradient(135deg,#c4a028,#e8c94a)",border:"none",borderRadius:6,padding:"6px 0",color:"#0d1544",fontSize:12,cursor:"pointer",fontWeight:800}}>📄 Proposta</button>
              </div>
            );})}
          </div>
        </div>;
      })}
    </div>
  );
}

function Lista({clientes,onRowClick,onEdit,onDelete,onProposta}) {
  return (
    <div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
        <thead><tr>{["Cliente","Tipo","Plano","Crédito 1","Crédito 2","Etapa","Status","Ações"].map(h=><th key={h} style={{textAlign:"left",padding:"10px 12px",color:"#64748b",borderBottom:"1px solid #1e2535",fontSize:10,letterSpacing:1,whiteSpace:"nowrap"}}>{h.toUpperCase()}</th>)}</tr></thead>
        <tbody>
          {clientes.map(c=>{const fuD=c.followUp?daysTo(c.followUp):null,urgent=fuD!==null&&fuD<=3&&fuD>=0;return(
            <tr key={c.id} onClick={()=>onRowClick(c)} style={{cursor:"pointer",borderBottom:"1px solid #1e2535"}} onMouseEnter={e=>e.currentTarget.style.background="#1a2035"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"11px 12px"}}><div style={{color:"#e2e8f0",fontWeight:700}}>{c.nome}</div><div style={{color:"#475569",fontSize:11}}>{c.telefone}</div>{urgent&&<div style={{color:"#f59e0b",fontSize:10,marginTop:2}}>⚡</div>}</td>
              <td style={{padding:"11px 12px",color:"#94a3b8"}}>{c.tipo}</td>
              <td style={{padding:"11px 12px"}}><Badge label={c.plano||"Meia Parcela"} color="#6366f1"/></td>
              <td style={{padding:"11px 12px",color:"#c4a028",fontWeight:800}}>{money(c.valor)}</td>
              <td style={{padding:"11px 12px",color:"#e8c94a"}}>{c.valor2?money(c.valor2):"—"}</td>
              <td style={{padding:"11px 12px"}}><Badge label={c.etapa} color={ECOR[c.etapa]||"#64748b"}/></td>
              <td style={{padding:"11px 12px"}}><Badge label={c.statusCota} color={SCOR[c.statusCota]||"#64748b"}/></td>
              <td style={{padding:"11px 12px"}} onClick={e=>e.stopPropagation()}>
                <div style={{display:"flex",gap:5}}>
                  <button onClick={()=>onProposta(c)} style={{background:"linear-gradient(135deg,#c4a028,#e8c94a)",border:"none",borderRadius:6,padding:"5px 10px",color:"#0d1544",cursor:"pointer",fontSize:12,fontWeight:800}}>📄</button>
                  <button onClick={()=>onEdit(c)} style={{background:"#1a2035",border:"1px solid #2d3748",borderRadius:6,padding:"5px 8px",color:"#94a3b8",cursor:"pointer",fontSize:12}}>✏️</button>
                  <button onClick={()=>onDelete(c.id)} style={{background:"#1a0505",border:"1px solid #ef444433",borderRadius:6,padding:"5px 8px",color:"#ef4444",cursor:"pointer",fontSize:12}}>🗑</button>
                </div>
              </td>
            </tr>
          );})}
          {clientes.length===0&&<tr><td colSpan={8} style={{padding:40,textAlign:"center",color:"#475569"}}>Nenhum cliente encontrado.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [authUser, setAuthUser] = useState(()=>getAuth());
  const [clientes, setClientes] = useState(()=>loadData()||SEED);
  const [aba,      setAba]      = useState("dashboard");
  const [busca,    setBusca]    = useState("");
  const [fEtapa,   setFEtapa]   = useState("Todas");
  const [fStatus,  setFStatus]  = useState("Todos");
  const [modalForm,setModalForm]= useState(null);
  const [detalhe,  setDetalhe]  = useState(null);
  const [proposta, setProposta] = useState(null);
  const [flash,    setFlash]    = useState(false);

  useEffect(()=>{ if(authUser){saveData(clientes);setFlash(true);const t=setTimeout(()=>setFlash(false),1600);return ()=>clearTimeout(t);} },[clientes,authUser]);

  const filtrados=useMemo(()=>{ if(!authUser)return []; const q=busca.toLowerCase(); return clientes.filter(c=>(!q||c.nome.toLowerCase().includes(q)||(c.cpf||"").includes(q)||(c.telefone||"").includes(q))&&(fEtapa==="Todas"||c.etapa===fEtapa)&&(fStatus==="Todos"||c.statusCota===fStatus)); },[clientes,busca,fEtapa,fStatus,authUser]);

  if(!authUser) return <LoginScreen onLogin={u=>{setAuth(u);setAuthUser(u);}}/>;
  if(proposta)  return <ProposalView cliente={proposta} onClose={()=>setProposta(null)}/>;

  const salvar=data=>{ if(modalForm==="novo")setClientes(p=>[...p,{...data,id:uid(),historico:data.historico||[]}]); else{setClientes(p=>p.map(c=>c.id===modalForm.id?{...c,...data}:c));if(detalhe?.id===modalForm.id)setDetalhe(p=>({...p,...data}));} setModalForm(null); };
  const atualizar=u=>{setClientes(p=>p.map(c=>c.id===u.id?u:c));setDetalhe(u);};
  const excluir=id=>{if(window.confirm("Remover este cliente?"))setClientes(p=>p.filter(c=>c.id!==id));};
  const alertCount=clientes.filter(c=>c.followUp&&daysTo(c.followUp)<=3&&daysTo(c.followUp)>=0).length;
  const abas=[{id:"dashboard",label:"📊 Dashboard"},{id:"kanban",label:"📋 Funil"},{id:"lista",label:"📃 Clientes"}];

  return (
    <div style={{minHeight:"100vh",background:"#080b12",color:"#e2e8f0",fontFamily:"'Inter','Segoe UI',sans-serif"}}>
      <div style={{background:"#0a0e1a",borderBottom:"1px solid #1e2535",padding:"0 20px",display:"flex",alignItems:"center",gap:14,height:56,position:"sticky",top:0,zIndex:100}}>
        <img src={LOGO} alt="JBX" style={{height:34,width:"auto",filter:"drop-shadow(0 2px 8px rgba(196,160,40,.35))"}}/>
        <div style={{display:"flex",gap:2}}>{abas.map(a=><button key={a.id} onClick={()=>setAba(a.id)} style={{background:aba===a.id?"#1e2535":"transparent",border:"none",borderRadius:8,padding:"6px 12px",color:aba===a.id?"#e2e8f0":"#64748b",cursor:"pointer",fontSize:13,fontWeight:aba===a.id?700:400}}>{a.label}</button>)}</div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          {flash&&<span style={{color:"#22c55e",fontSize:12}}>✓</span>}
          {alertCount>0&&<span style={{background:"#f59e0b",color:"#000",borderRadius:99,fontSize:11,fontWeight:800,padding:"2px 8px"}}>⚡{alertCount}</span>}
          <span style={{color:"#475569",fontSize:12,borderRight:"1px solid #1e2535",paddingRight:10}}>{clientes.length}</span>
          <button onClick={()=>{clearAuth();setAuthUser(null);}} style={{background:"transparent",border:"1px solid #2d3748",borderRadius:8,padding:"5px 10px",color:"#94a3b8",cursor:"pointer",fontSize:12}}>Sair</button>
          <button onClick={()=>setModalForm("novo")} style={{background:"linear-gradient(135deg,#c4a028,#e8c94a)",border:"none",borderRadius:8,padding:"7px 14px",color:"#0d1544",cursor:"pointer",fontSize:13,fontWeight:800}}>＋ Novo</button>
        </div>
      </div>
      <div style={{padding:20}}>
        {aba!=="dashboard"&&<div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔍 Buscar…" style={{flex:1,minWidth:160,background:"#0f1117",border:"1px solid #1e2535",borderRadius:8,padding:"8px 12px",color:"#e2e8f0",fontSize:13,outline:"none"}}/>
          <select value={fEtapa} onChange={e=>setFEtapa(e.target.value)} style={{background:"#0f1117",border:"1px solid #1e2535",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:13}}><option>Todas</option>{ETAPAS.map(e=><option key={e}>{e}</option>)}</select>
          <select value={fStatus} onChange={e=>setFStatus(e.target.value)} style={{background:"#0f1117",border:"1px solid #1e2535",borderRadius:8,padding:"8px 10px",color:"#e2e8f0",fontSize:13}}><option>Todos</option>{STATUS.map(s=><option key={s}>{s}</option>)}</select>
        </div>}
        {aba==="dashboard"&&<Dashboard clientes={clientes}/>}
        {aba==="kanban"&&<Kanban clientes={filtrados} onCardClick={setDetalhe} onProposta={setProposta}/>}
        {aba==="lista"&&<Lista clientes={filtrados} onRowClick={setDetalhe} onEdit={c=>setModalForm(c)} onDelete={excluir} onProposta={setProposta}/>}
      </div>
      {modalForm&&<Modal title={modalForm==="novo"?"➕ Novo Cliente":"✏️ Editar"} onClose={()=>setModalForm(null)} wide><ClienteForm initial={modalForm!=="novo"?modalForm:null} onSave={salvar} onClose={()=>setModalForm(null)}/></Modal>}
      {detalhe&&<ClienteDetalhe cliente={detalhe} onClose={()=>setDetalhe(null)} onUpdate={atualizar} onEdit={c=>{setDetalhe(null);setModalForm(c);}} onProposta={setProposta}/>}
    </div>
  );
}
