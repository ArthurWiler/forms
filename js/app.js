/* ============================================================
   CEMIG — Aplicação principal (React + Babel)
   Formulário de Orçamento de Conexão BT
   ============================================================ */

// Orientações oficiais (conteúdo do portal Cemig)
const ORIENTACOES = {
  ate3: {
    titulo: "Atendimento individual (urbano ou rural) ou agrupamento com até 3 caixas sem disjuntor geral",
    intro: "Leia as orientações antes de iniciar. Este formulário destina-se a pedidos de Ligação Nova ou Aumento de Carga, conforme a Resolução Normativa ANEEL (REN) nº 1.000/2021.",
    itens: [
      "Destina-se a: Ligação Nova ou Aumento de Carga de unidade consumidora individual urbana e trifásica, com carga instalada até 75 kW.",
      "Aumento de carga para unidade consumidora individual rural, com carga instalada até 75 kW.",
      "Ligação Nova ou Aumento de Carga em agrupamento com até 3 caixas de medição que possua somente uma unidade trifásica, desde que as proteções dos disjuntores bipolares e do tripolar sejam de no máximo 63 A.",
      "A solicitação pode ser feita diretamente pelo Cemig Atende Web (Ligação Nova) ou presencialmente, mediante apresentação deste formulário preenchido e assinado.",
      "É importante informar as coordenadas de localização da propriedade. Embora não obrigatória na regra geral, ela agiliza o atendimento — e torna-se obrigatória para área rural a mais de 30 m da rede.",
    ],
    callout: "Pedido de vistoria e ligação: se o padrão estiver pronto para ligar, a vistoria é disparada após o orçamento; caso contrário, há prazo para solicitá-la. O orçamento pode ser cancelado após reprovações pelo mesmo motivo.",
  },
  mais3: {
    titulo: "Agrupamento com mais de 3 caixas, atendimento híbrido ou individual acima de 75 kW em Baixa Tensão",
    intro: "Para estes casos é necessário solicitar antecipadamente a Análise de Carga/Rede e preencher o formulário Padrão em Agrupamento com Proteção Geral, com emissão de ART, TRT ou RRT.",
    itens: [
      "Destina-se a: padrão trifásico individual acima de 75 kW; agrupamento com mais de 3 caixas de medição.",
      "Agrupamentos com unidade consumidora bifásica com proteção superior a 60 ou 63 A.",
      "Agrupamento com unidade consumidora trifásica com proteção trifásica acima de 60 ou 63 A; ou agrupamento com mais de uma unidade consumidora trifásica.",
      "A análise antecipada deve ser solicitada por um Responsável Técnico com registro regular no CREA/CRT/CFT/CAU, diretamente no Cemig Atende Web (serviço Análise de Carga ou Projeto Elétrico).",
      "O atendimento fica condicionado à apresentação do projeto elétrico com ART/TRT (ou equivalente) para edificações individuais ou de uso coletivo com demanda total superior a 304 kVA.",
      "Para carga instalada superior a 75 kW com opção por atendimento em BT, deve-se preencher também o Termo de opção de atendimento em Baixa Tensão, junto com o formulário e ART/TRT/RRT.",
    ],
    callout: "Se houver motores monofásicos acima de 15 CV e/ou trifásicos acima de 50 CV, é obrigatório anexar o formulário para análise de partida de motores. Atividades de irrigação/aquicultura exigem documentação ambiental específica.",
  },
};

// ===== CLASSIFICADOR =====
function classificar(c) {
  const motivos = [];
  let fluxo = "ate3";
  if (c.projeto) { fluxo = "mais3"; motivos.push("Aprovação de Projeto Elétrico de BT"); }
  if (c.edificacaoAcima75) { fluxo = "mais3"; motivos.push("Edificação individual acima de 75 kW em BT"); }
  if (Number(c.nCaixas) > 3) { fluxo = "mais3"; motivos.push("Agrupamento com mais de 3 caixas de medição"); }
  if (c.protecaoGeral) { fluxo = "mais3"; motivos.push("Opção por instalação de proteção geral"); }
  if (c.biAcima60) { fluxo = "mais3"; motivos.push("UC bifásica com proteção acima de 60/63 A"); }
  if (c.triAcima60) { fluxo = "mais3"; motivos.push("UC trifásica com proteção acima de 60/63 A"); }
  if (c.multiTri) { fluxo = "mais3"; motivos.push("Mais de uma unidade consumidora trifásica"); }
  if (fluxo === "ate3") motivos.push("Atendimento individual ou agrupamento até 3 caixas sem proteção geral");
  return { fluxo, motivos };
}

// Estado inicial de uma Unidade Consumidora
const estadoInicialUC = () => ({
  nPredial: "", complemento: "", caixa: "", solicitacao: "Conexão Nova",
  mudancaLocal: "Não", desligamento: "Não", atividade: "Residencial", ramo: "",
  instalacao: "", disjDe: "", disjPara: "", disjEscolhido: "",
  cargas: { qtds: CAT.map(() => 0), tipoA: "res", catA: 0, mots: [] },
});

