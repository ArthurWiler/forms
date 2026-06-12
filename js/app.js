/* ============================================================
   CEMIG — Aplicação principal (React + Babel)
   Formulário unificado de Orçamento de Conexão BT
   (Individual e Coletivo no mesmo fluxo, campos dinâmicos)
   ============================================================ */

// Orientações oficiais (conteúdo do portal Cemig)
const ORIENTACOES = {
  intro:
    "Leia as orientações antes de iniciar. Este formulário destina-se a pedidos de Ligação Nova ou Alteração de Carga em Baixa Tensão (BT), conforme a REN ANEEL nº 1.000/2021. Os campos se adaptam ao seu caso conforme o preenchimento.",
  individual: {
    titulo:
      "Atendimento individual ou agrupamento com até 3 caixas sem proteção geral",
    itens: [
      "Ligação Nova ou Aumento de Carga de unidade consumidora individual urbana e trifásica, com carga instalada até 75 kW.",
      "Aumento de carga para unidade consumidora individual rural, com carga instalada até 75 kW.",
      "Agrupamento com até 3 caixas de medição com somente uma unidade trifásica, desde que as proteções dos disjuntores bipolares e do tripolar sejam de no máximo 63 A.",
      "Neste caso é feito o detalhamento das cargas da unidade consumidora (cálculo de demanda ND-5.1).",
      "É importante informar as coordenadas da propriedade — obrigatórias para área rural a mais de 30 m da rede.",
    ],
  },
  coletivo: {
    titulo:
      "Agrupamento com proteção geral, atendimento híbrido ou individual acima de 75 kW em BT",
    itens: [
      "Aplica-se quando há disjuntor geral: agrupamento com mais de 3 caixas, padrão trifásico acima de 75 kW, ou UCs com proteção acima de 60/63 A.",
      "É necessário solicitar antecipadamente a Análise de Carga/Rede e emitir ART, TRT ou RRT por Responsável Técnico habilitado.",
      "Neste caso preenche-se apenas uma previsão de carga geral e os dados de identificação de cada unidade consumidora.",
      "Para demanda total superior a 304 kVA, o atendimento fica condicionado à apresentação do projeto elétrico com ART/TRT.",
      "Motores monofásicos acima de 15 CV e/ou trifásicos acima de 50 CV exigem o formulário de análise de partida de motores.",
    ],
  },
  callout:
    "Pedido de vistoria e ligação: se o padrão estiver pronto para ligar, a vistoria é disparada após o orçamento; caso contrário, há prazo para solicitá-la. O orçamento pode ser cancelado após reprovações pelo mesmo motivo.",
};

// Bloco de UC no modo coletivo (com valores padrão, conforme exemplo)
const ucBlocoPadrao = (i) => ({
  identificacao: `UC ${i + 1}`,
  nPredial: "",
  complemento: "",
  caixa: "",
  solicitacao: "Conexão Nova", // padrão
  mudancaLocal: "Não", // padrão
  atividade: "Residencial", // padrão
  ramo: "",
  instalacao: "",
  disjDe: "",
  disjPara: "Bipolar 63 A",
});

// UC detalhada no modo individual (usa a calculadora ND-5.1)
const ucDetalhadaPadrao = () => ({
  solicitacao: "Conexão Nova",
  atividade: "Residencial",
  ramo: "",
  nPredial: "",
  complemento: "",
  caixa: "",
  instalacao: "",
  disjDe: "",
  disjPara: "",
  disjEscolhido: "",
  cargas: { qtds: CAT.map(() => 0), tipoA: "res", catA: 0, mots: [] },
});

// ============================================================
// APP
// ============================================================
function App() {
  const [aba, setAba] = useState("orient");

  // ---- Tipo de atendimento (define-se pela presença de disjuntor geral) ----
  // disjGeral: "Não" => Individual (detalhamento) | "Sim" => Coletivo (previsão + blocos)
  const [atend, setAtend] = useState({
    disjGeral: "Não", // possui disjuntor geral?
    nUCs: 1, // nº de unidades consumidoras
    biAcima63: false, // UC bifásica com proteção > 60/63 A
    triAcima63: false, // UC trifásica com proteção > 60/63 A
    acima75: false, // individual acima de 75 kW
    solicitacao: "Conexão Nova", // padrão
    escopo: "Ligação Nova", // padrão
    disjuntorGeral: "", // faixa do disjuntor geral (coletivo)
  });
  const coletivo = atend.disjGeral === "Sim";

  // ---- Dados compartilhados ----
  const [prop, setProp] = useState({
    nome: "",
    filiacao: "",
    email: "",
    rg: "",
    nasc: "",
    celular: "",
    fixo: "",
    cpfCnpj: "",
    laudoMedico: "Não",
    telProp: "",
    nis: "Não",
    numNis: "",
  });
  const [corr, setCorr] = useState({
    vencimento: "",
    receberEmail: "Sim",
    rua: "",
    bairro: "",
    num: "",
    compl: "",
    municipio: "",
    cep: "",
    estado: "MG",
    contaGlobal: "",
  });
  const [obra, setObra] = useState({
    art: "",
    prontoLigar: "Não",
    app: "Não",
    reservaLegal: "Não",
    endereco: "",
    num: "",
    compl: "",
    bairro: "",
    cidade: "",
    estado: "MG",
    cep: "",
    localizacao: "Urbana",
    instalacaoUC: "",
    coordenada: "",
    distMenor30: "Sim",
    tipoRede: "Trifásica",
    transformador: "",
    pontoRef: "",
    nomePropriedade: "",
    distritoComunidade: "",
    instProxima: "",
  });
  const [gerador, setGerador] = useState({
    possui: "Não",
    potencia: "",
    fonte: "",
    descricao: "",
  });
  const [obs, setObs] = useState("");
  const [cepStatus, setCepStatus] = useState({ obra: "", corr: "" });

  // ---- Previsão de carga (modo coletivo) ----
  const [prev, setPrev] = useState({
    ilum: "",
    tomada: "",
    chuveiro: "",
    ar: "",
    outrosDesc: "",
    outros: "",
    demanda: "",
  });
  const prevTotalKw = useMemo(() => {
    return ["ilum", "tomada", "chuveiro", "ar", "outros"].reduce(
      (s, k) => s + (parseFloat(String(prev[k]).replace(",", ".")) || 0),
      0,
    );
  }, [prev]);

  // ---- UC detalhada (modo individual) ----
  const [ucDet, setUcDet] = useState(ucDetalhadaPadrao());

  // ---- Blocos de UC (modo coletivo) ----
  const [ucBlocos, setUcBlocos] = useState([ucBlocoPadrao(0)]);
  const setBloco = (i, patch) =>
    setUcBlocos((p) => p.map((u, idx) => (idx === i ? { ...u, ...patch } : u)));

  // Sincroniza nº de blocos com nUCs (modo coletivo)
  useEffect(() => {
    if (!coletivo) return;
    const n = Math.max(1, Number(atend.nUCs) || 1);
    setUcBlocos((prevBlocos) => {
      if (prevBlocos.length === n) return prevBlocos;
      const arr = [...prevBlocos];
      while (arr.length < n) arr.push(ucBlocoPadrao(arr.length));
      while (arr.length > n) arr.pop();
      return arr;
    });
  }, [atend.nUCs, coletivo]);

  const redeMono =
    obra.tipoRede === "Monofásica" || obra.tipoRede === "Bifásica";

  // ===== API DE CEP (ViaCEP) =====
  const buscarCEP = async (cep, alvo) => {
    const limpo = (cep || "").replace(/\D/g, "");
    if (limpo.length !== 8) {
      setCepStatus((p) => ({ ...p, [alvo]: "" }));
      return;
    }
    setCepStatus((p) => ({ ...p, [alvo]: "buscando" }));
    try {
      const r = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const dd = await r.json();
      if (dd.erro) {
        setCepStatus((p) => ({ ...p, [alvo]: "erro" }));
        return;
      }
      if (alvo === "obra") {
        setObra((o) => ({
          ...o,
          endereco: dd.logradouro || o.endereco,
          bairro: dd.bairro || o.bairro,
          cidade: dd.localidade || o.cidade,
          estado: dd.uf || o.estado,
        }));
      } else {
        setCorr((c) => ({
          ...c,
          rua: dd.logradouro || c.rua,
          bairro: dd.bairro || c.bairro,
          municipio: dd.localidade || c.municipio,
          estado: dd.uf || c.estado,
        }));
      }
      setCepStatus((p) => ({ ...p, [alvo]: "ok" }));
    } catch (e) {
      setCepStatus((p) => ({ ...p, [alvo]: "erro" }));
    }
  };

  // ===== Disjuntor geral obrigatório? =====
  // Obrigatório quando há UC bi/tri com proteção acima de 60/63 A (ou quando há disjuntor geral declarado).
  const disjGeralObrigatorio = atend.biAcima63 || atend.triAcima63;

  // Maior corrente entre os disjuntores das UCs (para limitar opções do geral)
  const maiorCorrenteUC = useMemo(() => {
    if (coletivo) {
      return ucBlocos.reduce(
        (mx, u) =>
          Math.max(mx, correnteDisj(u.disjPara), correnteDisj(u.disjDe)),
        0,
      );
    }
    const esc =
      ucDet.disjEscolhido || (ucDet.cargas?._disjuntores || [])[0] || "";
    return correnteDisj(esc);
  }, [coletivo, ucBlocos, ucDet]);

  // Opções de disjuntor geral: somente faixas MAIORES que a maior UC (exclui a igual)
  const opcoesDisjGeral = useMemo(
    () => disjuntoresGeraisAcima(maiorCorrenteUC),
    [maiorCorrenteUC],
  );

  // ===== Demanda total =====
  const demandaTotalGeral = useMemo(() => {
    if (coletivo)
      return parseFloat(String(prev.demanda).replace(",", ".")) || 0;
    return ucDet.cargas?._demanda || 0;
  }, [coletivo, prev.demanda, ucDet]);

  const coordObrigatoria =
    obra.localizacao === "Rural" && obra.distMenor30 === "Não";
  const coordPreenchida = !!obra.coordenada;

  // ===== ABAS (barra vertical) =====
  // Fluxo único; o conteúdo das etapas muda conforme Individual/Coletivo.
  const abas = [
    { k: "orient", l: "Orientações" },
    { k: "tipo", l: "Tipo de Atendimento" },
    { k: "prop", l: "Proprietário" },
    { k: "corr", l: "Correspondência" },
    { k: "obra", l: "Dados da Obra" },
    { k: "cargas", l: coletivo ? "Previsão de Carga" : "Cargas da UC" },
    { k: "ucs", l: "Unidades Consumidoras" },
    { k: "obs", l: "Observações" },
    { k: "revisar", l: "Prévia & PDF" },
  ];
  // Gerador de emergência só no individual
  if (!coletivo)
    abas.splice(7, 0, { k: "gerador", l: "Gerador de Emergência" });

  const idx = abas.findIndex((a) => a.k === aba);
  const irProx = () => setAba(abas[Math.min(idx + 1, abas.length - 1)].k);
  const irAnt = () => setAba(abas[Math.max(idx - 1, 0)].k);

  // ============================================================
  // GERAR PDF
  // ============================================================
  const gerarPDF = useCallback(() => {
    if (!window.jspdf) {
      alert("Biblioteca jsPDF não carregada.");
      return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const PW = 210,
      PH = 297,
      MG = 14,
      CW = PW - 2 * MG;
    let cy = MG;
    const drawTopBar = () => {
      doc.setFillColor(0, 89, 42);
      doc.rect(0, 0, PW, 18, "F");
      doc.setFillColor(1, 136, 55);
      doc.rect(0, 0, 4, 18, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text("Formulário CEMIG - Orçamento de Conexão BT", MG, 8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(150, 210, 175);
      doc.text(
        coletivo
          ? "Agrupamento com Proteção Geral / Projeto BT (APR Web)"
          : "Atendimento individual ou agrupamento até 3 caixas sem proteção geral",
        MG,
        13.5,
      );
      cy = 24;
    };
    const footer = () => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(150, 150, 150);
      doc.text(
        "Documento gerado eletronicamente - não substitui o formulário oficial CEMIG",
        MG,
        PH - 7,
      );
    };
    const checkSpace = (h) => {
      if (cy + h > PH - 14) {
        footer();
        doc.addPage();
        cy = MG;
        drawTopBar();
      }
    };
    const sec = (t) => {
      checkSpace(11);
      doc.setFillColor(232, 243, 236);
      doc.rect(MG, cy, CW, 7, "F");
      doc.setFillColor(1, 136, 55);
      doc.rect(MG, cy, 2.5, 7, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(0, 70, 33);
      doc.text(t, MG + 5, cy + 4.8);
      cy += 9;
    };
    const kvPairs = (pairs) => {
      const colW = CW / 2;
      for (let i = 0; i < pairs.length; i += 2) {
        checkSpace(8);
        [pairs[i], pairs[i + 1]].forEach((p, ci) => {
          if (!p) return;
          const x = MG + ci * colW;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(7);
          doc.setTextColor(110, 116, 130);
          doc.text(p[0] + ":", x + 1, cy + 3);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.setTextColor(30, 32, 42);
          doc.text(
            doc.splitTextToSize(String(p[1] || "—"), colW - 4)[0],
            x + 1,
            cy + 6.8,
          );
        });
        cy += 8.5;
      }
    };
    const fullLine = (label, val) => {
      const lines = doc.splitTextToSize(String(val || "—"), CW - 4);
      checkSpace(5 + lines.length * 4);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(110, 116, 130);
      doc.text(label + ":", MG + 1, cy + 3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(30, 32, 42);
      doc.text(lines, MG + 1, cy + 7);
      cy += 5 + lines.length * 4;
    };
    const totRow = (label, val) => {
      checkSpace(8);
      doc.setFillColor(1, 136, 55);
      doc.rect(MG, cy, CW, 7.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(230, 249, 213);
      doc.text(label, MG + 5, cy + 5.2);
      doc.text(val, MG + CW - 2, cy + 5.2, { align: "right" });
      cy += 9;
    };

    drawTopBar();

    sec("TIPO DE ATENDIMENTO");
    fullLine(
      "Modalidade",
      coletivo
        ? "Coletivo - Agrupamento com Proteção Geral (APR Web)"
        : "Individual / até 3 caixas sem proteção geral",
    );
    kvPairs([
      ["Possui disjuntor geral?", atend.disjGeral],
      ["Nº de unidades consumidoras", atend.nUCs],
      ["Solicitação", atend.solicitacao],
      ["Escopo do atendimento", atend.escopo],
    ]);
    if (coletivo && atend.disjuntorGeral)
      fullLine("Disjuntor geral", atend.disjuntorGeral);
    cy += 2;

    sec("1.  DADOS DO PROPRIETÁRIO");
    kvPairs([
      ["Nome Completo", prop.nome],
      ["CPF/CNPJ", prop.cpfCnpj],
      ["E-mail", prop.email],
      ["Celular", prop.celular],
      ["Telefone Fixo", prop.fixo],
      ["Telefone do Proprietário", prop.telProp],
      ["RG/RNE/RANI", prop.rg],
      ["Data Nasc.", prop.nasc],
      ["Filiação", prop.filiacao],
      ["Laudo médico", prop.laudoMedico],
      ["NIS Tarifa Social", prop.nis === "Sim" ? prop.numNis : "Não"],
      ["", ""],
    ]);
    cy += 2;

    sec("2.  CORRESPONDÊNCIA E FATURA");
    kvPairs([
      ["Receber fatura por e-mail", corr.receberEmail],
      ["Vencimento desejado", corr.vencimento],
      ["Conta globalizada", corr.contaGlobal],
      ["", ""],
    ]);
    if (corr.receberEmail === "Não")
      kvPairs([
        ["Rua/Av", corr.rua],
        ["Nº", corr.num],
        ["Bairro/Distrito", corr.bairro],
        ["Complemento", corr.compl],
        ["Município", corr.municipio],
        ["CEP", corr.cep],
        ["Estado", corr.estado],
        ["", ""],
      ]);
    cy += 2;

    sec("3.  DADOS DA OBRA (PADRÃO DE ENTRADA)");
    const obraPairs = [
      ["Endereço", obra.endereco],
      ["Nº", obra.num],
      ["Complemento", obra.compl],
      ["Bairro", obra.bairro],
      ["Cidade", obra.cidade],
      ["Estado", obra.estado],
      ["CEP", obra.cep],
      ["Localização", obra.localizacao],
      ["Instalação / UC", obra.instalacaoUC],
    ];
    if (coletivo) obraPairs.push(["Nº ART/TRT de Projeto", obra.art]);
    obraPairs.push(
      ["Coordenadas", obra.coordenada],
      ["Padrão pronto p/ ligar?", obra.prontoLigar],
      ["Em APP?", obra.app],
      ["Reserva Legal?", obra.reservaLegal],
      ["Tipo de rede BT", obra.tipoRede],
      ["Distância < 30 m da rede?", obra.distMenor30],
      ["Transformador próximo", obra.transformador],
    );
    kvPairs(obraPairs);
    if (obra.localizacao === "Rural")
      kvPairs([
        ["Distrito/Comunidade", obra.distritoComunidade],
        ["Nome da propriedade", obra.nomePropriedade],
        ["Ponto de referência", obra.pontoRef],
        ["Inst. mais próxima", obra.instProxima],
      ]);
    cy += 2;

    if (coletivo) {
      // Previsão de carga + blocos de UC
      sec("4.  PREVISÃO DE CARGA");
      kvPairs([
        ["Iluminação (kW)", prev.ilum],
        ["Tomada (kW)", prev.tomada],
        ["Chuveiro (kW)", prev.chuveiro],
        ["Ar Cond. (kW)", prev.ar],
        ["Outros (kW)", prev.outros],
        ["Descrição outros", prev.outrosDesc],
      ]);
      totRow(
        `Total ${fmt2(prevTotalKw)} kW  |  Demanda`,
        `${fmt2(demandaTotalGeral)} kVA`,
      );
      cy += 2;
      sec("5.  UNIDADES CONSUMIDORAS");
      ucBlocos.forEach((u, ui) => {
        checkSpace(6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(0, 70, 33);
        doc.text(`${u.identificacao || "UC " + (ui + 1)}`, MG + 1, cy + 4);
        cy += 6;
        kvPairs([
          ["Nº Predial", u.nPredial],
          ["Complemento", u.complemento],
          ["Caixa", u.caixa],
          ["Solicitação", u.solicitacao],
          ["Mudança de local", u.mudancaLocal],
          ["Atividade principal", u.atividade],
          ["Ramo de atividade", u.ramo],
          ["Instalação", u.instalacao],
          ["Disjuntor De", u.disjDe],
          ["Disjuntor Para", u.disjPara],
        ]);
        cy += 1;
      });
      if (atend.disjuntorGeral) {
        sec("6.  DISJUNTOR GERAL");
        fullLine("Disjuntor geral do agrupamento", atend.disjuntorGeral);
        cy += 2;
      }
    } else {
      // Individual: detalhamento da UC
      sec("4.  UNIDADE CONSUMIDORA (DETALHAMENTO)");
      kvPairs([
        ["Solicitação", ucDet.solicitacao],
        ["Atividade principal", ucDet.atividade],
        ["Nº Predial", ucDet.nPredial],
        ["Complemento", ucDet.complemento],
        ["Caixa / Identificação", ucDet.caixa],
        ["Ramo de atividade", ucDet.ramo],
        ["Nº Instalação", ucDet.instalacao],
        ["Disjuntor De", ucDet.disjDe],
        ["Disjuntor Para", ucDet.disjPara],
        ["", ""],
      ]);
      const qtds = ucDet.cargas?.qtds || [];
      const itens = CAT.map((c, i) => ({ ...c, q: qtds[i] || 0 })).filter(
        (x) => x.q > 0,
      );
      if (itens.length) {
        checkSpace(6);
        doc.setFillColor(215, 218, 226);
        doc.rect(MG, cy, CW, 5.5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(90, 96, 115);
        doc.text("Equipamento", MG + 2, cy + 3.8);
        doc.text("Pot. (W)", MG + 95, cy + 3.8);
        doc.text("Qtd", MG + 125, cy + 3.8, { align: "center" });
        doc.text("Total (W)", MG + CW - 2, cy + 3.8, { align: "right" });
        cy += 5.5;
        let ri = 0;
        itens.forEach((it) => {
          checkSpace(5);
          doc.setFillColor(
            ri % 2 ? 247 : 255,
            ri % 2 ? 248 : 255,
            ri % 2 ? 251 : 255,
          );
          doc.rect(MG, cy, CW, 5, "F");
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(30, 32, 42);
          doc.text(it.n, MG + 2, cy + 3.5);
          doc.text(fmtW(it.w), MG + 95, cy + 3.5);
          doc.text(String(it.q), MG + 125, cy + 3.5, { align: "center" });
          doc.text(fmtW(it.q * it.w), MG + CW - 2, cy + 3.5, {
            align: "right",
          });
          ri++;
          cy += 5;
        });
      }
      (ucDet.cargas?.mots || [])
        .filter((m) => (m.q || 0) > 0)
        .forEach((m) => {
          checkSpace(5);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          doc.setTextColor(60, 60, 70);
          doc.text(
            `Motor ${m.fase === "mono" ? "Monofásico" : "Trifásico"} ${m.cv} CV (Cat. ${(m.col || "").replace("c", "")}) - Qtd: ${m.q}`,
            MG + 2,
            cy + 3.5,
          );
          cy += 5;
        });
      checkSpace(8);
      totRow(
        `Carga ${fmt2(ucDet.cargas?._cargaKw || 0)} kW  |  Demanda`,
        `${fmt2(ucDet.cargas?._demanda || 0)} kVA`,
      );
      if (ucDet.cargas?._disjuntores?.length)
        fullLine(
          "Disjuntor sugerido (ND-5.1)",
          ucDet.cargas._disjuntores.join("  ·  "),
        );
      if (ucDet.disjEscolhido)
        fullLine("Disjuntor escolhido", ucDet.disjEscolhido);
      cy += 2;

      sec("5.  GERADOR DE EMERGÊNCIA");
      const gp = [["Há gerador de emergência?", gerador.possui]];
      if (gerador.possui === "Sim")
        gp.push(
          ["Potência (kVA)", gerador.potencia],
          ["Fonte/Combustível", gerador.fonte],
        );
      kvPairs(gp);
      if (gerador.possui === "Sim" && gerador.descricao)
        fullLine("Descrição", gerador.descricao);
      cy += 2;
    }

    sec("OBSERVAÇÕES");
    fullLine("Obs.", obs || "—");
    cy += 4;
    totRow("DEMANDA TOTAL DO ATENDIMENTO", `${fmt2(demandaTotalGeral)} kVA`);
    cy += 4;
    checkSpace(20);
    doc.setDrawColor(180, 180, 180);
    doc.line(MG + 30, cy + 8, MG + CW - 30, cy + 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(90, 90, 90);
    doc.text(
      "Local e data / Assinatura do proprietário ou representante legal",
      PW / 2,
      cy + 12,
      { align: "center" },
    );
    footer();
    const nomeArq = (prop.nome || "formulario")
      .replace(/[^a-zA-Z0-9]/g, "_")
      .slice(0, 30);
    doc.save(`CEMIG_${coletivo ? "coletivo" : "individual"}_${nomeArq}.pdf`);
  }, [
    coletivo,
    atend,
    prop,
    corr,
    obra,
    prev,
    prevTotalKw,
    ucDet,
    ucBlocos,
    gerador,
    obs,
    demandaTotalGeral,
  ]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="topbar-inner">
          <a className="logo-cemig" href="#">
            <LogoCemig />
          </a>
          <div className="topbar-links">
            <a
              href="https://atende.cemig.com.br/Login"
              target="_blank"
              rel="noreferrer"
            >
              CEMIG ATENDE
            </a>
            <a
              href="https://partapr.cemig.com.br/PARTAPR/SelecaoModulo.aspx"
              target="_blank"
              rel="noreferrer"
            >
              APRWEB
            </a>
          </div>
        </div>
      </div>

      {/* CABEÇALHO */}
      <div className="form-header">
        <h1>
          Formulário de Orçamento de Conexão / Alteração de Carga em Baixa
          Tensão
        </h1>
        <p>
          Preenchimento digital unificado para solicitações em BT, conforme as
          normas CEMIG ND-5.1 / ND-5.2 e a REN ANEEL nº 1.000/2021. Os campos se
          adaptam conforme o preenchimento.
        </p>
        <span className="flow-badge">
          {coletivo
            ? "Coletivo — Agrupamento com Proteção Geral"
            : "Individual / até 3 caixas sem proteção geral"}{" "}
          · Demanda {fmt2(demandaTotalGeral)} kVA
        </span>
      </div>

      {/* LAYOUT DUAS COLUNAS */}
      <div className="layout">
        {/* SIDEBAR VERTICAL */}
        <aside className="sidebar">
          <div className="sidebar-title">Progresso do preenchimento</div>
          {abas.map((a, i) => (
            <button
              key={a.k}
              className={
                "vstep" + (a.k === aba ? " active" : i < idx ? " done" : "")
              }
              onClick={() => setAba(a.k)}
            >
              <span className="vstep-num">{i === 0 ? "i" : i}</span>
              <span className="vstep-label">{a.l}</span>
            </button>
          ))}
        </aside>

        {/* COLUNA PRINCIPAL */}
        <main className="main-col fade-in" key={aba}>
          {/* ===== ORIENTAÇÕES ===== */}
          {aba === "orient" && (
            <Card
              eyebrow="Comece por aqui"
              title="Orientações para preenchimento"
              sub={ORIENTACOES.intro}
            >
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--verde-escuro)",
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                {ORIENTACOES.individual.titulo}
              </div>
              <ul className="orient-list">
                {ORIENTACOES.individual.itens.map((it, i) => (
                  <li key={i} className="orient-item">
                    <span className="orient-num">{i + 1}</span>
                    <p>{it}</p>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  fontWeight: 700,
                  color: "var(--verde-escuro)",
                  fontSize: 14,
                  margin: "18px 0 4px",
                }}
              >
                {ORIENTACOES.coletivo.titulo}
              </div>
              <ul className="orient-list">
                {ORIENTACOES.coletivo.itens.map((it, i) => (
                  <li key={i} className="orient-item">
                    <span className="orient-num">{i + 1}</span>
                    <p>{it}</p>
                  </li>
                ))}
              </ul>
              <div className="callout">{ORIENTACOES.callout}</div>
              <div className="legend">
                <span>
                  <span className="req">*</span> Campo de preenchimento
                  obrigatório
                </span>
                <span>
                  <span className="req">**</span> Obrigatório para pessoa física
                </span>
              </div>
              <div style={{ marginTop: 16 }}>
                <Btn variant="primary" onClick={irProx}>
                  Iniciar preenchimento →
                </Btn>
              </div>
            </Card>
          )}

          {/* ===== TIPO DE ATENDIMENTO (define individual x coletivo) ===== */}
          {aba === "tipo" && (
            <Card
              eyebrow="Etapa 1"
              title="Tipo de Atendimento"
              sub="O tipo de formulário é definido pela presença ou não de disjuntor geral. Os campos seguintes se adaptam à sua escolha."
            >
              <div className="grid grid-2">
                <Field
                  label="Possui disjuntor geral (proteção geral)?"
                  req
                  hint="Sim = atendimento coletivo (agrupamento). Não = atendimento individual (detalhamento de cargas)."
                >
                  <Toggle
                    value={atend.disjGeral}
                    onChange={(v) => setAtend({ ...atend, disjGeral: v })}
                    options={[
                      { v: "Não", l: "Não" },
                      { v: "Sim", l: "Sim" },
                    ]}
                  />
                </Field>
                <Field label="Solicitação" req>
                  <Sel
                    value={atend.solicitacao}
                    onChange={(e) =>
                      setAtend({ ...atend, solicitacao: e.target.value })
                    }
                  >
                    <option>Conexão Nova</option>
                    <option>Alteração de Carga</option>
                    <option>Caixa Existente sem Alteração</option>
                    <option>Atendimento Híbrido</option>
                  </Sel>
                </Field>
                <Field label="Escopo do atendimento" req>
                  <Sel
                    value={atend.escopo}
                    onChange={(e) =>
                      setAtend({ ...atend, escopo: e.target.value })
                    }
                  >
                    <option>Ligação Nova</option>
                    <option>Aumento de Carga</option>
                    <option>Redução de Carga</option>
                    <option>Adequação de Padrão</option>
                  </Sel>
                </Field>
                <Field
                  label="Nº de Unidades Consumidoras"
                  req
                  hint={
                    coletivo
                      ? "Será gerado um bloco de preenchimento para cada UC."
                      : "No individual há uma única unidade detalhada."
                  }
                >
                  <Inp
                    type="number"
                    value={atend.nUCs}
                    onChange={(e) =>
                      setAtend({
                        ...atend,
                        nUCs: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-2 divider">
                <Field label="Há UC bifásica com proteção acima de 60 A (NEMA) / 63 A (IEC)?">
                  <Toggle
                    value={atend.biAcima63}
                    onChange={(v) => setAtend({ ...atend, biAcima63: v })}
                    options={[
                      { v: true, l: "Sim" },
                      { v: false, l: "Não" },
                    ]}
                  />
                </Field>
                <Field label="Há UC trifásica com proteção acima de 60 A (NEMA) / 63 A (IEC)?">
                  <Toggle
                    value={atend.triAcima63}
                    onChange={(v) => setAtend({ ...atend, triAcima63: v })}
                    options={[
                      { v: true, l: "Sim" },
                      { v: false, l: "Não" },
                    ]}
                  />
                </Field>
                <Field label="Atendimento individual acima de 75 kW em BT?">
                  <Toggle
                    value={atend.acima75}
                    onChange={(v) => setAtend({ ...atend, acima75: v })}
                    options={[
                      { v: true, l: "Sim" },
                      { v: false, l: "Não" },
                    ]}
                  />
                </Field>
              </div>

              {disjGeralObrigatorio && (
                <div className="geral-box">
                  <Field
                    label="Disjuntor geral do agrupamento"
                    req
                    hint={`Obrigatório quando há UC bi/trifásica com proteção acima de 60/63 A. As opções iniciam acima da maior faixa das UCs (${maiorCorrenteUC || "—"} A).`}
                  >
                    <Sel
                      value={atend.disjuntorGeral}
                      onChange={(e) =>
                        setAtend({ ...atend, disjuntorGeral: e.target.value })
                      }
                    >
                      <option value="">Selecione…</option>
                      {opcoesDisjGeral.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </Sel>
                  </Field>
                  {opcoesDisjGeral.length === 0 && (
                    <div className="alert alert-info" style={{ marginTop: 10 }}>
                      Defina os disjuntores das unidades consumidoras para
                      liberar as opções de disjuntor geral (faixa superior à
                      maior UC).
                    </div>
                  )}
                </div>
              )}

              <div
                className={"alert " + (coletivo ? "alert-ok" : "alert-info")}
                style={{ marginTop: 16 }}
              >
                {coletivo
                  ? "Atendimento COLETIVO: será preenchida uma previsão de carga geral e os dados de cada unidade consumidora."
                  : "Atendimento INDIVIDUAL: será feito o detalhamento das cargas da unidade consumidora (cálculo de demanda ND-5.1)."}
              </div>
            </Card>
          )}

          {/* ===== PROPRIETÁRIO ===== */}
          {aba === "prop" && (
            <Card
              eyebrow="Dados"
              title="Dados do Proprietário"
              sub="Titular da conta de energia ou proprietário/possuidor do imóvel. (*) obrigatório · (**) obrigatório para pessoa física."
            >
              <div className="grid grid-2">
                <Field label="Nome Completo (sem abreviações)" req span={2}>
                  <Inp
                    value={prop.nome}
                    onChange={(e) => setProp({ ...prop, nome: e.target.value })}
                  />
                </Field>
                <Field label="CPF / CNPJ" req>
                  <Inp
                    value={prop.cpfCnpj}
                    onChange={(e) =>
                      setProp({ ...prop, cpfCnpj: e.target.value })
                    }
                  />
                </Field>
                <Field label="E-mail" req>
                  <Inp
                    type="email"
                    value={prop.email}
                    onChange={(e) =>
                      setProp({ ...prop, email: e.target.value })
                    }
                  />
                </Field>
                <Field label="Filiação (Mãe ou Pai) **">
                  <Inp
                    value={prop.filiacao}
                    onChange={(e) =>
                      setProp({ ...prop, filiacao: e.target.value })
                    }
                  />
                </Field>
                <Field label="RG / RNE / RANI **">
                  <Inp
                    value={prop.rg}
                    onChange={(e) => setProp({ ...prop, rg: e.target.value })}
                  />
                </Field>
                <Field label="Data de Nascimento **">
                  <Inp
                    type="date"
                    value={prop.nasc}
                    onChange={(e) => setProp({ ...prop, nasc: e.target.value })}
                  />
                </Field>
                <Field label="Celular" req>
                  <Inp
                    value={prop.celular}
                    onChange={(e) =>
                      setProp({ ...prop, celular: e.target.value })
                    }
                  />
                </Field>
                <Field label="Telefone Fixo">
                  <Inp
                    value={prop.fixo}
                    onChange={(e) => setProp({ ...prop, fixo: e.target.value })}
                  />
                </Field>
                <Field label="Telefone do Proprietário" req>
                  <Inp
                    value={prop.telProp}
                    onChange={(e) =>
                      setProp({ ...prop, telProp: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Possui laudo médico (equipamentos essenciais)? **"
                  span={2}
                >
                  <Toggle
                    value={prop.laudoMedico}
                    onChange={(v) => setProp({ ...prop, laudoMedico: v })}
                    options={[
                      { v: "Sim", l: "Sim" },
                      { v: "Não", l: "Não" },
                    ]}
                  />
                </Field>
                <Field label="Possui NIS para Tarifa Social? **">
                  <Toggle
                    value={prop.nis}
                    onChange={(v) => setProp({ ...prop, nis: v })}
                    options={[
                      { v: "Sim", l: "Sim" },
                      { v: "Não", l: "Não" },
                    ]}
                  />
                </Field>
                {prop.nis === "Sim" && (
                  <Field label="Número do NIS" req>
                    <Inp
                      value={prop.numNis}
                      onChange={(e) =>
                        setProp({ ...prop, numNis: e.target.value })
                      }
                    />
                  </Field>
                )}
              </div>
            </Card>
          )}

          {/* ===== CORRESPONDÊNCIA ===== */}
          {aba === "corr" && (
            <Card
              eyebrow="Dados"
              title="Correspondência e Fatura"
              sub="Como o cliente deseja receber a conta de energia."
            >
              <div className="grid grid-2">
                <Field label="Deseja receber a fatura no e-mail informado?" req>
                  <Toggle
                    value={corr.receberEmail}
                    onChange={(v) => setCorr({ ...corr, receberEmail: v })}
                    options={[
                      { v: "Sim", l: "Sim" },
                      { v: "Não", l: "Não" },
                    ]}
                  />
                </Field>
                <Field label="Data de vencimento desejada">
                  <Inp
                    value={corr.vencimento}
                    onChange={(e) =>
                      setCorr({ ...corr, vencimento: e.target.value })
                    }
                    placeholder="Ex: dia 10"
                  />
                </Field>
              </div>
              {corr.receberEmail === "Não" && (
                <div className="grid grid-2 divider">
                  <Field
                    label="CEP (preenchimento automático)"
                    span={2}
                    hint="Digite o CEP para preencher o endereço automaticamente."
                  >
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <div style={{ maxWidth: 180 }}>
                        <Inp
                          value={corr.cep}
                          onChange={(e) => {
                            const v = e.target.value;
                            setCorr({ ...corr, cep: v });
                            buscarCEP(v, "corr");
                          }}
                          placeholder="00000-000"
                        />
                      </div>
                      {cepStatus.corr === "buscando" && (
                        <span className="spinner"></span>
                      )}
                      {cepStatus.corr === "ok" && (
                        <Badge>endereço preenchido</Badge>
                      )}
                      {cepStatus.corr === "erro" && (
                        <span
                          style={{ color: "var(--vermelho)", fontSize: 12 }}
                        >
                          CEP não encontrado
                        </span>
                      )}
                    </div>
                  </Field>
                  <Field label="Rua / Av." span={2}>
                    <Inp
                      value={corr.rua}
                      onChange={(e) =>
                        setCorr({ ...corr, rua: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Nº">
                    <Inp
                      value={corr.num}
                      onChange={(e) =>
                        setCorr({ ...corr, num: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Complemento">
                    <Inp
                      value={corr.compl}
                      onChange={(e) =>
                        setCorr({ ...corr, compl: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Bairro / Distrito">
                    <Inp
                      value={corr.bairro}
                      onChange={(e) =>
                        setCorr({ ...corr, bairro: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Município">
                    <Inp
                      value={corr.municipio}
                      onChange={(e) =>
                        setCorr({ ...corr, municipio: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Estado">
                    <Inp
                      value={corr.estado}
                      onChange={(e) =>
                        setCorr({ ...corr, estado: e.target.value })
                      }
                    />
                  </Field>
                </div>
              )}
              <div style={{ marginTop: 14 }}>
                <Field label="Conta globalizada (poder público — código de débito automático globalizado)">
                  <Inp
                    value={corr.contaGlobal}
                    onChange={(e) =>
                      setCorr({ ...corr, contaGlobal: e.target.value })
                    }
                    placeholder="Opcional"
                  />
                </Field>
              </div>
            </Card>
          )}

          {/* ===== OBRA ===== */}
          {aba === "obra" && (
            <Card
              eyebrow="Dados"
              title="Dados da Obra"
              sub="Endereço do padrão de entrada / ponto de entrega."
            >
              <div className="grid grid-2">
                <Field label="Zona de localização" req>
                  <Toggle
                    value={obra.localizacao}
                    onChange={(v) => setObra({ ...obra, localizacao: v })}
                    options={[
                      { v: "Urbana", l: "Urbana" },
                      { v: "Rural", l: "Rural" },
                    ]}
                  />
                </Field>
                {coletivo && (
                  <Field
                    label="Nº ART/TRT de Projeto"
                    req
                    hint="Obrigatório para atendimentos via APR Web."
                  >
                    <Inp
                      value={obra.art}
                      onChange={(e) =>
                        setObra({ ...obra, art: e.target.value })
                      }
                    />
                  </Field>
                )}
              </div>
              {obra.localizacao === "Urbana" && (
                <div className="grid grid-2" style={{ marginTop: 14 }}>
                  <Field
                    label="CEP (preenchimento automático)"
                    req
                    span={2}
                    hint="Digite o CEP para preencher endereço, bairro, cidade e estado."
                  >
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <div style={{ maxWidth: 180 }}>
                        <Inp
                          value={obra.cep}
                          onChange={(e) => {
                            const v = e.target.value;
                            setObra({ ...obra, cep: v });
                            buscarCEP(v, "obra");
                          }}
                          placeholder="00000-000"
                        />
                      </div>
                      {cepStatus.obra === "buscando" && (
                        <span className="spinner"></span>
                      )}
                      {cepStatus.obra === "ok" && (
                        <Badge>endereço preenchido</Badge>
                      )}
                      {cepStatus.obra === "erro" && (
                        <span
                          style={{ color: "var(--vermelho)", fontSize: 12 }}
                        >
                          CEP não encontrado
                        </span>
                      )}
                    </div>
                  </Field>
                  <Field label="Endereço" req span={2}>
                    <Inp
                      value={obra.endereco}
                      onChange={(e) =>
                        setObra({ ...obra, endereco: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Nº" req>
                    <Inp
                      value={obra.num}
                      onChange={(e) =>
                        setObra({ ...obra, num: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Complemento">
                    <Inp
                      value={obra.compl}
                      onChange={(e) =>
                        setObra({ ...obra, compl: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Bairro" req>
                    <Inp
                      value={obra.bairro}
                      onChange={(e) =>
                        setObra({ ...obra, bairro: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Cidade / Município" req>
                    <Inp
                      value={obra.cidade}
                      onChange={(e) =>
                        setObra({ ...obra, cidade: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Estado" req>
                    <Inp
                      value={obra.estado}
                      onChange={(e) =>
                        setObra({ ...obra, estado: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Instalação / UC">
                    <Inp
                      value={obra.instalacaoUC}
                      onChange={(e) =>
                        setObra({ ...obra, instalacaoUC: e.target.value })
                      }
                    />
                  </Field>
                </div>
              )}
              {obra.localizacao === "Rural" && (
                <div className="grid grid-2" style={{ marginTop: 14 }}>
                  <Field label="Município" req>
                    <Inp
                      value={obra.cidade}
                      onChange={(e) =>
                        setObra({ ...obra, cidade: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Estado" req>
                    <Inp
                      value={obra.estado}
                      onChange={(e) =>
                        setObra({ ...obra, estado: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Distrito / Comunidade / Região">
                    <Inp
                      value={obra.distritoComunidade}
                      onChange={(e) =>
                        setObra({ ...obra, distritoComunidade: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Nome da propriedade">
                    <Inp
                      value={obra.nomePropriedade}
                      onChange={(e) =>
                        setObra({ ...obra, nomePropriedade: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Ponto de referência">
                    <Inp
                      value={obra.pontoRef}
                      onChange={(e) =>
                        setObra({ ...obra, pontoRef: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Nº instalação mais próxima">
                    <Inp
                      value={obra.instProxima}
                      onChange={(e) =>
                        setObra({ ...obra, instProxima: e.target.value })
                      }
                    />
                  </Field>
                </div>
              )}
              <div className="grid grid-2 divider">
                <Field label="Distância padrão→rede CEMIG inferior a 30 m?">
                  <Toggle
                    value={obra.distMenor30}
                    onChange={(v) => setObra({ ...obra, distMenor30: v })}
                    options={[
                      { v: "Sim", l: "Sim" },
                      { v: "Não", l: "Não" },
                    ]}
                  />
                </Field>
                <Field
                  label={
                    coordObrigatoria
                      ? "Coordenada (lat, long)"
                      : "Coordenada (lat, long) — opcional"
                  }
                  req={coordObrigatoria}
                  hint="Ex: -19.9123, -43.9385"
                >
                  <Inp
                    value={obra.coordenada}
                    onChange={(e) =>
                      setObra({ ...obra, coordenada: e.target.value })
                    }
                    placeholder="-19.9123, -43.9385"
                  />
                </Field>
              </div>
              {coordObrigatoria && !coordPreenchida && (
                <div className="alert alert-warn" style={{ marginTop: 8 }}>
                  ⚠ Em área rural com distância superior a 30 m da rede CEMIG, a
                  coordenada é obrigatória para localização da propriedade.
                </div>
              )}
              <div className="grid grid-2 divider">
                <Field label="O padrão está pronto para ser ligado?" req>
                  <Toggle
                    value={obra.prontoLigar}
                    onChange={(v) => setObra({ ...obra, prontoLigar: v })}
                    options={[
                      { v: "Sim", l: "Sim" },
                      { v: "Não", l: "Não" },
                    ]}
                  />
                </Field>
                <Field label="UC em Área de Preservação Permanente (APP)?">
                  <Toggle
                    value={obra.app}
                    onChange={(v) => setObra({ ...obra, app: v })}
                    options={[
                      { v: "Sim", l: "Sim" },
                      { v: "Não", l: "Não" },
                    ]}
                  />
                </Field>
                <Field label="UC em Reserva Legal?">
                  <Toggle
                    value={obra.reservaLegal}
                    onChange={(v) => setObra({ ...obra, reservaLegal: v })}
                    options={[
                      { v: "Sim", l: "Sim" },
                      { v: "Não", l: "Não" },
                    ]}
                  />
                </Field>
                <Field label="Tipo de rede BT que atende o local">
                  <Sel
                    value={obra.tipoRede}
                    onChange={(e) =>
                      setObra({ ...obra, tipoRede: e.target.value })
                    }
                  >
                    <option>Monofásica</option>
                    <option>Bifásica</option>
                    <option>Trifásica</option>
                  </Sel>
                </Field>
                <Field label="Código do transformador mais próximo">
                  <Inp
                    value={obra.transformador}
                    onChange={(e) =>
                      setObra({ ...obra, transformador: e.target.value })
                    }
                  />
                </Field>
              </div>
            </Card>
          )}

          {/* ===== CARGAS: previsão (coletivo) ou detalhamento (individual) ===== */}
          {aba === "cargas" && coletivo && (
            <Card
              eyebrow="Carga do agrupamento"
              title="Previsão de Carga"
              sub="Informe a previsão de carga instalada por grupo (kW) e a demanda total prevista (kVA) do agrupamento. Os valores são digitados — não há detalhamento por equipamento no atendimento coletivo."
            >
              <div className="prev-carga">
                <Field label="Iluminação (kW)">
                  <Inp
                    type="number"
                    value={prev.ilum}
                    onChange={(e) => setPrev({ ...prev, ilum: e.target.value })}
                    placeholder="0,0"
                  />
                </Field>
                <Field label="Tomada (kW)">
                  <Inp
                    type="number"
                    value={prev.tomada}
                    onChange={(e) =>
                      setPrev({ ...prev, tomada: e.target.value })
                    }
                    placeholder="0,0"
                  />
                </Field>
                <Field label="Chuveiro (kW)">
                  <Inp
                    type="number"
                    value={prev.chuveiro}
                    onChange={(e) =>
                      setPrev({ ...prev, chuveiro: e.target.value })
                    }
                    placeholder="0,0"
                  />
                </Field>
                <Field label="Ar Cond. (kW)">
                  <Inp
                    type="number"
                    value={prev.ar}
                    onChange={(e) => setPrev({ ...prev, ar: e.target.value })}
                    placeholder="0,0"
                  />
                </Field>
                <Field label="Outros (kW)">
                  <Inp
                    type="number"
                    value={prev.outros}
                    onChange={(e) =>
                      setPrev({ ...prev, outros: e.target.value })
                    }
                    placeholder="0,0"
                  />
                </Field>
              </div>
              <div style={{ marginTop: 12 }}>
                <Field
                  label="Descrição (Outros)"
                  hint="Ex: Outros itens nas UCs — bombas, elevadores, áreas comuns…"
                >
                  <Inp
                    value={prev.outrosDesc}
                    onChange={(e) =>
                      setPrev({ ...prev, outrosDesc: e.target.value })
                    }
                    placeholder="Outros itens nas UCs"
                  />
                </Field>
              </div>
              <div className="prev-total">
                <div className="kpi">
                  <div className="kpi-label">Total Carga Instalada</div>
                  <div className="kpi-value">{fmt2(prevTotalKw)} kW</div>
                </div>
                <div className="kpi" style={{ flex: 1.4 }}>
                  <div className="kpi-label">Demanda prevista (kVA) *</div>
                  <Inp
                    type="number"
                    value={prev.demanda}
                    onChange={(e) =>
                      setPrev({ ...prev, demanda: e.target.value })
                    }
                    placeholder="0,0"
                  />
                </div>
                <div className="kpi dark">
                  <div className="kpi-label">Demanda do atendimento</div>
                  <div className="kpi-value" style={{ fontSize: 18 }}>
                    {fmt2(demandaTotalGeral)} kVA
                  </div>
                </div>
              </div>
              {demandaTotalGeral > 304 && (
                <div className="alert alert-info" style={{ marginTop: 14 }}>
                  Demanda total acima de 304 kVA: o atendimento fica
                  condicionado à apresentação do projeto elétrico com ART/TRT.
                </div>
              )}
            </Card>
          )}

          {aba === "cargas" && !coletivo && (
            <Card
              eyebrow="Detalhamento"
              title="Cargas da Unidade Consumidora"
              sub="Detalhe os equipamentos da unidade. A demanda e o disjuntor são calculados automaticamente (ND-5.1)."
            >
              <CalcDemanda
                data={ucDet.cargas}
                onChange={(c) => setUcDet({ ...ucDet, cargas: c })}
                redeMono={redeMono}
              />
              {ucDet.cargas?._disjuntores?.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <Field label="Disjuntor escolhido para esta UC">
                    <Sel
                      value={
                        ucDet.disjEscolhido || ucDet.cargas._disjuntores[0]
                      }
                      onChange={(e) =>
                        setUcDet({ ...ucDet, disjEscolhido: e.target.value })
                      }
                    >
                      {ucDet.cargas._disjuntores.map((dj) => (
                        <option key={dj} value={dj}>
                          {dj}
                        </option>
                      ))}
                    </Sel>
                  </Field>
                </div>
              )}
            </Card>
          )}

          {/* ===== UNIDADES CONSUMIDORAS ===== */}
          {aba === "ucs" && coletivo && (
            <div>
              <Card
                eyebrow="Identificação"
                title={`Unidades Consumidoras (${ucBlocos.length})`}
                sub="Preencha os dados de identificação de cada UC. O número de blocos segue o Nº de Unidades Consumidoras informado no Tipo de Atendimento. Campos com valor padrão já vêm preenchidos."
              >
                {ucBlocos.map((u, ui) => (
                  <div key={ui} className="uc-block">
                    <div className="uc-block-head">
                      <span className="uc-block-title">
                        {u.identificacao || `UC ${ui + 1}`}
                      </span>
                      <Badge>
                        {ui + 1} de {ucBlocos.length}
                      </Badge>
                    </div>
                    <div className="grid grid-3">
                      <Field label="Identificação" hint="Ex: Torre 1 - UC 1">
                        <Inp
                          value={u.identificacao}
                          onChange={(e) =>
                            setBloco(ui, { identificacao: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Nº Predial">
                        <Inp
                          value={u.nPredial}
                          onChange={(e) =>
                            setBloco(ui, { nPredial: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Complemento" req={ucBlocos.length > 1}>
                        <Inp
                          value={u.complemento}
                          onChange={(e) =>
                            setBloco(ui, { complemento: e.target.value })
                          }
                          placeholder="Ex: 101"
                        />
                      </Field>
                      <Field label="Caixa">
                        <Inp
                          value={u.caixa}
                          onChange={(e) =>
                            setBloco(ui, { caixa: e.target.value })
                          }
                          placeholder="Ex: Apartamento"
                        />
                      </Field>
                      <Field label="Solicitação" req>
                        <Sel
                          value={u.solicitacao}
                          onChange={(e) =>
                            setBloco(ui, { solicitacao: e.target.value })
                          }
                        >
                          <option>Conexão Nova</option>
                          <option>Alteração de Carga</option>
                          <option>Caixa Existente sem Alteração</option>
                        </Sel>
                      </Field>
                      <Field label="Mudança de local">
                        <Toggle
                          value={u.mudancaLocal}
                          onChange={(v) => setBloco(ui, { mudancaLocal: v })}
                          options={[
                            { v: "Sim", l: "Sim" },
                            { v: "Não", l: "Não" },
                          ]}
                        />
                      </Field>
                      <Field label="Atividade principal" req>
                        <Sel
                          value={u.atividade}
                          onChange={(e) =>
                            setBloco(ui, { atividade: e.target.value })
                          }
                        >
                          <option>Residencial</option>
                          <option>Comercial</option>
                          <option>Industrial</option>
                          <option>Rural</option>
                        </Sel>
                      </Field>
                      <Field
                        label="Ramo de atividade"
                        req={u.atividade !== "Residencial"}
                      >
                        <Inp
                          value={u.ramo}
                          onChange={(e) =>
                            setBloco(ui, { ramo: e.target.value })
                          }
                          placeholder={
                            u.atividade === "Residencial"
                              ? "—"
                              : "Obrigatório se não residencial"
                          }
                        />
                      </Field>
                      <Field label="Instalação">
                        <Inp
                          value={u.instalacao}
                          onChange={(e) =>
                            setBloco(ui, { instalacao: e.target.value })
                          }
                          placeholder="Nº instalação (se existente)"
                        />
                      </Field>
                      <Field label="Disjuntor" span={3}>
                        <div className="disj-pair">
                          <div>
                            <Sel
                              value={u.disjDe}
                              onChange={(e) =>
                                setBloco(ui, { disjDe: e.target.value })
                              }
                            >
                              <option value="">De: (atual)…</option>
                              {DISJ.map((d) => (
                                <option key={d.fx} value={d.fx}>
                                  {d.fx}
                                </option>
                              ))}
                            </Sel>
                          </div>
                          <div>
                            <Sel
                              value={u.disjPara}
                              onChange={(e) =>
                                setBloco(ui, { disjPara: e.target.value })
                              }
                            >
                              <option value="">Para: (solicitado)…</option>
                              {DISJ.map((d) => (
                                <option key={d.fx} value={d.fx}>
                                  {d.fx}
                                </option>
                              ))}
                            </Sel>
                          </div>
                        </div>
                      </Field>
                    </div>
                  </div>
                ))}
              </Card>

              {disjGeralObrigatorio && (
                <Card
                  eyebrow="Proteção geral"
                  title="Disjuntor Geral do Agrupamento"
                  sub={`Obrigatório quando há UC bi/trifásica com proteção acima de 60/63 A. Faixas disponíveis: acima de ${maiorCorrenteUC || "—"} A (maior disjuntor das UCs).`}
                >
                  <div className="geral-box" style={{ marginTop: 0 }}>
                    <Field label="Disjuntor geral" req>
                      <Sel
                        value={atend.disjuntorGeral}
                        onChange={(e) =>
                          setAtend({ ...atend, disjuntorGeral: e.target.value })
                        }
                      >
                        <option value="">Selecione…</option>
                        {opcoesDisjGeral.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </Sel>
                    </Field>
                    {opcoesDisjGeral.length === 0 && (
                      <div
                        className="alert alert-info"
                        style={{ marginTop: 10 }}
                      >
                        Preencha os disjuntores das UCs acima para liberar as
                        opções.
                      </div>
                    )}
                    {atend.disjuntorGeral &&
                      correnteDisj(atend.disjuntorGeral) <= maiorCorrenteUC && (
                        <div
                          className="alert alert-warn"
                          style={{ marginTop: 10 }}
                        >
                          ⚠ O disjuntor geral deve ter faixa superior ao maior
                          disjuntor das UCs ({maiorCorrenteUC} A).
                        </div>
                      )}
                  </div>
                </Card>
              )}
            </div>
          )}

          {aba === "ucs" && !coletivo && (
            <Card
              eyebrow="Identificação"
              title="Unidade Consumidora"
              sub="Dados de identificação da unidade consumidora (atendimento individual)."
            >
              <div className="grid grid-3">
                <Field label="Tipo de solicitação" req>
                  <Sel
                    value={ucDet.solicitacao}
                    onChange={(e) =>
                      setUcDet({ ...ucDet, solicitacao: e.target.value })
                    }
                  >
                    <option>Conexão Nova</option>
                    <option>Alteração de Carga</option>
                    <option>Caixa Existente sem Alteração</option>
                  </Sel>
                </Field>
                <Field label="Atividade principal" req>
                  <Sel
                    value={ucDet.atividade}
                    onChange={(e) =>
                      setUcDet({ ...ucDet, atividade: e.target.value })
                    }
                  >
                    <option>Residencial</option>
                    <option>Comercial</option>
                    <option>Industrial</option>
                    <option>Rural</option>
                  </Sel>
                </Field>
                <Field
                  label="Ramo de atividade"
                  req={ucDet.atividade !== "Residencial"}
                >
                  <Inp
                    value={ucDet.ramo}
                    onChange={(e) =>
                      setUcDet({ ...ucDet, ramo: e.target.value })
                    }
                    placeholder={
                      ucDet.atividade === "Residencial" ? "—" : "Obrigatório"
                    }
                  />
                </Field>
                {ucDet.solicitacao === "Conexão Nova" ? (
                  <React.Fragment>
                    <Field label="Nº Predial" req>
                      <Inp
                        value={ucDet.nPredial}
                        onChange={(e) =>
                          setUcDet({ ...ucDet, nPredial: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Complemento">
                      <Inp
                        value={ucDet.complemento}
                        onChange={(e) =>
                          setUcDet({ ...ucDet, complemento: e.target.value })
                        }
                        placeholder="Ex: Casa 1"
                      />
                    </Field>
                    <Field label="Caixa / Identificação">
                      <Inp
                        value={ucDet.caixa}
                        onChange={(e) =>
                          setUcDet({ ...ucDet, caixa: e.target.value })
                        }
                      />
                    </Field>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Field label="Nº Instalação / Medidor" req>
                      <Inp
                        value={ucDet.instalacao}
                        onChange={(e) =>
                          setUcDet({ ...ucDet, instalacao: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Disjuntor De">
                      <Inp
                        value={ucDet.disjDe}
                        onChange={(e) =>
                          setUcDet({ ...ucDet, disjDe: e.target.value })
                        }
                        placeholder="Ex: 1x40"
                      />
                    </Field>
                    <Field label="Disjuntor Para">
                      <Inp
                        value={ucDet.disjPara}
                        onChange={(e) =>
                          setUcDet({ ...ucDet, disjPara: e.target.value })
                        }
                        placeholder="Ex: 3x63"
                      />
                    </Field>
                  </React.Fragment>
                )}
              </div>
              <div className="alert alert-ok" style={{ marginTop: 14 }}>
                O detalhamento das cargas desta unidade é feito na etapa{" "}
                <b>Cargas da UC</b>. Demanda atual:{" "}
                <b>{fmt2(ucDet.cargas?._demanda || 0)} kVA</b> · Disjuntor:{" "}
                <b>
                  {ucDet.disjEscolhido ||
                    (ucDet.cargas?._disjuntores || [])[0] ||
                    "—"}
                </b>
              </div>
            </Card>
          )}

          {/* ===== GERADOR (individual) ===== */}
          {aba === "gerador" && !coletivo && (
            <Card
              eyebrow="Complementar"
              title="Gerador de Emergência"
              sub="Informe se a instalação possui gerador de emergência."
            >
              <Field label="Há gerador de emergência?" req>
                <Toggle
                  value={gerador.possui}
                  onChange={(v) => setGerador({ ...gerador, possui: v })}
                  options={[
                    { v: "Sim", l: "Sim" },
                    { v: "Não", l: "Não" },
                  ]}
                />
              </Field>
              {gerador.possui === "Sim" && (
                <div className="grid grid-2" style={{ marginTop: 14 }}>
                  <Field label="Potência do gerador (kVA)">
                    <Inp
                      value={gerador.potencia}
                      onChange={(e) =>
                        setGerador({ ...gerador, potencia: e.target.value })
                      }
                    />
                  </Field>
                  <Field label="Fonte / Combustível">
                    <Sel
                      value={gerador.fonte}
                      onChange={(e) =>
                        setGerador({ ...gerador, fonte: e.target.value })
                      }
                    >
                      <option value="">Selecione</option>
                      <option>Diesel</option>
                      <option>Gasolina</option>
                      <option>Gás (GLP/GNV)</option>
                      <option>Outro</option>
                    </Sel>
                  </Field>
                  <Field label="Descrição / Observações do gerador" span={2}>
                    <Inp
                      value={gerador.descricao}
                      onChange={(e) =>
                        setGerador({ ...gerador, descricao: e.target.value })
                      }
                      placeholder="Modelo, finalidade, regime de operação..."
                    />
                  </Field>
                  <div className="col-span-2 callout">
                    O gerador de emergência opera de forma isolada (sem
                    paralelismo com a rede CEMIG). Caso haja paralelismo ou
                    injeção, o atendimento deve ser tratado como Geração
                    Distribuída.
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* ===== OBSERVAÇÕES ===== */}
          {aba === "obs" && (
            <Card
              eyebrow="Informações adicionais"
              title="Observações"
              sub="Inclua informações relevantes: justificativa de disjuntor, atendimento híbrido, geração já conectada, etc."
            >
              <Field>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={6}
                />
              </Field>
            </Card>
          )}

          {/* ===== PRÉVIA & PDF ===== */}
          {aba === "revisar" && (
            <div>
              <Card
                eyebrow="Etapa final"
                title="Prévia do Formulário"
                sub="Confira os dados. Se algo estiver incorreto, volte às etapas anteriores pela barra lateral. Quando estiver tudo certo, exporte o PDF."
              >
                <div className="kpi-row">
                  <div className="kpi">
                    <div className="kpi-label">Proprietário</div>
                    <div className="kpi-value" style={{ fontSize: 14 }}>
                      {prop.nome || "—"}
                    </div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-label">Unidades Consumidoras</div>
                    <div className="kpi-value">
                      {coletivo ? ucBlocos.length : 1}
                    </div>
                  </div>
                  <div className="kpi dark">
                    <div className="kpi-label">Demanda Total</div>
                    <div className="kpi-value" style={{ fontSize: 18 }}>
                      {fmt2(demandaTotalGeral)} kVA
                    </div>
                  </div>
                </div>
                <div className="preview-block">
                  <h4>Modalidade</h4>
                  <div className="preview-item">
                    <span className="v">
                      {coletivo
                        ? "Coletivo — Agrupamento com Proteção Geral (APR Web)"
                        : "Individual / até 3 caixas sem proteção geral"}
                      {atend.disjuntorGeral
                        ? ` · Disjuntor geral: ${atend.disjuntorGeral}`
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="preview-block">
                  <h4>Obra</h4>
                  <div className="preview-grid">
                    <div className="preview-item">
                      <span className="k">Endereço</span>
                      <span className="v">
                        {obra.endereco || "—"}, {obra.num || "s/n"}
                      </span>
                    </div>
                    <div className="preview-item">
                      <span className="k">Cidade / UF</span>
                      <span className="v">
                        {obra.cidade || "—"} / {obra.estado}
                      </span>
                    </div>
                    <div className="preview-item">
                      <span className="k">Localização</span>
                      <span className="v">{obra.localizacao}</span>
                    </div>
                    <div className="preview-item">
                      <span className="k">Coordenada</span>
                      <span className="v">{obra.coordenada || "—"}</span>
                    </div>
                  </div>
                </div>
                {coletivo ? (
                  <div className="preview-block">
                    <h4>Previsão de carga e UCs</h4>
                    <div className="preview-item">
                      <span className="v">
                        Total {fmt2(prevTotalKw)} kW · Demanda{" "}
                        {fmt2(demandaTotalGeral)} kVA
                      </span>
                    </div>
                    {ucBlocos.map((u, ui) => (
                      <div
                        key={ui}
                        className="preview-item"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="v">
                          {u.identificacao || `UC ${ui + 1}`} · {u.atividade} ·{" "}
                          {u.solicitacao}{" "}
                          {u.complemento ? `· ${u.complemento}` : ""}
                        </span>
                        <span
                          style={{ color: "var(--verde)", fontWeight: 700 }}
                        >
                          {u.disjPara || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="preview-block">
                    <h4>Unidade Consumidora</h4>
                    <div
                      className="preview-item"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span className="v">
                        {ucDet.atividade} · {ucDet.solicitacao}{" "}
                        {ucDet.complemento ? `· ${ucDet.complemento}` : ""}
                      </span>
                      <span style={{ color: "var(--verde)", fontWeight: 700 }}>
                        {fmt2(ucDet.cargas?._demanda || 0)} kVA ·{" "}
                        {ucDet.disjEscolhido ||
                          (ucDet.cargas?._disjuntores || [])[0] ||
                          "—"}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
              <Card sub="Anexe à solicitação: planta de situação (A4), ART/TRT de projeto (quando aplicável) e documentos de regularidade do imóvel, conforme as orientações da CEMIG.">
                <Btn variant="dark" onClick={gerarPDF}>
                  📄 Exportar PDF
                </Btn>
              </Card>
            </div>
          )}

          {/* ===== NAVEGAÇÃO ===== */}
          <div className="nav-bottom">
            <Btn variant="ghost" onClick={irAnt} disabled={idx === 0}>
              ← Voltar
            </Btn>
            <span className="nav-step-info">
              Etapa {idx + 1} de {abas.length}
            </span>
            {aba === "revisar" ? (
              <Btn variant="primary" onClick={gerarPDF}>
                📄 Exportar PDF
              </Btn>
            ) : (
              <Btn variant="primary" onClick={irProx}>
                Avançar →
              </Btn>
            )}
          </div>
        </main>
      </div>

      <div className="footer">
        Documento gerado eletronicamente · não substitui o formulário oficial
        CEMIG ·
        <a
          href="https://www.cemig.com.br/como-solicitar-os-principais-servicos/ligacao-nova-e-aumento-de-carga/ligacao-nova-ou-alteracao-de-carga-para-demandas-especificas/"
          target="_blank"
          rel="noreferrer"
        >
          {" "}
          Saiba mais no portal Cemig
        </a>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