// ============================================================
// APP PRINCIPAL
// ============================================================
function App() {
  const [etapa, setEtapa] = useState("classificador"); // classificador | form
  const [fluxo, setFluxo] = useState("ate3");
  const [classData, setClassData] = useState(null);
  const [classRes, setClassRes] = useState(null);
  const [aba, setAba] = useState("orient");

  // Dados compartilhados
  const [prop, setProp] = useState({
    nome: "", filiacao: "", email: "", rg: "", nasc: "", celular: "", fixo: "",
    cpfCnpj: "", laudoMedico: "Não", telProp: "", nis: "Não", numNis: "",
  });
  const [corr, setCorr] = useState({
    vencimento: "", receberEmail: "Sim", rua: "", bairro: "", num: "",
    compl: "", municipio: "", cep: "", estado: "MG", contaGlobal: "",
  });
  const [obra, setObra] = useState({
    art: "", prontoLigar: "Não", app: "Não", reservaLegal: "Não", mudancaColetivo: "Não",
    endereco: "", num: "", compl: "", bairro: "", cidade: "", estado: "MG",
    cep: "", localizacao: "Urbana", instalacaoUC: "", coordenada: "",
    distMenor30: "Sim", tipoRede: "Trifásica", transformador: "",
    pontoRef: "", nomePropriedade: "", distritoComunidade: "", instProxima: "",
  });
  const [classif, setClassif] = useState({
    solicitacao: "Conexão Nova", escopo: "", demandaAtual: "", nTotalUcs: "",
    disjSolicitado: "", disjAtual: "", nUcs: "", motorMono: false, motorTri: false,
    disjGeralCond: "", disjAntes: "Não", demandaCond: "",
  });
  const [gerador, setGerador] = useState({ possui: "Não", potencia: "", fonte: "", descricao: "" });
  const [obs, setObs] = useState("");
  const [cepStatus, setCepStatus] = useState({ obra: "", corr: "" });

  // Unidades consumidoras
  const [ucs, setUcs] = useState([estadoInicialUC()]);
  const setUC = (i, patch) => setUcs((p) => p.map((u, idx) => (idx === i ? { ...u, ...patch } : u)));
  const addUC = () => setUcs((p) => [...p, estadoInicialUC()]);
  const delUC = (i) => setUcs((p) => p.filter((_, idx) => idx !== i));

  const redeMono = obra.tipoRede === "Monofásica" || obra.tipoRede === "Bifásica";

  // ===== API DE CEP (ViaCEP) =====
  const buscarCEP = async (cep, alvo) => {
    const limpo = (cep || "").replace(/\D/g, "");
    if (limpo.length !== 8) { setCepStatus((p) => ({ ...p, [alvo]: "" })); return; }
    setCepStatus((p) => ({ ...p, [alvo]: "buscando" }));
    try {
      const r = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const dd = await r.json();
      if (dd.erro) { setCepStatus((p) => ({ ...p, [alvo]: "erro" })); return; }
      if (alvo === "obra") {
        setObra((o) => ({ ...o, endereco: dd.logradouro || o.endereco, bairro: dd.bairro || o.bairro,
          cidade: dd.localidade || o.cidade, estado: dd.uf || o.estado }));
      } else {
        setCorr((c) => ({ ...c, rua: dd.logradouro || c.rua, bairro: dd.bairro || c.bairro,
          municipio: dd.localidade || c.municipio, estado: dd.uf || c.estado }));
      }
      setCepStatus((p) => ({ ...p, [alvo]: "ok" }));
    } catch (e) { setCepStatus((p) => ({ ...p, [alvo]: "erro" })); }
  };

  // ===== VALIDAÇÃO DE DISJUNTORES (até 3 caixas, múltiplas UCs) =====
  const validacaoDisjuntores = useMemo(() => {
    if (fluxo !== "ate3" || ucs.length <= 1) return { ok: true, msg: "" };
    let tri = 0, monoBi = 0;
    ucs.forEach((u) => {
      const esc = u.disjEscolhido || (u.cargas?._disjuntores || [])[0] || "";
      if (/Tripolar/i.test(esc)) tri++;
      else if (/Mono|Bipolar/i.test(esc)) monoBi++;
    });
    const acima63 = ucs.some((u) => {
      const esc = u.disjEscolhido || (u.cargas?._disjuntores || [])[0] || "";
      const m = esc.match(/(\d+)\s*A/);
      return m && Number(m[1]) > 63;
    });
    if (acima63) return { ok: false, msg: "Há UC com disjuntor acima de 63 A. Nesse caso o atendimento exige proteção geral / projeto (mais de 3 caixas). Reclassifique o atendimento." };
    if (tri > 1) return { ok: false, msg: `Com mais de uma UC é permitido no máximo 1 disjuntor tripolar de 63 A (atual: ${tri}).` };
    if (monoBi > 2) return { ok: false, msg: `Com mais de uma UC são permitidos no máximo 2 disjuntores mono/bifásicos de 63 A (atual: ${monoBi}).` };
    return { ok: true, msg: `Combinação válida: ${tri} tripolar(es) 63 A + ${monoBi} mono/bifásico(s) 63 A.` };
  }, [fluxo, ucs]);

  const coordObrigatoria = obra.localizacao === "Rural" && obra.distMenor30 === "Não";
  const coordPreenchida = !!obra.coordenada;

  const demandaTotalGeral = useMemo(
    () => ucs.reduce((s, u) => s + (u.cargas?._demanda || 0), 0),
    [ucs]
  );

  const onConfirmClass = (fx, cd, res) => {
    setFluxo(fx); setClassData(cd); setClassRes(res);
    setClassif((p) => ({ ...p, nTotalUcs: cd.nCaixas }));
    const n = Math.max(1, Math.min(Number(cd.nCaixas) || 1, fx === "ate3" ? 3 : 30));
    setUcs(Array.from({ length: n }, () => estadoInicialUC()));
    setEtapa("form");
    setAba("orient");
  };

  // ===== ABAS (stepper) =====
  // Orientações vem primeiro (como no formulário MT). Classificação só no fluxo coletivo,
  // e sempre APÓS a declaração de cargas das UCs.
  const abasComuns = [
    { k: "orient", l: "Orientações" },
    { k: "prop", l: "Proprietário" },
    { k: "corr", l: "Correspondência" },
    { k: "obra", l: "Dados da Obra" },
  ];
  const abasFluxo = fluxo === "mais3"
    ? [{ k: "ucs", l: "Unidades Consumidoras" }, { k: "class", l: "Classificação" }, { k: "disj", l: "Disjuntores Prumada" }]
    : [{ k: "ucs", l: "Cargas e UCs" }, { k: "gerador", l: "Gerador de Emergência" }];
  const abas = [...abasComuns, ...abasFluxo, { k: "obs", l: "Observações" }, { k: "revisar", l: "Prévia & PDF" }];

  // ============================================================
  // GERAR PDF
  // ============================================================
  const gerarPDF = useCallback(() => {
    if (!window.jspdf) { alert("Biblioteca jsPDF não carregada. Verifique sua conexão."); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const PW = 210, PH = 297, MG = 14, CW = PW - 2 * MG;
    let cy = MG;

    const drawTopBar = () => {
      doc.setFillColor(0, 89, 42); doc.rect(0, 0, PW, 18, "F");
      doc.setFillColor(1, 136, 55); doc.rect(0, 0, 4, 18, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(255, 255, 255);
      doc.text("Formulário CEMIG - Orçamento de Conexão BT", MG, 8);
      doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(150, 210, 175);
      doc.text(fluxo === "mais3" ? "Agrupamento com Proteção Geral / Projeto BT (APR Web)" : "Atendimento individual ou agrupamento até 3 caixas sem proteção geral", MG, 13.5);
      cy = 24;
    };
    const footer = () => {
      doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor(150, 150, 150);
      doc.text("Documento gerado eletronicamente - não substitui o formulário oficial CEMIG", MG, PH - 7);
    };
    const checkSpace = (h) => { if (cy + h > PH - 14) { footer(); doc.addPage(); cy = MG; drawTopBar(); } };

    const sec = (txt) => {
      checkSpace(11);
      doc.setFillColor(232, 243, 236); doc.rect(MG, cy, CW, 7, "F");
      doc.setFillColor(1, 136, 55); doc.rect(MG, cy, 2.5, 7, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); doc.setTextColor(0, 70, 33);
      doc.text(txt, MG + 5, cy + 4.8); cy += 9;
    };
    const kvPairs = (pairs) => {
      const colW = CW / 2;
      for (let i = 0; i < pairs.length; i += 2) {
        checkSpace(8);
        [pairs[i], pairs[i + 1]].forEach((p, ci) => {
          if (!p) return;
          const x = MG + ci * colW;
          doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(110, 116, 130);
          doc.text(p[0] + ":", x + 1, cy + 3);
          doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(30, 32, 42);
          const val = doc.splitTextToSize(String(p[1] || "—"), colW - 4);
          doc.text(val[0], x + 1, cy + 6.8);
        });
        cy += 8.5;
      }
    };
    const fullLine = (label, val) => {
      const lines = doc.splitTextToSize(String(val || "—"), CW - 4);
      checkSpace(5 + lines.length * 4);
      doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(110, 116, 130);
      doc.text(label + ":", MG + 1, cy + 3);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(30, 32, 42);
      doc.text(lines, MG + 1, cy + 7); cy += 5 + lines.length * 4;
    };
    const totRow = (label, val) => {
      checkSpace(8);
      doc.setFillColor(1, 136, 55); doc.rect(MG, cy, CW, 7.5, "F");
      doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(230, 249, 213);
      doc.text(label, MG + 5, cy + 5.2);
      doc.text(val, MG + CW - 2, cy + 5.2, { align: "right" }); cy += 9;
    };

    drawTopBar();

    sec("CLASSIFICAÇÃO DO ATENDIMENTO");
    fullLine("Formulário", fluxo === "mais3" ? "Padrão em Agrupamento com Proteção Geral / Projeto BT (APR Web)" : "Orçamento de conexão urbana ou rural - atendimento individual ou agrupamento sem proteção geral");
    if (classRes) fullLine("Critérios", classRes.motivos.join("; "));
    kvPairs([["Qtd. de caixas de medição", classData?.nCaixas], ["Solicitação", classif.solicitacao]]);
    cy += 2;

    sec("1.  DADOS DO PROPRIETÁRIO");
    kvPairs([
      ["Nome Completo", prop.nome], ["CPF/CNPJ", prop.cpfCnpj],
      ["E-mail", prop.email], ["Celular", prop.celular],
      ["Telefone Fixo", prop.fixo], ["Telefone do Proprietário", prop.telProp],
      ["RG/RNE/RANI", prop.rg], ["Data Nasc.", prop.nasc],
      ["Filiação", prop.filiacao], ["Laudo médico (equip. essenciais)", prop.laudoMedico],
      ["NIS Tarifa Social", prop.nis === "Sim" ? prop.numNis : "Não"], ["", ""],
    ]);
    cy += 2;

    sec("2.  CORRESPONDÊNCIA E FATURA");
    kvPairs([["Receber fatura por e-mail", corr.receberEmail], ["Vencimento desejado", corr.vencimento], ["Conta globalizada", corr.contaGlobal], ["", ""]]);
    if (corr.receberEmail === "Não") {
      kvPairs([
        ["Rua/Av", corr.rua], ["Nº", corr.num],
        ["Bairro/Distrito", corr.bairro], ["Complemento", corr.compl],
        ["Município", corr.municipio], ["CEP", corr.cep], ["Estado", corr.estado], ["", ""],
      ]);
    }
    cy += 2;

    sec("3.  DADOS DA OBRA (PADRÃO DE ENTRADA)");
    const obraPairs = [
      ["Endereço", obra.endereco], ["Nº", obra.num],
      ["Complemento", obra.compl], ["Bairro", obra.bairro],
      ["Cidade", obra.cidade], ["Estado", obra.estado],
      ["CEP", obra.cep], ["Localização", obra.localizacao],
      ["Instalação / UC", obra.instalacaoUC],
    ];
    if (fluxo === "mais3") obraPairs.push(["Nº ART/TRT de Projeto", obra.art]);
    obraPairs.push(
      ["Coordenadas", obra.coordenada],
      ["Padrão pronto p/ ligar?", obra.prontoLigar], ["Em APP?", obra.app],
      ["Reserva Legal?", obra.reservaLegal], ["Tipo de rede BT", obra.tipoRede],
      ["Distância < 30 m da rede?", obra.distMenor30], ["Transformador próximo", obra.transformador],
    );
    kvPairs(obraPairs);
    if (obra.localizacao === "Rural") {
      kvPairs([
        ["Distrito/Comunidade", obra.distritoComunidade], ["Nome da propriedade", obra.nomePropriedade],
        ["Ponto de referência", obra.pontoRef], ["Inst. mais próxima", obra.instProxima],
      ]);
    }
    cy += 2;

    if (fluxo === "mais3") {
      sec("4.  CLASSIFICAÇÃO / DEMANDA DO ATENDIMENTO");
      kvPairs([
        ["Solicitação", classif.solicitacao], ["Escopo", classif.escopo],
        ["Nº total de UCs", classif.nTotalUcs], ["Nº de UCs", classif.nUcs],
        ["Disjuntor solicitado", classif.disjSolicitado], ["Disjuntor atual", classif.disjAtual],
        ["Demanda futura (kVA)", fmt2(demandaTotalGeral)], ["Demanda atual (kVA)", classif.demandaAtual],
        ["Motor MONO > 15 CV", classif.motorMono ? "Sim" : "Não"], ["Motor TRI > 50 CV", classif.motorTri ? "Sim" : "Não"],
        ["Disjuntor geral condomínio", classif.disjGeralCond], ["Demanda condomínio (kVA)", classif.demandaCond],
      ]);
      cy += 2;
    }

    ucs.forEach((u, ui) => {
      sec(`5.${ui + 1}  UNIDADE CONSUMIDORA ${ui + 1}`);
      kvPairs([
        ["Solicitação", u.solicitacao], ["Atividade principal", u.atividade],
        ["Nº Predial", u.nPredial], ["Complemento", u.complemento],
        ["Caixa / Identificação", u.caixa], ["Ramo de atividade", u.ramo],
        ["Nº Instalação", u.instalacao], ["Mudança de local", u.mudancaLocal],
        ["Disjuntor De", u.disjDe], ["Disjuntor Para", u.disjPara],
      ]);
      const qtds = u.cargas?.qtds || [];
      const itens = CAT.map((c, i) => ({ ...c, q: qtds[i] || 0 })).filter((x) => x.q > 0);
      if (itens.length) {
        checkSpace(6);
        doc.setFillColor(215, 218, 226); doc.rect(MG, cy, CW, 5.5, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(7); doc.setTextColor(90, 96, 115);
        doc.text("Equipamento", MG + 2, cy + 3.8);
        doc.text("Pot. (W)", MG + 95, cy + 3.8);
        doc.text("Qtd", MG + 125, cy + 3.8, { align: "center" });
        doc.text("Total (W)", MG + CW - 2, cy + 3.8, { align: "right" }); cy += 5.5;
        let ri = 0;
        itens.forEach((it) => {
          checkSpace(5);
          doc.setFillColor(ri % 2 ? 247 : 255, ri % 2 ? 248 : 255, ri % 2 ? 251 : 255);
          doc.rect(MG, cy, CW, 5, "F");
          doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(30, 32, 42);
          doc.text(it.n, MG + 2, cy + 3.5);
          doc.text(fmtW(it.w), MG + 95, cy + 3.5);
          doc.text(String(it.q), MG + 125, cy + 3.5, { align: "center" });
          doc.text(fmtW(it.q * it.w), MG + CW - 2, cy + 3.5, { align: "right" }); ri++; cy += 5;
        });
      }
      (u.cargas?.mots || []).filter((m) => (m.q || 0) > 0).forEach((m) => {
        checkSpace(5);
        doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(60, 60, 70);
        doc.text(`Motor ${m.fase === "mono" ? "Monofásico" : "Trifásico"} ${m.cv} CV (Cat. ${(m.col || "").replace("c", "")}) - Qtd: ${m.q}`, MG + 2, cy + 3.5);
        cy += 5;
      });
      checkSpace(8);
      totRow(`Carga ${fmt2(u.cargas?._cargaKw || 0)} kW  |  Demanda`, `${fmt2(u.cargas?._demanda || 0)} kVA`);
      if (u.cargas?._disjuntores?.length) fullLine("Disjuntor sugerido (ND-5.1)", u.cargas._disjuntores.join("  ·  "));
      if (u.disjEscolhido) fullLine("Disjuntor escolhido", u.disjEscolhido);
      cy += 2;
    });

    if (fluxo === "mais3") {
      sec("6.  DISJUNTORES DE PAVIMENTO/BLOCO E PRUMADA");
      kvPairs([
        ["Disjuntor geral solicitado", classif.disjSolicitado], ["Disjuntor geral atual", classif.disjAtual],
        ["Disjuntor cond./incêndio", classif.disjGeralCond], ["Disj. antes do geral?", classif.disjAntes],
      ]);
      cy += 2;
    }

    if (fluxo === "ate3") {
      sec("7.  GERADOR DE EMERGÊNCIA");
      const gp = [["Há gerador de emergência?", gerador.possui]];
      if (gerador.possui === "Sim") gp.push(["Potência (kVA)", gerador.potencia], ["Fonte/Combustível", gerador.fonte]);
      kvPairs(gp);
      if (gerador.possui === "Sim" && gerador.descricao) fullLine("Descrição", gerador.descricao);
      cy += 2;
    }

    sec("OBSERVAÇÕES");
    fullLine("Obs.", obs || "—");
    cy += 4;

    totRow("DEMANDA TOTAL DO ATENDIMENTO", `${fmt2(demandaTotalGeral)} kVA`);
    cy += 4;

    checkSpace(20);
    doc.setDrawColor(180, 180, 180); doc.line(MG + 30, cy + 8, MG + CW - 30, cy + 8);
    doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(90, 90, 90);
    doc.text("Local e data / Assinatura do proprietário ou representante legal", PW / 2, cy + 12, { align: "center" });

    footer();
    const nomeArq = (prop.nome || "formulario").replace(/[^a-zA-Z0-9]/g, "_").slice(0, 30);
    doc.save(`CEMIG_${fluxo}_${nomeArq}.pdf`);
  }, [fluxo, classData, classRes, prop, corr, obra, classif, ucs, gerador, obs, demandaTotalGeral]);

  // ============================================================
  // RENDER — Tela do Classificador
  // ============================================================
  if (etapa === "classificador") {
    return <Classificador onConfirm={onConfirmClass} />;
  }

  const idx = abas.findIndex((a) => a.k === aba);
  const irProx = () => setAba(abas[Math.min(idx + 1, abas.length - 1)].k);
  const irAnt = () => setAba(abas[Math.max(idx - 1, 0)].k);
  const orient = ORIENTACOES[fluxo];

  return (
    <div>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-inner">
          <a className="logo-cemig" href="#"><LogoCemig /></a>
          <div className="topbar-links">
            <a href="https://atende.cemig.com.br/Login" target="_blank" rel="noreferrer">CEMIG ATENDE</a>
            <a href="https://partapr.cemig.com.br/PARTAPR/SelecaoModulo.aspx" target="_blank" rel="noreferrer">APRWEB</a>
          </div>
        </div>
      </div>

      {/* CABEÇALHO */}
      <div className="form-header">
        <h1>Formulário de Orçamento de Conexão / Alteração de Carga em Baixa Tensão</h1>
        <p>Preenchimento digital para solicitações em Baixa Tensão (BT), conforme as normas CEMIG ND-5.1 / ND-5.2 e a REN ANEEL nº 1.000/2021.</p>
        <span className="flow-badge">
          {fluxo === "mais3" ? "Agrupamento com Proteção Geral (APR Web)" : "Até 3 caixas sem proteção geral"} · Demanda total {fmt2(demandaTotalGeral)} kVA
        </span>
      </div>

      {/* STEPPER */}
      <div className="stepper">
        {abas.map((a, i) => (
          <button key={a.k} className={"step" + (a.k === aba ? " active" : i < idx ? " done" : "")} onClick={() => setAba(a.k)}>
            <span className="step-num">{i === 0 ? "i" : i}</span>
            <span className="step-label">{a.l}</span>
          </button>
        ))}
      </div>

      <div className="content fade-in" key={aba}>
        {/* ===== ORIENTAÇÕES ===== */}
        {aba === "orient" && (
          <Card eyebrow="Comece por aqui" title="Orientações para preenchimento" sub={orient.intro}>
            <div style={{ fontWeight: 700, color: "var(--verde-escuro)", fontSize: 14, marginBottom: 4 }}>{orient.titulo}</div>
            <ul className="orient-list">
              {orient.itens.map((it, i) => (
                <li key={i} className="orient-item">
                  <span className="orient-num">{i + 1}</span>
                  <p>{it}</p>
                </li>
              ))}
            </ul>
            <div className="callout">{orient.callout}</div>
            <div className="legend">
              <span><span className="req">*</span> Campo de preenchimento obrigatório</span>
              <span><span className="req">**</span> Obrigatório para pessoa física</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <Btn variant="primary" onClick={irProx}>Iniciar preenchimento →</Btn>
            </div>
          </Card>
        )}

        {/* ===== PROPRIETÁRIO ===== */}
        {aba === "prop" && (
          <Card eyebrow="Etapa de dados" title="1. Dados do Proprietário" sub="Titular da conta de energia ou proprietário/possuidor do imóvel. (*) obrigatório · (**) obrigatório para pessoa física.">
            <div className="grid grid-2">
              <Field label="Nome Completo (sem abreviações)" req span={2}><Inp value={prop.nome} onChange={(e) => setProp({ ...prop, nome: e.target.value })} /></Field>
              <Field label="CPF / CNPJ" req><Inp value={prop.cpfCnpj} onChange={(e) => setProp({ ...prop, cpfCnpj: e.target.value })} /></Field>
              <Field label="E-mail" req><Inp type="email" value={prop.email} onChange={(e) => setProp({ ...prop, email: e.target.value })} /></Field>
              <Field label="Filiação (Mãe ou Pai) **"><Inp value={prop.filiacao} onChange={(e) => setProp({ ...prop, filiacao: e.target.value })} /></Field>
              <Field label="RG / RNE / RANI **"><Inp value={prop.rg} onChange={(e) => setProp({ ...prop, rg: e.target.value })} /></Field>
              <Field label="Data de Nascimento **"><Inp type="date" value={prop.nasc} onChange={(e) => setProp({ ...prop, nasc: e.target.value })} /></Field>
              <Field label="Celular" req><Inp value={prop.celular} onChange={(e) => setProp({ ...prop, celular: e.target.value })} /></Field>
              <Field label="Telefone Fixo"><Inp value={prop.fixo} onChange={(e) => setProp({ ...prop, fixo: e.target.value })} /></Field>
              <Field label="Telefone do Proprietário" req><Inp value={prop.telProp} onChange={(e) => setProp({ ...prop, telProp: e.target.value })} /></Field>
              <Field label="Possui laudo médico (equipamentos essenciais)? **" span={2}>
                <Toggle value={prop.laudoMedico} onChange={(v) => setProp({ ...prop, laudoMedico: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
              </Field>
              <Field label="Possui NIS para Tarifa Social? **">
                <Toggle value={prop.nis} onChange={(v) => setProp({ ...prop, nis: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
              </Field>
              {prop.nis === "Sim" && <Field label="Número do NIS" req><Inp value={prop.numNis} onChange={(e) => setProp({ ...prop, numNis: e.target.value })} /></Field>}
            </div>
          </Card>
        )}

        {/* ===== CORRESPONDÊNCIA ===== */}
        {aba === "corr" && (
          <Card eyebrow="Etapa de dados" title="2. Correspondência e Fatura" sub="Como o cliente deseja receber a conta de energia.">
            <div className="grid grid-2">
              <Field label="Deseja receber a fatura no e-mail informado?" req>
                <Toggle value={corr.receberEmail} onChange={(v) => setCorr({ ...corr, receberEmail: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
              </Field>
              <Field label="Data de vencimento desejada (conexão nova)"><Inp value={corr.vencimento} onChange={(e) => setCorr({ ...corr, vencimento: e.target.value })} placeholder="Ex: dia 10" /></Field>
            </div>
            {corr.receberEmail === "Não" && (
              <div className="grid grid-2 divider">
                <Field label="CEP (preenchimento automático)" span={2} hint="Digite o CEP para preencher o endereço automaticamente.">
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ maxWidth: 180 }}><Inp value={corr.cep} onChange={(e) => { const v = e.target.value; setCorr({ ...corr, cep: v }); buscarCEP(v, "corr"); }} placeholder="00000-000" /></div>
                    {cepStatus.corr === "buscando" && <span className="spinner"></span>}
                    {cepStatus.corr === "ok" && <Badge>endereço preenchido</Badge>}
                    {cepStatus.corr === "erro" && <span style={{ color: "var(--vermelho)", fontSize: 12 }}>CEP não encontrado</span>}
                  </div>
                </Field>
                <Field label="Rua / Av." span={2}><Inp value={corr.rua} onChange={(e) => setCorr({ ...corr, rua: e.target.value })} /></Field>
                <Field label="Nº"><Inp value={corr.num} onChange={(e) => setCorr({ ...corr, num: e.target.value })} /></Field>
                <Field label="Complemento"><Inp value={corr.compl} onChange={(e) => setCorr({ ...corr, compl: e.target.value })} /></Field>
                <Field label="Bairro / Distrito"><Inp value={corr.bairro} onChange={(e) => setCorr({ ...corr, bairro: e.target.value })} /></Field>
                <Field label="Município"><Inp value={corr.municipio} onChange={(e) => setCorr({ ...corr, municipio: e.target.value })} /></Field>
                <Field label="Estado"><Inp value={corr.estado} onChange={(e) => setCorr({ ...corr, estado: e.target.value })} /></Field>
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <Field label="Conta globalizada (poder público — código de débito automático globalizado)"><Inp value={corr.contaGlobal} onChange={(e) => setCorr({ ...corr, contaGlobal: e.target.value })} placeholder="Opcional" /></Field>
            </div>
          </Card>
        )}

        {/* ===== OBRA ===== */}
        {aba === "obra" && (
          <Card eyebrow="Etapa de dados" title="3. Dados da Obra" sub="Endereço do padrão de entrada / ponto de entrega.">
            <div className="grid grid-2">
              <Field label="Zona de localização" req>
                <Toggle value={obra.localizacao} onChange={(v) => setObra({ ...obra, localizacao: v })} options={[{ v: "Urbana", l: "Urbana" }, { v: "Rural", l: "Rural" }]} />
              </Field>
              {fluxo === "mais3" && <Field label="Nº ART/TRT de Projeto" req hint="Obrigatório para atendimentos via APR Web."><Inp value={obra.art} onChange={(e) => setObra({ ...obra, art: e.target.value })} /></Field>}
            </div>

            {obra.localizacao === "Urbana" && (
              <div className="grid grid-2" style={{ marginTop: 14 }}>
                <Field label="CEP (preenchimento automático)" req span={2} hint="Digite o CEP para preencher endereço, bairro, cidade e estado.">
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ maxWidth: 180 }}><Inp value={obra.cep} onChange={(e) => { const v = e.target.value; setObra({ ...obra, cep: v }); buscarCEP(v, "obra"); }} placeholder="00000-000" /></div>
                    {cepStatus.obra === "buscando" && <span className="spinner"></span>}
                    {cepStatus.obra === "ok" && <Badge>endereço preenchido</Badge>}
                    {cepStatus.obra === "erro" && <span style={{ color: "var(--vermelho)", fontSize: 12 }}>CEP não encontrado</span>}
                  </div>
                </Field>
                <Field label="Endereço" req span={2}><Inp value={obra.endereco} onChange={(e) => setObra({ ...obra, endereco: e.target.value })} /></Field>
                <Field label="Nº" req><Inp value={obra.num} onChange={(e) => setObra({ ...obra, num: e.target.value })} /></Field>
                <Field label="Complemento"><Inp value={obra.compl} onChange={(e) => setObra({ ...obra, compl: e.target.value })} /></Field>
                <Field label="Bairro" req><Inp value={obra.bairro} onChange={(e) => setObra({ ...obra, bairro: e.target.value })} /></Field>
                <Field label="Cidade / Município" req><Inp value={obra.cidade} onChange={(e) => setObra({ ...obra, cidade: e.target.value })} /></Field>
                <Field label="Estado" req><Inp value={obra.estado} onChange={(e) => setObra({ ...obra, estado: e.target.value })} /></Field>
                <Field label="Instalação / UC"><Inp value={obra.instalacaoUC} onChange={(e) => setObra({ ...obra, instalacaoUC: e.target.value })} /></Field>
              </div>
            )}

            {obra.localizacao === "Rural" && (
              <div className="grid grid-2" style={{ marginTop: 14 }}>
                <Field label="Município" req><Inp value={obra.cidade} onChange={(e) => setObra({ ...obra, cidade: e.target.value })} /></Field>
                <Field label="Estado" req><Inp value={obra.estado} onChange={(e) => setObra({ ...obra, estado: e.target.value })} /></Field>
                <Field label="Distrito / Comunidade / Região"><Inp value={obra.distritoComunidade} onChange={(e) => setObra({ ...obra, distritoComunidade: e.target.value })} /></Field>
                <Field label="Nome da propriedade"><Inp value={obra.nomePropriedade} onChange={(e) => setObra({ ...obra, nomePropriedade: e.target.value })} /></Field>
                <Field label="Ponto de referência"><Inp value={obra.pontoRef} onChange={(e) => setObra({ ...obra, pontoRef: e.target.value })} /></Field>
                <Field label="Nº instalação mais próxima"><Inp value={obra.instProxima} onChange={(e) => setObra({ ...obra, instProxima: e.target.value })} /></Field>
              </div>
            )}

            <div className="grid grid-2 divider">
              <Field label="Distância padrão→rede CEMIG inferior a 30 m?">
                <Toggle value={obra.distMenor30} onChange={(v) => setObra({ ...obra, distMenor30: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
              </Field>
              <Field label={coordObrigatoria ? "Coordenada (lat, long)" : "Coordenada (lat, long) — opcional"} req={coordObrigatoria} hint="Ex: -19.9123, -43.9385">
                <Inp value={obra.coordenada} onChange={(e) => setObra({ ...obra, coordenada: e.target.value })} placeholder="-19.9123, -43.9385" />
              </Field>
            </div>
            {coordObrigatoria && !coordPreenchida && (
              <div className="alert alert-warn" style={{ marginTop: 8 }}>
                ⚠ Em área rural com distância superior a 30 m da rede CEMIG, a informação da coordenada é obrigatória para localização da propriedade.
              </div>
            )}

            <div className="grid grid-2 divider">
              <Field label="O padrão está pronto para ser ligado?" req>
                <Toggle value={obra.prontoLigar} onChange={(v) => setObra({ ...obra, prontoLigar: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
              </Field>
              <Field label="UC em Área de Preservação Permanente (APP)?">
                <Toggle value={obra.app} onChange={(v) => setObra({ ...obra, app: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
              </Field>
              <Field label="UC em Reserva Legal?">
                <Toggle value={obra.reservaLegal} onChange={(v) => setObra({ ...obra, reservaLegal: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
              </Field>
              {fluxo === "mais3" && (
                <Field label="Mudança em padrão coletivo existente?">
                  <Toggle value={obra.mudancaColetivo} onChange={(v) => setObra({ ...obra, mudancaColetivo: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
                </Field>
              )}
              <Field label="Tipo de rede BT que atende o local">
                <Sel value={obra.tipoRede} onChange={(e) => setObra({ ...obra, tipoRede: e.target.value })}>
                  <option>Monofásica</option><option>Bifásica</option><option>Trifásica</option>
                </Sel>
              </Field>
              <Field label="Código do transformador mais próximo"><Inp value={obra.transformador} onChange={(e) => setObra({ ...obra, transformador: e.target.value })} /></Field>
            </div>
          </Card>
        )}

        {/* ===== UNIDADES CONSUMIDORAS + CALCULADORA ===== */}
        {aba === "ucs" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
              <div>
                <div className="section-eyebrow">Declaração de cargas</div>
                <h3 className="card-title">{fluxo === "mais3" ? "Dados das Unidades Consumidoras" : "Cargas e Unidades Consumidoras"}</h3>
                <p className="card-sub" style={{ marginBottom: 0 }}>Preencha os dados e a relação de cargas de cada UC. O disjuntor é dimensionado automaticamente (ND-5.1).</p>
              </div>
              <Btn variant="primary" onClick={addUC}>+ Adicionar UC</Btn>
            </div>

            {fluxo === "ate3" && ucs.length > 1 && (
              <div className={"alert " + (validacaoDisjuntores.ok ? "alert-ok" : "alert-warn")}>
                <b>Regra de disjuntores (até 3 caixas, múltiplas UCs):</b> no máximo 1 disjuntor tripolar de 63 A e/ou até 2 disjuntores mono/bifásicos de 63 A, ou uma combinação entre eles. {validacaoDisjuntores.ok ? "✔ " : "⚠ "}{validacaoDisjuntores.msg}
              </div>
            )}

            {ucs.map((u, ui) => (
              <Card key={ui}>
                <div className="uc-head">
                  <Badge>Unidade Consumidora {ui + 1}</Badge>
                  {ucs.length > 1 && <button type="button" onClick={() => delUC(ui)} style={{ border: "none", background: "none", color: "var(--vermelho)", cursor: "pointer", fontSize: 13 }}>✕ Remover</button>}
                </div>
                <div className="grid grid-3" style={{ marginBottom: 14 }}>
                  <Field label="Tipo de solicitação" req>
                    <Sel value={u.solicitacao} onChange={(e) => setUC(ui, { solicitacao: e.target.value })}>
                      <option>Conexão Nova</option><option>Alteração de Carga</option><option>Caixa Existente sem Alteração</option>
                    </Sel>
                  </Field>
                  <Field label="Atividade principal" req>
                    <Sel value={u.atividade} onChange={(e) => setUC(ui, { atividade: e.target.value })}>
                      <option>Residencial</option><option>Comercial</option><option>Industrial</option><option>Rural</option>
                    </Sel>
                  </Field>
                  <Field label="Ramo de atividade"><Inp value={u.ramo} onChange={(e) => setUC(ui, { ramo: e.target.value })} placeholder="Se não residencial" /></Field>
                  {u.solicitacao === "Conexão Nova" ? (
                    <React.Fragment>
                      <Field label="Nº Predial" req><Inp value={u.nPredial} onChange={(e) => setUC(ui, { nPredial: e.target.value })} /></Field>
                      <Field label="Complemento" req={ucs.length > 1}><Inp value={u.complemento} onChange={(e) => setUC(ui, { complemento: e.target.value })} placeholder="Ex: Apto 101, Casa 1, Lj1" /></Field>
                      <Field label="Caixa / Identificação"><Inp value={u.caixa} onChange={(e) => setUC(ui, { caixa: e.target.value })} /></Field>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Field label="Nº Instalação / Medidor / Caixa" req><Inp value={u.instalacao} onChange={(e) => setUC(ui, { instalacao: e.target.value })} /></Field>
                      <Field label="Complemento" req={ucs.length > 1}><Inp value={u.complemento} onChange={(e) => setUC(ui, { complemento: e.target.value })} placeholder="Ex: Apto 101, Casa 1, Lj1" /></Field>
                      <Field label="Necessária mudança de local?">
                        <Toggle value={u.mudancaLocal} onChange={(v) => setUC(ui, { mudancaLocal: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
                      </Field>
                      <Field label="Desligamento programado?">
                        <Toggle value={u.desligamento} onChange={(v) => setUC(ui, { desligamento: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
                      </Field>
                      <Field label="Disjuntor De"><Inp value={u.disjDe} onChange={(e) => setUC(ui, { disjDe: e.target.value })} placeholder="Ex: 1x40" /></Field>
                      <Field label="Disjuntor Para"><Inp value={u.disjPara} onChange={(e) => setUC(ui, { disjPara: e.target.value })} placeholder="Ex: 3x60" /></Field>
                    </React.Fragment>
                  )}
                </div>
                <div className="dashed-box">
                  <div className="subbox-title" style={{ marginBottom: 8 }}>Relação de cargas e cálculo de demanda (ND-5.1)</div>
                  <CalcDemanda data={u.cargas} onChange={(c) => setUC(ui, { cargas: c })} redeMono={redeMono} />
                  {u.cargas?._disjuntores?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <Field label="Disjuntor escolhido para esta UC">
                        <Sel value={u.disjEscolhido || u.cargas._disjuntores[0]} onChange={(e) => setUC(ui, { disjEscolhido: e.target.value })}>
                          {u.cargas._disjuntores.map((dj) => <option key={dj} value={dj}>{dj}</option>)}
                        </Sel>
                      </Field>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ===== CLASSIFICAÇÃO (somente mais3, após cargas) ===== */}
        {aba === "class" && fluxo === "mais3" && (
          <Card eyebrow="Após declaração das cargas" title="4. Classificação do Atendimento" sub="Exclusivo do formulário de atendimento coletivo (agrupamento com proteção geral). A demanda futura é calculada automaticamente a partir das cargas declaradas.">
            <div className="grid grid-2">
              <Field label="Solicitação" req>
                <Sel value={classif.solicitacao} onChange={(e) => setClassif({ ...classif, solicitacao: e.target.value })}>
                  <option>Conexão Nova</option><option>Alteração de Carga</option><option>Caixa Existente sem Alteração</option><option>Atendimento Híbrido</option>
                </Sel>
              </Field>
              <Field label="Escopo do atendimento"><Inp value={classif.escopo} onChange={(e) => setClassif({ ...classif, escopo: e.target.value })} /></Field>
              <Field label="Nº total de Unidades Consumidoras" req><Inp type="number" value={classif.nTotalUcs} onChange={(e) => setClassif({ ...classif, nTotalUcs: e.target.value })} /></Field>
              <Field label="Nº de UCs a serem alteradas" req><Inp type="number" value={classif.nUcs} onChange={(e) => setClassif({ ...classif, nUcs: e.target.value })} /></Field>
              <Field label="Demanda futura (kVA) — auto"><div style={{ background: "var(--verde-claro)", borderRadius: 8, padding: "9px 11px", fontWeight: 700, color: "var(--verde)" }}>{fmt2(demandaTotalGeral)} kVA</div></Field>
              <Field label="Demanda atual (kVA)"><Inp value={classif.demandaAtual} onChange={(e) => setClassif({ ...classif, demandaAtual: e.target.value })} /></Field>
              <Field label="Disjuntor solicitado" req><Inp value={classif.disjSolicitado} onChange={(e) => setClassif({ ...classif, disjSolicitado: e.target.value })} /></Field>
              <Field label="Disjuntor atual"><Inp value={classif.disjAtual} onChange={(e) => setClassif({ ...classif, disjAtual: e.target.value })} /></Field>
              <Field label="Possui motor MONO > 15 CV?">
                <Toggle value={classif.motorMono} onChange={(v) => setClassif({ ...classif, motorMono: v })} options={[{ v: true, l: "Sim" }, { v: false, l: "Não" }]} />
              </Field>
              <Field label="Possui motor TRI > 50 CV?">
                <Toggle value={classif.motorTri} onChange={(v) => setClassif({ ...classif, motorTri: v })} options={[{ v: true, l: "Sim" }, { v: false, l: "Não" }]} />
              </Field>
            </div>
            {(classif.motorMono || classif.motorTri) && <div className="alert alert-info" style={{ marginTop: 14 }}>É obrigatório anexar o formulário para análise de partida de motores (motor mono &gt; 15 CV e/ou tri &gt; 50 CV).</div>}
          </Card>
        )}

        {/* ===== DISJUNTORES PRUMADA (mais3) ===== */}
        {aba === "disj" && fluxo === "mais3" && (
          <Card eyebrow="Edificação coletiva" title="Disjuntores de Pavimento/Bloco e Prumada" sub="Informe os disjuntores gerais e de prumada da edificação coletiva.">
            <div className="grid grid-2">
              <Field label="Disjuntor geral solicitado"><Inp value={classif.disjSolicitado} onChange={(e) => setClassif({ ...classif, disjSolicitado: e.target.value })} /></Field>
              <Field label="Disjuntor geral atual"><Inp value={classif.disjAtual} onChange={(e) => setClassif({ ...classif, disjAtual: e.target.value })} /></Field>
              <Field label="Disjuntor condomínio / combate a incêndio"><Inp value={classif.disjGeralCond} onChange={(e) => setClassif({ ...classif, disjGeralCond: e.target.value })} /></Field>
              <Field label="Disjuntor antes do geral?">
                <Toggle value={classif.disjAntes} onChange={(v) => setClassif({ ...classif, disjAntes: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
              </Field>
            </div>
            <div className="callout" style={{ marginTop: 14 }}>
              Demanda total somada das UCs: <b>{fmt2(demandaTotalGeral)} kVA</b>. Para demanda total superior a 304 kVA, o atendimento fica condicionado à apresentação de projeto elétrico com ART/TRT.
            </div>
          </Card>
        )}

        {/* ===== GERADOR DE EMERGÊNCIA (ate3) ===== */}
        {aba === "gerador" && fluxo === "ate3" && (
          <Card eyebrow="Complementar" title="Gerador de Emergência" sub="Informe se a instalação possui gerador de emergência.">
            <Field label="Há gerador de emergência?" req>
              <Toggle value={gerador.possui} onChange={(v) => setGerador({ ...gerador, possui: v })} options={[{ v: "Sim", l: "Sim" }, { v: "Não", l: "Não" }]} />
            </Field>
            {gerador.possui === "Sim" && (
              <div className="grid grid-2" style={{ marginTop: 14 }}>
                <Field label="Potência do gerador (kVA)"><Inp value={gerador.potencia} onChange={(e) => setGerador({ ...gerador, potencia: e.target.value })} /></Field>
                <Field label="Fonte / Combustível">
                  <Sel value={gerador.fonte} onChange={(e) => setGerador({ ...gerador, fonte: e.target.value })}>
                    <option value="">Selecione</option><option>Diesel</option><option>Gasolina</option><option>Gás (GLP/GNV)</option><option>Outro</option>
                  </Sel>
                </Field>
                <Field label="Descrição / Observações do gerador" span={2}><Inp value={gerador.descricao} onChange={(e) => setGerador({ ...gerador, descricao: e.target.value })} placeholder="Modelo, finalidade, regime de operação..." /></Field>
                <div className="col-span-2 callout">O gerador de emergência opera de forma isolada (sem paralelismo com a rede CEMIG). Caso haja paralelismo ou injeção, o atendimento deve ser tratado como Geração Distribuída.</div>
              </div>
            )}
          </Card>
        )}

        {/* ===== OBSERVAÇÕES ===== */}
        {aba === "obs" && (
          <Card eyebrow="Informações adicionais" title="Observações" sub="Inclua informações relevantes: justificativa de disjuntor, atendimento híbrido, geração já conectada, etc.">
            <Field><textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={6} /></Field>
          </Card>
        )}

        {/* ===== PRÉVIA & PDF ===== */}
        {aba === "revisar" && (
          <div>
            <Card eyebrow="Etapa final" title="Prévia do Formulário" sub="Confira os dados abaixo. Se algo estiver incorreto, volte às etapas anteriores. Quando estiver tudo certo, exporte o PDF.">
              <div className="kpi-row">
                <div className="kpi"><div className="kpi-label">Proprietário</div><div className="kpi-value" style={{ fontSize: 14 }}>{prop.nome || "—"}</div></div>
                <div className="kpi"><div className="kpi-label">Unidades Consumidoras</div><div className="kpi-value">{ucs.length}</div></div>
                <div className="kpi dark"><div className="kpi-label">Demanda Total</div><div className="kpi-value" style={{ fontSize: 18 }}>{fmt2(demandaTotalGeral)} kVA</div></div>
              </div>
              <div className="preview-block">
                <h4>Formulário</h4>
                <div className="preview-item"><span className="v">{fluxo === "mais3" ? "Padrão em Agrupamento com Proteção Geral (APR Web)" : "Orçamento de conexão até 3 caixas sem proteção geral"}</span></div>
              </div>
              <div className="preview-block">
                <h4>Obra</h4>
                <div className="preview-grid">
                  <div className="preview-item"><span className="k">Endereço</span><span className="v">{obra.endereco || "—"}, {obra.num || "s/n"}</span></div>
                  <div className="preview-item"><span className="k">Cidade / UF</span><span className="v">{obra.cidade || "—"} / {obra.estado}</span></div>
                  <div className="preview-item"><span className="k">Localização</span><span className="v">{obra.localizacao}</span></div>
                  <div className="preview-item"><span className="k">Coordenada</span><span className="v">{obra.coordenada || "—"}</span></div>
                </div>
              </div>
              <div className="preview-block">
                <h4>Unidades Consumidoras</h4>
                {ucs.map((u, ui) => (
                  <div key={ui} className="preview-item" style={{ display: "flex", justifyContent: "space-between" }}>
                    <span className="v">UC {ui + 1} · {u.atividade} · {u.solicitacao} {u.complemento ? `· ${u.complemento}` : ""}</span>
                    <span style={{ color: "var(--verde)", fontWeight: 700 }}>{fmt2(u.cargas?._demanda || 0)} kVA · {u.disjEscolhido || (u.cargas?._disjuntores || [])[0] || "—"}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card sub="Anexe à solicitação: planta de situação (A4), ART/TRT de projeto (quando aplicável) e documentos de regularidade do imóvel, conforme as orientações da CEMIG.">
              <Btn variant="dark" onClick={gerarPDF}>📄 Exportar PDF</Btn>
            </Card>
          </div>
        )}

        {/* ===== NAVEGAÇÃO ===== */}
        <div className="nav-bottom">
          <Btn variant="ghost" onClick={irAnt} disabled={idx === 0}>← Voltar</Btn>
          <span className="nav-step-info">Etapa {idx + 1} de {abas.length}</span>
          {aba === "revisar"
            ? <Btn variant="primary" onClick={gerarPDF}>📄 Exportar PDF</Btn>
            : <Btn variant="primary" onClick={irProx}>Avançar →</Btn>}
        </div>
      </div>

      <div className="footer">
        Documento gerado eletronicamente · não substitui o formulário oficial CEMIG ·
        <a href="https://www.cemig.com.br/como-solicitar-os-principais-servicos/ligacao-nova-e-aumento-de-carga/ligacao-nova-ou-alteracao-de-carga-para-demandas-especificas/" target="_blank" rel="noreferrer"> Saiba mais no portal Cemig</a>
      </div>
    </div>
  );
}

// ============================================================
// CLASSIFICADOR (tela inicial)
// ============================================================
function Classificador({ onConfirm }) {
  const [c, setC] = useState({
    nCaixas: 1, protecaoGeral: false, edificacaoAcima75: false,
    biAcima60: false, triAcima60: false, multiTri: false, projeto: false,
  });
  const set = (k, v) => setC((p) => ({ ...p, [k]: v }));
  const res = classificar(c);
  const Q = ({ k, label }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderTop: "1px solid var(--borda)", gap: 12 }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <Toggle value={c[k]} onChange={(v) => set(k, v)} options={[{ v: true, l: "Sim" }, { v: false, l: "Não" }]} />
    </div>
  );
  return (
    <div>
      <div className="topbar">
        <div className="topbar-inner">
          <a className="logo-cemig" href="#"><LogoCemig /></a>
          <div className="topbar-links">
            <a href="https://atende.cemig.com.br/Login" target="_blank" rel="noreferrer">CEMIG ATENDE</a>
            <a href="https://partapr.cemig.com.br/PARTAPR/SelecaoModulo.aspx" target="_blank" rel="noreferrer">APRWEB</a>
          </div>
        </div>
      </div>
      <div className="form-header">
        <h1>Classificador de Atendimento — Conexão BT</h1>
        <p>Responda às perguntas para identificar o formulário correto, conforme as orientações do portal Cemig e a REN ANEEL nº 1.000/2021.</p>
      </div>
      <div className="content fade-in">
        <Card title="Classificação do Atendimento" sub="O sistema indicará automaticamente o formulário adequado ao seu caso.">
          <Field label="Quantidade de caixas de medição">
            <div className="qtd-ctrl">
              <button onClick={() => set("nCaixas", Math.max(1, c.nCaixas - 1))}>−</button>
              <input type="number" value={c.nCaixas} onChange={(e) => set("nCaixas", Math.max(1, parseInt(e.target.value) || 1))} style={{ width: 64 }} />
              <button className="plus" onClick={() => set("nCaixas", c.nCaixas + 1)}>+</button>
            </div>
          </Field>
          <div style={{ marginTop: 8 }}>
            <Q k="projeto" label="É uma Aprovação de Projeto Elétrico de Baixa Tensão?" />
            <Q k="edificacaoAcima75" label="Edificação individual acima de 75 kW com atendimento em BT?" />
            <Q k="protecaoGeral" label="O cliente optará por instalar proteção geral (disjuntor geral)?" />
            <Q k="biAcima60" label="Há UC bifásica com proteção acima de 60 A (NEMA) / 63 A (IEC)?" />
            <Q k="triAcima60" label="Há UC trifásica com proteção acima de 60 A (NEMA) / 63 A (IEC)?" />
            <Q k="multiTri" label="Há mais de uma UC trifásica?" />
          </div>
        </Card>
        <Card>
          <div className="kpi dark" style={{ textAlign: "left", padding: 16 }}>
            <div className="kpi-label">Formulário indicado</div>
            <div className="kpi-value" style={{ fontSize: 15 }}>{res.fluxo === "mais3" ? "Padrão em Agrupamento com Proteção Geral (APR Web)" : "Orçamento até 3 caixas (sem proteção geral)"}</div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--texto-suave)", marginBottom: 6 }}>Critérios da classificação:</div>
            <ul style={{ fontSize: 13, listStyle: "none" }}>
              {res.motivos.map((m, i) => <li key={i} style={{ padding: "3px 0" }}>• {m}</li>)}
            </ul>
          </div>
        </Card>
        <div className="nav-bottom" style={{ justifyContent: "flex-end" }}>
          <Btn variant="primary" onClick={() => onConfirm(res.fluxo, c, res)}>Continuar com este formulário →</Btn>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
