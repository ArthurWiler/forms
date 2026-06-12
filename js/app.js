/* ============================================================
   CEMIG — Aplicação principal (React + Babel)
   Formulário unificado de Orçamento de Conexão BT
   Individual · Coletivo · Múltiplas Torres/Blocos
   ============================================================ */

const ORIENTACOES = {
  intro:
    "Leia as orientações antes de iniciar. Este formulário destina-se a pedidos de Ligação Nova ou Alteração de Carga em Baixa Tensão (BT), conforme a Resolução Normativa ANEEL nº 1.000/2021.",
  geral: {
    titulo: "Orientações gerais",
    itens: [
      "Para solicitações com carga instalada acima de 75 kW, é obrigatório anexar a ART de projeto paga, planta situação, e formulário preenchdido no APR Web.",
      "Conforme artigo 9° da Resolução Normativa ANEEL Nº 1.000/2021 que trata da representação, o responsável técnico deverá apresentar procuração (pessoa física ou pessoa jurídica) para solicitações em nome de terceiros.",
      "Para os pedidos de Conexão Nova é obrigatório anexar ao formulário um documento que comprove a propriedade ou posse do local a ser atendido. Para unidade consumidora localizada em área urbana, também deverá ser anexado documento que comprove a regularidade do imóvel.",
      "Deverão ser apresentados, no ato da solicitação, documentos originais do titular pessoa física (documento oficial com foto e CPF) e, em caso de pessoa jurídica, os documentos relativos à sua constituição, ao seu registro e do(s) seus(s) representante(s) legal(is)",
      "Caso a propriedade esteja localizada em área protegida pela legislação, é obrigatório apresentar documento que comprove a regularização ambiental emitido por órgão competente.",
      "Caso a propriedade esteja em entorno de reservatório deve ser apresentada autorização da concessionária ou do responsável pelo reservatório.",
      "O padrão deverá ser instalado dentro da propriedade.",
      "Conforme regulação vigente, o responsável técnico deverá apresentar procuração (pessoa física ou pessoa jurídica) para solicitações em nome de terceiros.",
      "Para os casos de conexão com GRID ZERO é necessário protocolar solicitação como um pedido de Geração distribuída.Verificar no site da CEMIG >> Cemig Atende >> Geração Distribuída >> Manual de Solicitação de Grid Zero (GD sem injeção)",
      "Conforme regulação da ANEEL, caso seja marcado 'Sim' para a pergunta 'O padrão está pronto para ser ligado?*', o pedido de vistoria e ligação será disparado automaticamente após conclusão das etapas do orçamento de conexão.Caso seja marcado 'Não', você deve solicitar seu pedido de vistoria e ligação em até 120 dias após a conclusão das etapas do orçamento de conexão. Lembrando que o orçamento de conexão poderá ser cancelado em caso de duas reprovações pelo mesmo motivo e que há cobrança de taxa a partir do segundo serviço realizado. Diante disso, a primeira caixa relacionada no campo Unidade Consumidora 1 será a caixa a ser energizada no final do processo de conexão. A mesma regra poderá ser aplicada para alteração de carga com mudança de local.",
      "O pedido poderá ser reprovado no momento da visita técnica caso não sejam identificadas as cargas declaradas neste formulário.",
    ],
  },
  individual: {
    titulo:
      "Atendimento individual ou agrupamento com até 3 caixas sem proteção geral",
    itens: [
      "Para Conexão Nova, o número predial, a atividade principal da unidade consumidora (Residencial, Comercial, Industrial ou Rural) e o Ramo de Atividade (caso não seja residencial). Quando aplicável, informar também o complemento da caixa (ex: Cond, Lj1, Casa 1, Apto 101 etc.).",
      "Para opção Alteração de Carga ou Caixa existente sem Alteração de Carga, informar o número da instalação, o número do medidor ou o número da caixa (complemento).",
      "Para Alteração de Carga ou Caixa existente sem Alteração de Carga, informar o novo ramo de atividade e a alteração de complemento, somente se houver alteração;",
      "O cálculo da carga instalada total em kW, a demanda em kVA e o preenchimento do disjuntor será feito automaticamente",
      "Para Alteração de Carga,o cálculo da carga instalada total em kW, a demanda em kVA e o preenchimento do disjuntor futuro será feito automaticamente",
    ],
  },
  coletivo: {
    titulo:
      "Agrupamento com proteção geral, atendimento híbrido ou múltiplas torres/blocos",
    itens: [
      "O atendimento pela Cemig ao pedido de Conexão/aumento de carga ficará condicionado à apresentação do projeto elétrico juntamente com a Anotação de Responsabilidade Técnica (ou equivalente) de projeto, para todas as edificações de uso coletivo com demanda total superior a 304kVA.",
      "É obrigatório anexar no momento do pedido a planta de situação da edificação, com a indicação do padrão de entrada e a distância do ramal de entrada, conforme ND-5.2, com exceção para solicitação de alteração de carga sem mudança de local do ramal de Conexão. O Documento deve ser encaminhado no portal Cemig Atende e no APR Web.",
      "Preenche-se uma previsão de carga geral e os dados de identificação de cada unidade consumidora.",
      "Para empreendimentos com múltiplas torres ou blocos, cada bloco pode ter seu disjuntor geral e seu disjuntor de combate a incêndio.",
      "Para demanda total superior a 304 kVA, o atendimento fica condicionado à apresentação do projeto elétrico com ART/TRT.",
      "Motores monofásicos acima de 15 CV e/ou trifásicos acima de 50 CV exigem o formulário de análise de partida de motores.",
      "Para atendimentos híbridos, deve ser informada na planta de situação: quantidade de ramais de Conexão com a respectiva numeração predial de cada ponto de entrega, demanda de cada ramal de Conexão com a respectiva proteção geral (quando couber) e especificações dos cabos subterrâneos. Na ART/TRT deverão ser informados todos os números prediais que serão atendidos. Em casos de desmembramento, o ramal que não sofrerá alteração poderá apenas ser indicado na planta.",
      "Se a solicitação for para atendimento híbrido, é obrigatório indicar na planta de situação o número predial de cada unidade consumidora",
    ],
  },
  callout:
    "Pedido de vistoria e ligação: se o padrão estiver pronto para ligar, a vistoria é disparada após o orçamento; caso contrário, há prazo para solicitá-la. O orçamento pode ser cancelado após reprovações pelo mesmo motivo.",
};

// ===== Solicitação -> Escopos dependentes =====
const SOLICITACOES = [
  "1- Disjuntor individual abaixo de 75 kW",
  "2- Disjuntor individual acima de 75 kW",
  "3- Disjuntor geral em padrão coletivo",
  "4- Atendimento Híbrido",
  "5- Atendimento a Empreendimento com Múltiplas Torres ou Blocos",
];
const ESCOPOS = {
  "1- Disjuntor individual abaixo de 75 kW": [
    "Ligação Nova",
    "Aumento de Carga",
    "Adequação de padrão",
  ],
  "2- Disjuntor individual acima de 75 kW": [
    "Ligação Nova",
    "Aumento de Carga",
    "Adequação de padrão",
  ],
  "3- Disjuntor geral em padrão coletivo": [
    "Ligação Nova",
    "Alteração de Carga com alteração do disjuntor geral",
    "Alteração de Carga sem alteração do disjuntor geral",
    "Adequação de padrão",
  ],
  "4- Atendimento Híbrido": [
    "Ligação Nova",
    "Aumento de Carga",
    "Adequação de padrão",
  ],
  "5- Atendimento a Empreendimento com Múltiplas Torres ou Blocos": [
    "Ligação Nova",
    "Outro",
  ],
};

// Bloco de UC (identificação no coletivo) — valores padrão
const ucBlocoPadrao = (i) => ({
  identificacao: `UC ${i + 1}`,
  nPredial: "",
  complemento: "",
  caixa: "",
  solicitacao: "Conexão Nova",
  mudancaLocal: "Não",
  atividade: "Residencial",
  ramo: "",
  instalacao: "",
  disjDe: "",
  disjPara: "Bipolar 63 A",
});

// UC detalhada (individual) — identificação + calculadora
const ucDetalhadaPadrao = () => ({
  solicitacao: "Conexão Nova",
  atividade: "Residencial",
  ramo: "",
  nPredial: "",
  complemento: "",
  caixa: "",
  instalacao: "",
  mudancaLocal: "Não",
  disjDe: "",
  disjPara: "",
  disjEscolhido: "",
  cargas: { qtds: CAT.map(() => 0), tipoA: "res", catA: 0, mots: [] },
});

// UC de torre/bloco (modo múltiplas torres) — identificação por unidade
const ucTorrePadrao = (i) => ({
  identificacao: `UC ${i + 1}`,
  nPredial: "",
  complemento: "",
  caixa: "",
  solicitacao: "Conexão Nova",
  atividade: "Residencial",
  ramo: "",
  instalacao: "",
  disjPara: "Bipolar 63 A",
});

// Torre/Bloco (modo múltiplas torres) — preenchimento em massa
const blocoPadrao = (i) => ({
  nome: `${i + 1}`,
  disjGeral: "Tripolar 200 A",
  demandaBloco: "",
  qtdUCs: "",
  disjIncendio: "Bipolar 63 A",
  demandaIncendio: "",
  ucs: [ucTorrePadrao(0)],
});

// ============================================================
// APP
// ============================================================
function App() {
  const [aba, setAba] = useState("orient");

  // ---- Tipo de atendimento ----
  const [atend, setAtend] = useState({
    disjGeral: "Não", // possui disjuntor geral? Não=Individual, Sim=Coletivo
    nUCs: 1,
    biAcima63: false,
    triAcima63: false,
    acima75: false,
    solicitacao: SOLICITACOES[1], // padrão (coletivo)
    escopo: "Ligação Nova", // padrão
    disjuntorGeral: "",
    atendA: "Bloco", // múltiplas torres: atendimento a Bloco/Torre
    nBlocos: 1,
  });
  const coletivo = atend.disjGeral === "Sim";
  const multiTorres = coletivo && atend.solicitacao === SOLICITACOES[4];

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
  const [cnpjStatus, setCnpjStatus] = useState("");

  // Pessoa física? (depende do documento digitado em CPF/CNPJ)
  const docInfo = useMemo(() => validarCpfCnpj(prop.cpfCnpj), [prop.cpfCnpj]);
  const pessoaFisica = docInfo.tipo !== "CNPJ"; // CPF ou vazio => trata como PF

  // ---- Previsão de carga (coletivo comum) ----
  const [prev, setPrev] = useState({
    ilum: "",
    tomada: "",
    chuveiro: "",
    ar: "",
    outrosDesc: "Outros itens nas UCs",
    outros: "",
    demanda: "",
  });
  const num = (v) => parseFloat(String(v).replace(",", ".")) || 0;
  const prevTotalKw = useMemo(
    () =>
      ["ilum", "tomada", "chuveiro", "ar", "outros"].reduce(
        (s, k) => s + num(prev[k]),
        0,
      ),
    [prev],
  );

  // ---- UCs detalhadas (individual) — uma calculadora por UC ----
  const [ucsDet, setUcsDet] = useState([ucDetalhadaPadrao()]);
  const setUcDet = (i, patch) =>
    setUcsDet((p) => p.map((u, idx) => (idx === i ? { ...u, ...patch } : u)));

  // ---- Blocos de UC (coletivo comum) ----
  const [ucBlocos, setUcBlocos] = useState([ucBlocoPadrao(0)]);
  const setBloco = (i, patch) =>
    setUcBlocos((p) => p.map((u, idx) => (idx === i ? { ...u, ...patch } : u)));
  // Preenchimento em massa: replica a UC 1 para as demais (mantém identificação/complemento/instalação individuais)
  const replicarUC1Coletivo = () =>
    setUcBlocos((p) => {
      const base = p[0];
      if (!base) return p;
      return p.map((u, k) =>
        k === 0
          ? u
          : {
              ...base,
              identificacao: u.identificacao || `UC ${k + 1}`,
              nPredial: u.nPredial,
              complemento: u.complemento,
              caixa: u.caixa,
              instalacao: u.instalacao,
            },
      );
    });

  // ---- Torres/Blocos (múltiplas torres) ----
  const [blocos, setBlocos] = useState([blocoPadrao(0)]);
  const setTorre = (i, patch) =>
    setBlocos((p) => p.map((b, idx) => (idx === i ? { ...b, ...patch } : b)));
  const replicarPrimeiro = () =>
    setBlocos((p) =>
      p.map((b, i) =>
        i === 0
          ? b
          : {
              ...p[0],
              nome: `${i + 1}`,
              ucs: (p[0].ucs || []).map((u, k) => ({ ...u })),
            },
      ),
    );

  // Sincroniza a lista de UCs de uma torre conforme a quantidade informada
  const sincronizarUCsTorre = (i, qtd) => {
    const n = Math.max(1, parseInt(qtd) || 1);
    setBlocos((p) =>
      p.map((b, idx) => {
        if (idx !== i) return b;
        const arr = [...(b.ucs || [])];
        while (arr.length < n) arr.push(ucTorrePadrao(arr.length));
        while (arr.length > n) arr.pop();
        return { ...b, qtdUCs: qtd, ucs: arr };
      }),
    );
  };

  // Atualiza uma UC específica dentro de uma torre
  const setUcTorre = (bi, ui, patch) =>
    setBlocos((p) =>
      p.map((b, idx) =>
        idx === bi
          ? {
              ...b,
              ucs: (b.ucs || []).map((u, k) =>
                k === ui ? { ...u, ...patch } : u,
              ),
            }
          : b,
      ),
    );

  // Preenchimento em massa: replica a UC 1 de uma torre para as demais UCs da mesma torre
  const replicarUC1Torre = (bi) =>
    setBlocos((p) =>
      p.map((b, idx) => {
        if (idx !== bi) return b;
        const base = (b.ucs || [])[0];
        if (!base) return b;
        return {
          ...b,
          ucs: b.ucs.map((u, k) =>
            k === 0
              ? u
              : {
                  ...base,
                  identificacao: `UC ${k + 1}`,
                  instalacao: u.instalacao,
                },
          ),
        };
      }),
    );

  // Sincroniza nº de UCs (individual: máx 3; coletivo: blocos de identificação)
  useEffect(() => {
    const n = Math.max(1, Number(atend.nUCs) || 1);
    if (coletivo) {
      setUcBlocos((prevB) => {
        if (prevB.length === n) return prevB;
        const arr = [...prevB];
        while (arr.length < n) arr.push(ucBlocoPadrao(arr.length));
        while (arr.length > n) arr.pop();
        return arr;
      });
    } else {
      const ni = Math.min(n, 3); // individual: até 3 caixas
      setUcsDet((prevD) => {
        if (prevD.length === ni) return prevD;
        const arr = [...prevD];
        while (arr.length < ni) arr.push(ucDetalhadaPadrao());
        while (arr.length > ni) arr.pop();
        return arr;
      });
    }
  }, [atend.nUCs, coletivo]);

  // Sincroniza nº de torres/blocos
  useEffect(() => {
    if (!multiTorres) return;
    const n = Math.max(1, Number(atend.nBlocos) || 1);
    setBlocos((prevB) => {
      if (prevB.length === n) return prevB;
      const arr = [...prevB];
      while (arr.length < n) arr.push(blocoPadrao(arr.length));
      while (arr.length > n) arr.pop();
      return arr;
    });
  }, [atend.nBlocos, multiTorres]);

  // Escopo coerente com a solicitação
  useEffect(() => {
    const ops = ESCOPOS[atend.solicitacao] || [];
    if (!ops.includes(atend.escopo))
      setAtend((a) => ({ ...a, escopo: ops[0] || "" }));
  }, [atend.solicitacao]);

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
      if (alvo === "obra")
        setObra((o) => ({
          ...o,
          endereco: dd.logradouro || o.endereco,
          bairro: dd.bairro || o.bairro,
          cidade: dd.localidade || o.cidade,
          estado: dd.uf || o.estado,
        }));
      else
        setCorr((c) => ({
          ...c,
          rua: dd.logradouro || c.rua,
          bairro: dd.bairro || c.bairro,
          municipio: dd.localidade || c.municipio,
          estado: dd.uf || c.estado,
        }));
      setCepStatus((p) => ({ ...p, [alvo]: "ok" }));
    } catch (e) {
      setCepStatus((p) => ({ ...p, [alvo]: "erro" }));
    }
  };

  // ===== API DE CNPJ (BrasilAPI) =====
  const buscarCNPJ = async (doc) => {
    const limpo = soDigitos(doc);
    if (limpo.length !== 14) {
      setCnpjStatus("");
      return;
    }
    setCnpjStatus("buscando");
    try {
      const r = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${limpo}`);
      if (!r.ok) {
        setCnpjStatus("erro");
        return;
      }
      const dd = await r.json();
      // Razão social -> Nome; e-mail e telefone quando disponíveis
      setProp((p) => ({
        ...p,
        nome: dd.razao_social || dd.nome_fantasia || p.nome,
        email: dd.email || p.email,
        fixo:
          dd.ddd_telefone_1 && !p.fixo
            ? mascararTelefone(dd.ddd_telefone_1)
            : p.fixo,
      }));
      // Endereço da obra (caso ainda vazio) — preenche a partir do CNPJ
      setObra((o) => ({
        ...o,
        cep: dd.cep ? mascararCEP(dd.cep) : o.cep,
        endereco: dd.logradouro || o.endereco,
        num: dd.numero || o.num,
        compl: dd.complemento || o.compl,
        bairro: dd.bairro || o.bairro,
        cidade: dd.municipio || o.cidade,
        estado: dd.uf || o.estado,
      }));
      setCnpjStatus("ok");
    } catch (e) {
      setCnpjStatus("erro");
    }
  };

  // ===== Disjuntor geral obrigatório? =====
  const disjGeralObrigatorio =
    atend.biAcima63 || atend.triAcima63 || atend.disjGeral === "Sim";

  const maiorCorrenteUC = useMemo(() => {
    if (multiTorres) return 0;
    if (coletivo)
      return ucBlocos.reduce(
        (mx, u) =>
          Math.max(mx, correnteDisj(u.disjPara), correnteDisj(u.disjDe)),
        0,
      );
    return ucsDet.reduce((mx, u) => {
      const esc = u.disjEscolhido || (u.cargas?._disjuntores || [])[0] || "";
      return Math.max(mx, correnteDisj(esc));
    }, 0);
  }, [multiTorres, coletivo, ucBlocos, ucsDet]);

  const opcoesDisjGeral = useMemo(
    () => disjuntoresGeraisAcima(maiorCorrenteUC),
    [maiorCorrenteUC],
  );

  // ===== Validação de disjuntores (individual com várias UCs) =====
  const validacaoDisjuntores = useMemo(() => {
    if (coletivo || ucsDet.length <= 1) return { ok: true, msg: "" };
    let tri = 0,
      monoBi = 0;
    ucsDet.forEach((u) => {
      const esc = u.disjEscolhido || (u.cargas?._disjuntores || [])[0] || "";
      if (/Tripolar/i.test(esc)) tri++;
      else if (/Mono|Bipolar/i.test(esc)) monoBi++;
    });
    const acima63 = ucsDet.some((u) => {
      const esc = u.disjEscolhido || (u.cargas?._disjuntores || [])[0] || "";
      return correnteDisj(esc) > 63;
    });
    if (acima63)
      return {
        ok: false,
        msg: "Há UC com disjuntor acima de 63 A — o atendimento exige proteção geral (coletivo). Ajuste o Tipo de Atendimento.",
      };
    if (tri > 1)
      return {
        ok: false,
        msg: `Permitido no máximo 1 disjuntor tripolar de 63 A (atual: ${tri}).`,
      };
    if (monoBi > 2)
      return {
        ok: false,
        msg: `Permitidos no máximo 2 disjuntores mono/bifásicos de 63 A (atual: ${monoBi}).`,
      };
    return {
      ok: true,
      msg: `Combinação válida: ${tri} tripolar(es) + ${monoBi} mono/bifásico(s) de 63 A.`,
    };
  }, [coletivo, ucsDet]);

  // ===== Totais =====
  const totalUcsEmpreendimento = useMemo(
    () => blocos.reduce((s, b) => s + (parseInt(b.qtdUCs) || 0), 0),
    [blocos],
  );
  const demandaTotalGeral = useMemo(() => {
    if (multiTorres)
      return blocos.reduce(
        (s, b) => s + num(b.demandaBloco) + num(b.demandaIncendio),
        0,
      );
    if (coletivo) return num(prev.demanda);
    return ucsDet.reduce((s, u) => s + (u.cargas?._demanda || 0), 0);
  }, [multiTorres, blocos, coletivo, prev.demanda, ucsDet]);

  const coordObrigatoria =
    obra.localizacao === "Rural" && obra.distMenor30 === "Não";
  const coordPreenchida = !!obra.coordenada;

  // ===== ABAS (barra vertical) — UCs vem ANTES de Cargas =====
  const abas = [
    { k: "orient", l: "Orientações" },
    { k: "tipo", l: "Tipo de Atendimento" },
    { k: "prop", l: "Proprietário" },
    { k: "corr", l: "Correspondência" },
    { k: "obra", l: "Dados da Obra" },
  ];
  if (multiTorres) {
    abas.push({ k: "blocos", l: "Torres / Blocos" });
  } else {
    abas.push({ k: "ucs", l: "Unidades Consumidoras" });
    abas.push({
      k: "cargas",
      l: coletivo ? "Previsão de Carga" : "Cargas das UCs",
    });
  }
  if (!coletivo) abas.push({ k: "gerador", l: "Gerador de Emergência" });
  abas.push(
    { k: "obs", l: "Observações" },
    { k: "revisar", l: "Prévia & PDF" },
  );

  const idx = abas.findIndex((a) => a.k === aba);
  const irProx = () => setAba(abas[Math.min(idx + 1, abas.length - 1)].k);
  const irAnt = () => setAba(abas[Math.max(idx - 1, 0)].k);

  // Se a aba ativa deixou de existir (mudança de modo), volta para "tipo"
  useEffect(() => {
    if (idx === -1) setAba("tipo");
  }, [idx]);

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
        multiTorres
          ? "Empreendimento com Múltiplas Torres ou Blocos"
          : coletivo
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
    const tabela = (headers, widths, rows) => {
      checkSpace(6);
      doc.setFillColor(215, 218, 226);
      doc.rect(MG, cy, CW, 5.5, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.6);
      doc.setTextColor(90, 96, 115);
      let x = MG + 2;
      headers.forEach((h, i) => {
        doc.text(h, x, cy + 3.8);
        x += widths[i];
      });
      cy += 5.5;
      let ri = 0;
      rows.forEach((row) => {
        checkSpace(5);
        doc.setFillColor(
          ri % 2 ? 247 : 255,
          ri % 2 ? 248 : 255,
          ri % 2 ? 251 : 255,
        );
        doc.rect(MG, cy, CW, 5, "F");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);
        doc.setTextColor(30, 32, 42);
        let xx = MG + 2;
        row.forEach((cell, i) => {
          doc.text(
            doc.splitTextToSize(String(cell ?? "—"), widths[i] - 2)[0] || "—",
            xx,
            cy + 3.5,
          );
          xx += widths[i];
        });
        ri++;
        cy += 5;
      });
    };

    drawTopBar();

    sec("TIPO DE ATENDIMENTO");
    fullLine(
      "Modalidade",
      multiTorres
        ? "Empreendimento com Múltiplas Torres ou Blocos"
        : coletivo
          ? "Coletivo - Agrupamento com Proteção Geral (APR Web)"
          : "Individual / até 3 caixas sem proteção geral",
    );
    const tipoPairs = [
      ["Possui disjuntor geral?", atend.disjGeral],
      [
        "Nº de unidades consumidoras",
        multiTorres ? totalUcsEmpreendimento : atend.nUCs,
      ],
    ];
    if (coletivo)
      tipoPairs.push(
        ["Solicitação", atend.solicitacao],
        ["Escopo do atendimento", atend.escopo],
      );
    kvPairs(tipoPairs);
    if (coletivo && !multiTorres && atend.disjuntorGeral)
      fullLine("Disjuntor geral", atend.disjuntorGeral);
    cy += 2;

    sec("1.  DADOS DO PROPRIETÁRIO");
    const propPairs = [
      ["Nome Completo / Razão Social", prop.nome],
      ["CPF/CNPJ", prop.cpfCnpj],
      ["E-mail", prop.email],
      ["Celular", prop.celular],
      ["Telefone Fixo", prop.fixo],
      ["Telefone do Proprietário", prop.telProp],
    ];
    if (pessoaFisica) {
      propPairs.push(
        ["RG/RNE/RANI", prop.rg],
        ["Data Nasc.", prop.nasc],
        ["Filiação", prop.filiacao],
        ["Laudo médico", prop.laudoMedico],
        ["NIS Tarifa Social", prop.nis === "Sim" ? prop.numNis : "Não"],
      );
    }
    propPairs.push(["", ""]);
    kvPairs(propPairs);
    cy += 2;

    sec("2.  CORRESPONDÊNCIA E FATURA");
    kvPairs([
      ["Receber fatura por e-mail", corr.receberEmail],
      ["Dia de vencimento", corr.vencimento ? "Dia " + corr.vencimento : ""],
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

    if (multiTorres) {
      sec("4.  EMPREENDIMENTO COM MÚLTIPLAS TORRES OU BLOCOS");
      kvPairs([
        ["Atendimento a", atend.atendA],
        ["Nº de blocos/torres", blocos.length],
        ["Total de UCs do empreendimento", totalUcsEmpreendimento],
        ["", ""],
      ]);
      tabela(
        [
          "Bloco",
          "Disjuntor Geral",
          "Dem. Bloco (kVA)",
          "Qtd UCs",
          "Disj. Cond./Incêndio",
          "Dem. Cond. (kVA)",
        ],
        [16, 38, 28, 18, 46, 36],
        blocos.map((b) => [
          b.nome,
          b.disjGeral,
          b.demandaBloco,
          b.qtdUCs,
          b.disjIncendio,
          b.demandaIncendio,
        ]),
      );
      cy += 2;
      totRow(
        "DEMANDA TOTAL DO EMPREENDIMENTO",
        `${fmt2(demandaTotalGeral)} kVA`,
      );
      cy += 2;
      // Detalhamento das UCs de cada torre/bloco
      blocos.forEach((b, bi) => {
        const ucs = b.ucs || [];
        if (!ucs.length) return;
        sec(
          `4.${bi + 1}  ${atend.atendA.toUpperCase()} ${b.nome || bi + 1} — UNIDADES CONSUMIDORAS`,
        );
        tabela(
          [
            "UC",
            "Complemento",
            "Nº Predial",
            "Solicitação",
            "Atividade",
            "Instalação",
            "Disjuntor",
          ],
          [26, 24, 22, 32, 24, 24, 30],
          ucs.map((u) => [
            u.identificacao,
            u.complemento,
            u.nPredial,
            u.solicitacao,
            u.atividade,
            u.solicitacao !== "Conexão Nova" ? u.instalacao : "—",
            u.disjPara,
          ]),
        );
        cy += 2;
      });
    } else if (coletivo) {
      sec("4.  UNIDADES CONSUMIDORAS");
      ucBlocos.forEach((u, ui) => {
        checkSpace(6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(0, 70, 33);
        doc.text(`${u.identificacao || "UC " + (ui + 1)}`, MG + 1, cy + 4);
        cy += 6;
        const pares = [
          ["Nº Predial", u.nPredial],
          ["Complemento", u.complemento],
          ["Caixa", u.caixa],
          ["Solicitação", u.solicitacao],
          ["Mudança de local", u.mudancaLocal],
          ["Atividade principal", u.atividade],
          ["Ramo de atividade", u.ramo],
        ];
        if (u.solicitacao !== "Conexão Nova") {
          pares.push(["Instalação", u.instalacao]);
          pares.push(["Disjuntor De", u.disjDe]);
        }
        pares.push(["Disjuntor Para", u.disjPara]);
        kvPairs(pares);
        cy += 1;
      });
      sec("5.  PREVISÃO DE CARGA");
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
      if (atend.disjuntorGeral) {
        sec("6.  DISJUNTOR GERAL");
        fullLine("Disjuntor geral do agrupamento", atend.disjuntorGeral);
        cy += 2;
      }
    } else {
      // INDIVIDUAL: identificação + cargas detalhadas POR UC
      ucsDet.forEach((u, ui) => {
        sec(`4.${ui + 1}  UNIDADE CONSUMIDORA ${ui + 1}`);
        const pares = [
          ["Solicitação", u.solicitacao],
          ["Atividade principal", u.atividade],
          ["Ramo de atividade", u.ramo],
          ["Nº Predial", u.nPredial],
          ["Complemento", u.complemento],
          ["Caixa / Identificação", u.caixa],
        ];
        if (u.solicitacao !== "Conexão Nova")
          pares.push(
            ["Nº Instalação", u.instalacao],
            ["Mudança de local", u.mudancaLocal],
            ["Disjuntor De", u.disjDe],
          );
        pares.push(["Disjuntor Para", u.disjPara || u.disjEscolhido]);
        kvPairs(pares);
        const qtds = u.cargas?.qtds || [];
        const itens = CAT.map((c, i) => ({ ...c, q: qtds[i] || 0 })).filter(
          (x) => x.q > 0,
        );
        if (itens.length) {
          tabela(
            ["Equipamento", "Pot. (W)", "Qtd", "Total (W)"],
            [96, 30, 18, 38],
            itens.map((it) => [it.n, fmtW(it.w), it.q, fmtW(it.q * it.w)]),
          );
        }
        (u.cargas?.mots || [])
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
          `Carga ${fmt2(u.cargas?._cargaKw || 0)} kW  |  Demanda`,
          `${fmt2(u.cargas?._demanda || 0)} kVA`,
        );
        if (u.cargas?._disjuntores?.length)
          fullLine(
            "Disjuntor sugerido (ND-5.1)",
            u.cargas._disjuntores.join("  ·  "),
          );
        if (u.disjEscolhido) fullLine("Disjuntor escolhido", u.disjEscolhido);
        cy += 2;
      });
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
    doc.save(
      `CEMIG_${multiTorres ? "torres" : coletivo ? "coletivo" : "individual"}_${nomeArq}.pdf`,
    );
  }, [
    multiTorres,
    coletivo,
    atend,
    prop,
    corr,
    obra,
    prev,
    prevTotalKw,
    ucsDet,
    ucBlocos,
    blocos,
    totalUcsEmpreendimento,
    gerador,
    obs,
    demandaTotalGeral,
  ]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div>
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
              APR Web
            </a>
          </div>
        </div>
      </div>

      <div className="form-header">
        <h1>
          Formulário de Orçamento de Conexão / Alteração de Carga em Baixa
          Tensão
        </h1>
        <p>
          Preenchimento digital unificado para solicitações em BT, conforme as
          normas CEMIG ND-5.1 / ND-5.2 e a REN ANEEL nº 1.000/2021.
        </p>
        <span className="flow-badge">
          {multiTorres
            ? "Múltiplas Torres / Blocos"
            : coletivo
              ? "Coletivo — Proteção Geral"
              : "Individual / até 3 caixas"}{" "}
          · Demanda {fmt2(demandaTotalGeral)} kVA
        </span>
      </div>

      <div className="layout">
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
                {ORIENTACOES.geral.titulo}
              </div>
              <ul className="orient-list">
                {ORIENTACOES.geral.itens.map((it, i) => (
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

          {/* ===== TIPO DE ATENDIMENTO ===== */}
          {aba === "tipo" && (
            <Card
              eyebrow="Etapa 1"
              title="Tipo de Atendimento"
              sub="O tipo de formulário é definido pela presença ou não de disjuntor geral. Os campos seguintes se adaptam à sua escolha."
            >
              <div className="grid grid-2 divider">
                <Field label="Solicitação" req>
                  <Sel
                    value={atend.solicitacao}
                    onChange={(e) =>
                      setAtend({ ...atend, solicitacao: e.target.value })
                    }
                  >
                    {SOLICITACOES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Sel>
                </Field>
                <Field
                  label="Escopo do Atendimento"
                  req
                  hint="As opções dependem da solicitação escolhida."
                >
                  <Sel
                    value={atend.escopo}
                    onChange={(e) =>
                      setAtend({ ...atend, escopo: e.target.value })
                    }
                  >
                    {(ESCOPOS[atend.solicitacao] || []).map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </Sel>
                </Field>
                {multiTorres && (
                  <React.Fragment>
                    <Field label="Atendimento a">
                      <Toggle
                        value={atend.atendA}
                        onChange={(v) => setAtend({ ...atend, atendA: v })}
                        options={[
                          { v: "Bloco", l: "Bloco" },
                          { v: "Torre", l: "Torre" },
                        ]}
                      />
                    </Field>
                    <Field
                      label="Nº de Blocos / Torres"
                      req
                      hint="Cada bloco terá disjuntor geral próprio e disjuntor de combate a incêndio."
                    >
                      <Inp
                        type="number"
                        value={atend.nBlocos}
                        onChange={(e) =>
                          setAtend({
                            ...atend,
                            nBlocos: Math.max(1, parseInt(e.target.value)),
                          })
                        }
                      />
                    </Field>
                  </React.Fragment>
                )}
              </div>

              <div className="grid grid-2">
                <Field label="Possui disjuntor geral (proteção geral)?" req>
                  <Toggle
                    value={atend.disjGeral}
                    onChange={(v) => setAtend({ ...atend, disjGeral: v })}
                    options={[
                      { v: "Não", l: "Não" },
                      { v: "Sim", l: "Sim" },
                    ]}
                  />
                </Field>
                {!multiTorres && (
                  <Field
                    label="Nº de Unidades Consumidoras"
                    req
                    hint={
                      coletivo
                        ? "Será gerado um bloco de identificação para cada UC."
                        : "Individual: até 3 caixas. Cada UC terá identificação e detalhamento de cargas."
                    }
                  >
                    <Inp
                      type="number"
                      value={atend.nUCs}
                      onChange={(e) =>
                        setAtend({
                          ...atend,
                          nUCs: Math.max(1, parseInt(e.target.value)),
                          disjGeral:
                            parseInt(e.target.value) > 3 ? "Sim" : "Não",
                        })
                      }
                      options={[
                        { v: true, l: "Sim" },
                        { v: false, l: "Não" },
                      ]}
                    />
                  </Field>
                )}
              </div>

              <div className="grid grid-2 divider">
                <Field label="Há múltiplas unidades consumidoras com proteção acima de 63 A?">
                  <Toggle
                    value={atend.biAcima63}
                    onChange={(v) =>
                      setAtend({
                        ...atend,
                        biAcima63: v,
                        triAcima63: v,
                        disjGeral: v ? "Sim" : "Não", // converte booleano para string
                      })
                    }
                    options={[
                      { v: true, l: "Sim" },
                      { v: false, l: "Não" },
                    ]}
                  />
                </Field>
              </div>

              {disjGeralObrigatorio && !multiTorres && (
                <div className="geral-box">
                  <Field
                    label="Disjuntor geral do agrupamento"
                    req
                    hint={`Obrigatório quando houver mais de três unidades consumidoras mono ou bipolares com proteção superior a 63 A, ou quando existirem duas ou mais unidades consumidoras com disjuntor trifásico. Opções acima da maior faixa das UCs (${maiorCorrenteUC || "—"} A).`}
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
                      liberar as opções de disjuntor geral.
                    </div>
                  )}
                </div>
              )}

              <div
                className={"alert " + (coletivo ? "alert-ok" : "alert-info")}
                style={{ marginTop: 16 }}
              >
                {multiTorres
                  ? "Atendimento caracterizado como empreendimento com 'Múltiplas Torres ou Blocos'."
                  : coletivo
                    ? "Atendimento caracterizado como 'Coletivo'."
                    : "Atendimento caracterizado como 'Individual'."}
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
                <Field
                  label="CPF / CNPJ"
                  req
                  hint={
                    docInfo.valido === false
                      ? `${docInfo.tipo} inválido — verifique os dígitos.`
                      : docInfo.valido === true
                        ? `${docInfo.tipo} válido.`
                        : "Digite CPF (pessoa física) ou CNPJ (pessoa jurídica)."
                  }
                >
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <input
                      value={prop.cpfCnpj || ""}
                      onChange={(e) => {
                        const m = mascararCpfCnpj(e.target.value);
                        setProp({ ...prop, cpfCnpj: m });
                        if (ehCNPJ(m)) buscarCNPJ(m);
                        else setCnpjStatus("");
                      }}
                      placeholder="000.000.000-00"
                      style={{
                        borderColor:
                          docInfo.valido === false
                            ? "var(--vermelho)"
                            : undefined,
                      }}
                    />
                    {cnpjStatus === "buscando" && (
                      <span className="spinner"></span>
                    )}
                    {cnpjStatus === "ok" && <Badge>dados preenchidos</Badge>}
                    {cnpjStatus === "erro" && (
                      <span style={{ color: "var(--vermelho)", fontSize: 12 }}>
                        CNPJ não encontrado
                      </span>
                    )}
                  </div>
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
                {pessoaFisica && (
                  <Field label="Filiação (Mãe ou Pai) **">
                    <Inp
                      value={prop.filiacao}
                      onChange={(e) =>
                        setProp({ ...prop, filiacao: e.target.value })
                      }
                    />
                  </Field>
                )}
                {pessoaFisica && (
                  <Field label="RG / RNE / RANI **">
                    <Inp
                      value={prop.rg}
                      onChange={(e) =>
                        setProp({ ...prop, rg: mascararRG(e.target.value) })
                      }
                    />
                  </Field>
                )}
                {pessoaFisica && (
                  <Field label="Data de Nascimento **">
                    <Inp
                      type="date"
                      value={prop.nasc}
                      onChange={(e) =>
                        setProp({ ...prop, nasc: e.target.value })
                      }
                    />
                  </Field>
                )}
                <Field label="Celular" req>
                  <Inp
                    value={prop.celular}
                    onChange={(e) =>
                      setProp({
                        ...prop,
                        celular: mascararCelular(e.target.value),
                      })
                    }
                  />
                </Field>
                <Field label="Telefone Fixo">
                  <Inp
                    value={prop.fixo}
                    onChange={(e) =>
                      setProp({ ...prop, fixo: mascararFixo(e.target.value) })
                    }
                  />
                </Field>
                <Field label="Telefone do Proprietário" req>
                  <Inp
                    value={prop.telProp}
                    onChange={(e) =>
                      setProp({
                        ...prop,
                        telProp: mascararTelefone(e.target.value),
                      })
                    }
                  />
                </Field>
                {pessoaFisica && (
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
                )}
                {pessoaFisica && (
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
                )}
                {pessoaFisica && prop.nis === "Sim" && (
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
                <Field label="Data de Vencimento da Fatura">
                  <Toggle
                    value={corr.vencimento}
                    onChange={(v) => setCorr({ ...corr, vencimento: v })}
                    options={DIAS_VENCIMENTO.map((d) => ({ v: d, l: d }))}
                  />
                </Field>
              </div>
              {corr.receberEmail === "Não" && (
                <div className="grid grid-2 divider">
                  <Field label="CEP" span={2}>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <div style={{ maxWidth: 180 }}>
                        <Inp
                          value={corr.cep}
                          onChange={(e) => {
                            const v = mascararCEP(e.target.value);
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
                        <Badge>Endereço encontrado</Badge>
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
                  <Field label="CEP" req span={2}>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <div style={{ maxWidth: 180 }}>
                        <Inp
                          value={obra.cep}
                          onChange={(e) => {
                            const v = mascararCEP(e.target.value);
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
                        <Badge>Endereço encontrado</Badge>
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

          {/* ===== TORRES / BLOCOS (múltiplas torres, preenchimento em massa) ===== */}
          {aba === "blocos" && multiTorres && (
            <div>
              <Card
                eyebrow="Empreendimento"
                title="Atendimento a Empreendimento com Múltiplas Torres ou Blocos"
                sub={`Cada ${atend.atendA.toLowerCase()} pode ter seu disjuntor geral e seu disjuntor de combate a incêndio. Preencha o primeiro e use "Replicar" para preenchimento em massa.`}
              >
                <div className="kpi-row">
                  <div className="kpi">
                    <div className="kpi-label">Atendimento a</div>
                    <div className="kpi-value" style={{ fontSize: 15 }}>
                      {atend.atendA}
                    </div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-label">
                      Total de UCs do empreendimento
                    </div>
                    <div className="kpi-value">{totalUcsEmpreendimento}</div>
                  </div>
                  <div className="kpi dark">
                    <div className="kpi-label">
                      Demanda total do empreendimento
                    </div>
                    <div className="kpi-value" style={{ fontSize: 18 }}>
                      {fmt2(demandaTotalGeral)} kVA
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "flex-end",
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <Field
                    label={`Nº de ${atend.atendA === "Bloco" ? "Blocos" : "Torres"}`}
                  >
                    <div style={{ maxWidth: 120 }}>
                      <Inp
                        type="number"
                        value={atend.nBlocos}
                        onChange={(e) =>
                          setAtend({
                            ...atend,
                            nBlocos: Math.max(1, parseInt(e.target.value) || 1),
                          })
                        }
                      />
                    </div>
                  </Field>
                  <Btn variant="ghost" onClick={replicarPrimeiro}>
                    ⧉ Replicar {atend.atendA} 1 para todos
                  </Btn>
                </div>

                {blocos.map((b, bi) => (
                  <div key={bi} className="uc-block">
                    <div className="uc-block-head">
                      <span className="uc-block-title">
                        {atend.atendA} {b.nome || bi + 1}
                      </span>
                      <Badge>
                        {bi + 1} de {blocos.length}
                      </Badge>
                    </div>
                    <div className="grid grid-3">
                      <Field
                        label={`Identificação do ${atend.atendA.toLowerCase()}`}
                      >
                        <Inp
                          value={b.nome}
                          onChange={(e) =>
                            setTorre(bi, { nome: e.target.value })
                          }
                          placeholder={`${bi + 1}`}
                        />
                      </Field>
                      <Field label="Disjuntor Geral" req>
                        <Sel
                          value={b.disjGeral}
                          onChange={(e) =>
                            setTorre(bi, { disjGeral: e.target.value })
                          }
                        >
                          <option value="">Selecione…</option>
                          {DISJ_GER.filter((d) => d.tipo === "tri").map((d) => (
                            <option key={d.fx} value={d.fx}>
                              {d.fx}
                            </option>
                          ))}
                        </Sel>
                      </Field>
                      <Field label={`Demanda do ${atend.atendA} (kVA)`} req>
                        <Inp
                          type="number"
                          value={b.demandaBloco}
                          onChange={(e) =>
                            setTorre(bi, { demandaBloco: e.target.value })
                          }
                          placeholder="Ex: 75"
                        />
                      </Field>
                      <Field label={`Qtd. de UCs por ${atend.atendA}`} req>
                        <Inp
                          type="number"
                          value={b.qtdUCs}
                          onChange={(e) =>
                            setTorre(bi, { qtdUCs: e.target.value })
                          }
                          placeholder="Ex: 48"
                        />
                      </Field>
                      <Field label="Disjuntor do Condomínio / Sist. Combate Incêndio">
                        <Sel
                          value={b.disjIncendio}
                          onChange={(e) =>
                            setTorre(bi, { disjIncendio: e.target.value })
                          }
                        >
                          <option value="">Selecione…</option>
                          {DISJ_CN.map((d) => (
                            <option key={d.fx} value={d.fx}>
                              {d.fx}
                            </option>
                          ))}
                        </Sel>
                      </Field>
                      <Field label="Demanda Condomínio / Combate Incêndio (kVA)">
                        <Inp
                          type="number"
                          value={b.demandaIncendio}
                          onChange={(e) =>
                            setTorre(bi, { demandaIncendio: e.target.value })
                          }
                          placeholder="Ex: 15"
                        />
                      </Field>
                    </div>

                    {/* UCs da torre/bloco — preenchimento em massa */}
                    {(b.ucs || []).length > 0 && (
                      <div className="uc-torre-wrap">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            margin: "4px 0 10px",
                            flexWrap: "wrap",
                            gap: 8,
                          }}
                        >
                          <span className="subbox-title">
                            Unidades consumidoras do{" "}
                            {atend.atendA.toLowerCase()} ({b.ucs.length})
                          </span>
                          {b.ucs.length > 1 && (
                            <Btn
                              variant="ghost"
                              onClick={() => replicarUC1Torre(bi)}
                            >
                              ⧉ Replicar UC 1 para todas
                            </Btn>
                          )}
                        </div>
                        {b.ucs.map((u, ui) => (
                          <div key={ui} className="uc-mini">
                            <div className="uc-mini-head">
                              UC {ui + 1}
                              {ui === 0 && b.ucs.length > 1 && (
                                <span className="uc-mini-tag">
                                  modelo p/ replicar
                                </span>
                              )}
                            </div>
                            <div className="grid grid-3">
                              <Field label="Identificação">
                                <Inp
                                  value={u.identificacao}
                                  onChange={(e) =>
                                    setUcTorre(bi, ui, {
                                      identificacao: e.target.value,
                                    })
                                  }
                                />
                              </Field>
                              <Field label="Complemento" req={b.ucs.length > 1}>
                                <Inp
                                  value={u.complemento}
                                  onChange={(e) =>
                                    setUcTorre(bi, ui, {
                                      complemento: e.target.value,
                                    })
                                  }
                                  placeholder="Ex: 101"
                                />
                              </Field>
                              <Field label="Nº Predial">
                                <Inp
                                  value={u.nPredial}
                                  onChange={(e) =>
                                    setUcTorre(bi, ui, {
                                      nPredial: e.target.value,
                                    })
                                  }
                                />
                              </Field>
                              <Field label="Solicitação" req>
                                <Sel
                                  value={u.solicitacao}
                                  onChange={(e) =>
                                    setUcTorre(bi, ui, {
                                      solicitacao: e.target.value,
                                    })
                                  }
                                >
                                  <option>Conexão Nova</option>
                                  <option>Alteração de Carga</option>
                                  <option>Caixa Existente sem Alteração</option>
                                </Sel>
                              </Field>
                              <Field label="Atividade" req>
                                <Sel
                                  value={u.atividade}
                                  onChange={(e) =>
                                    setUcTorre(bi, ui, {
                                      atividade: e.target.value,
                                    })
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
                                    setUcTorre(bi, ui, { ramo: e.target.value })
                                  }
                                  placeholder={
                                    u.atividade === "Residencial"
                                      ? "—"
                                      : "Obrigatório"
                                  }
                                />
                              </Field>
                              {/* Instalação / UC somente se NÃO for conexão nova */}
                              {u.solicitacao !== "Conexão Nova" && (
                                <Field label="Instalação / UC" req>
                                  <Inp
                                    value={u.instalacao}
                                    onChange={(e) =>
                                      setUcTorre(bi, ui, {
                                        instalacao: e.target.value,
                                      })
                                    }
                                    placeholder="Nº instalação existente"
                                  />
                                </Field>
                              )}
                              <Field label="Disjuntor da UC">
                                <Sel
                                  value={u.disjPara}
                                  onChange={(e) =>
                                    setUcTorre(bi, ui, {
                                      disjPara: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Selecione…</option>
                                  {DISJ.map((d) => (
                                    <option key={d.fx} value={d.fx}>
                                      {d.fx}
                                    </option>
                                  ))}
                                </Sel>
                              </Field>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {demandaTotalGeral > 304 && (
                  <div className="alert alert-info" style={{ marginTop: 10 }}>
                    Demanda total acima de 304 kVA: o atendimento fica
                    condicionado à apresentação do projeto elétrico com ART/TRT.
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* ===== UNIDADES CONSUMIDORAS — COLETIVO (identificação) ===== */}
          {aba === "ucs" && coletivo && !multiTorres && (
            <div>
              <Card
                eyebrow="Identificação"
                title={`Unidades Consumidoras (${ucBlocos.length})`}
                sub="Preencha os dados de identificação de cada UC. Campos com valor padrão já vêm preenchidos. Em Conexão Nova não há disjuntor 'De' (a instalação ainda não existe)."
              >
                {ucBlocos.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: 12,
                    }}
                  >
                    <Btn variant="ghost" onClick={replicarUC1Coletivo}>
                      ⧉ Replicar UC 1 para todas
                    </Btn>
                  </div>
                )}
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
                            u.atividade === "Residencial" ? "—" : "Obrigatório"
                          }
                        />
                      </Field>
                      {u.solicitacao !== "Conexão Nova" && (
                        <Field label="Instalação" req>
                          <Inp
                            value={u.instalacao}
                            onChange={(e) =>
                              setBloco(ui, { instalacao: e.target.value })
                            }
                            placeholder="Nº instalação existente"
                          />
                        </Field>
                      )}
                      <Field label="Disjuntor" span={3}>
                        <div className="disj-pair">
                          {u.solicitacao !== "Conexão Nova" && (
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
                          )}
                          <div>
                            <Sel
                              value={u.disjPara}
                              onChange={(e) =>
                                setBloco(ui, { disjPara: e.target.value })
                              }
                            >
                              <option value="">
                                {u.solicitacao === "Conexão Nova"
                                  ? "Disjuntor solicitado…"
                                  : "Para: (solicitado)…"}
                              </option>
                              {DISJ_CN.map((d) => (
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
                  sub={`Obrigatório quando há UC bi/trifásica com proteção acima de 60/63 A. Faixas disponíveis: acima de ${maiorCorrenteUC || "—"} A.`}
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

          {/* ===== UNIDADES CONSUMIDORAS — INDIVIDUAL (identificação de cada UC) ===== */}
          {aba === "ucs" && !coletivo && (
            <div>
              <Card
                eyebrow="Identificação"
                title={`Unidades Consumidoras (${ucsDet.length})`}
                sub="Dados de identificação de cada unidade consumidora. O detalhamento das cargas é feito na próxima etapa. Em Conexão Nova não há disjuntor 'De' nem instalação."
              >
                {ucsDet.map((u, ui) => (
                  <div key={ui} className="uc-block">
                    <div className="uc-block-head">
                      <span className="uc-block-title">UC {ui + 1}</span>
                      <Badge>
                        {ui + 1} de {ucsDet.length}
                      </Badge>
                    </div>
                    <div className="grid grid-3">
                      <Field label="Tipo de solicitação" req>
                        <Sel
                          value={u.solicitacao}
                          onChange={(e) =>
                            setUcDet(ui, { solicitacao: e.target.value })
                          }
                        >
                          <option>Conexão Nova</option>
                          <option>Alteração de Carga</option>
                          <option>Caixa Existente sem Alteração</option>
                        </Sel>
                      </Field>
                      <Field label="Atividade principal" req>
                        <Sel
                          value={u.atividade}
                          onChange={(e) =>
                            setUcDet(ui, { atividade: e.target.value })
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
                            setUcDet(ui, { ramo: e.target.value })
                          }
                          placeholder={
                            u.atividade === "Residencial" ? "—" : "Obrigatório"
                          }
                        />
                      </Field>
                      <Field label="Nº Predial" req>
                        <Inp
                          value={u.nPredial}
                          onChange={(e) =>
                            setUcDet(ui, { nPredial: e.target.value })
                          }
                        />
                      </Field>
                      <Field label="Complemento" req={ucsDet.length > 1}>
                        <Inp
                          value={u.complemento}
                          onChange={(e) =>
                            setUcDet(ui, { complemento: e.target.value })
                          }
                          placeholder="Ex: Casa 1"
                        />
                      </Field>
                      <Field label="Caixa / Identificação">
                        <Inp
                          value={u.caixa}
                          onChange={(e) =>
                            setUcDet(ui, { caixa: e.target.value })
                          }
                        />
                      </Field>
                      {u.solicitacao !== "Conexão Nova" && (
                        <React.Fragment>
                          <Field label="Nº Instalação / Medidor" req>
                            <Inp
                              value={u.instalacao}
                              onChange={(e) =>
                                setUcDet(ui, { instalacao: e.target.value })
                              }
                            />
                          </Field>
                          <Field label="Mudança de local">
                            <Toggle
                              value={u.mudancaLocal}
                              onChange={(v) =>
                                setUcDet(ui, { mudancaLocal: v })
                              }
                              options={[
                                { v: "Sim", l: "Sim" },
                                { v: "Não", l: "Não" },
                              ]}
                            />
                          </Field>
                          <Field label="Disjuntor De (atual)">
                            <Sel
                              value={u.disjDe}
                              onChange={(e) =>
                                setUcDet(ui, { disjDe: e.target.value })
                              }
                            >
                              <option value="">Selecione…</option>
                              {DISJ.map((d) => (
                                <option key={d.fx} value={d.fx}>
                                  {d.fx}
                                </option>
                              ))}
                            </Sel>
                          </Field>
                        </React.Fragment>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
              {ucsDet.length > 1 && (
                <div
                  className={
                    "alert " +
                    (validacaoDisjuntores.ok ? "alert-ok" : "alert-warn")
                  }
                >
                  <b>
                    Regra de disjuntores (múltiplas UCs sem proteção geral):
                  </b>{" "}
                  no máximo 1 tripolar de 63 A e/ou até 2 mono/bifásicos de 63
                  A. {validacaoDisjuntores.ok ? "✔ " : "⚠ "}
                  {validacaoDisjuntores.msg}
                </div>
              )}
            </div>
          )}

          {/* ===== CARGAS — COLETIVO: previsão digitada ===== */}
          {aba === "cargas" && coletivo && !multiTorres && (
            <Card
              eyebrow="Carga do agrupamento"
              title="Previsão de Carga"
              sub="Informe a previsão de carga instalada por grupo (kW) e a demanda total prevista (kVA). Valores digitados — sem detalhamento por equipamento."
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
                <Field label="Descrição (Outros)">
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

          {/* ===== CARGAS — INDIVIDUAL: calculadora POR UC ===== */}
          {aba === "cargas" && !coletivo && (
            <div>
              {ucsDet.length > 1 && (
                <div
                  className={
                    "alert " +
                    (validacaoDisjuntores.ok ? "alert-ok" : "alert-warn")
                  }
                >
                  <b>Regra de disjuntores:</b> máx. 1 tripolar 63 A e/ou 2
                  mono/bifásicos 63 A. {validacaoDisjuntores.ok ? "✔ " : "⚠ "}
                  {validacaoDisjuntores.msg}
                </div>
              )}
              {ucsDet.map((u, ui) => (
                <Card
                  key={ui}
                  eyebrow={`UC ${ui + 1} de ${ucsDet.length}`}
                  title={`Cargas da Unidade Consumidora ${ui + 1}`}
                  sub="Detalhe os equipamentos. A demanda e o disjuntor são calculados automaticamente (ND-5.1)."
                >
                  <CalcDemanda
                    data={u.cargas}
                    onChange={(c) => setUcDet(ui, { cargas: c })}
                    redeMono={redeMono}
                  />
                  {u.cargas?._disjuntores?.length > 0 && (
                    <div style={{ marginTop: 12 }}>
                      <Field label={`Disjuntor escolhido para a UC ${ui + 1}`}>
                        <Sel
                          value={u.disjEscolhido || u.cargas._disjuntores[0]}
                          onChange={(e) =>
                            setUcDet(ui, { disjEscolhido: e.target.value })
                          }
                        >
                          {u.cargas._disjuntores.map((dj) => (
                            <option key={dj} value={dj}>
                              {dj}
                            </option>
                          ))}
                        </Sel>
                      </Field>
                    </div>
                  )}
                </Card>
              ))}
            </div>
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
                sub="Confira os dados. Se algo estiver incorreto, volte às etapas anteriores pela barra lateral."
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
                      {multiTorres
                        ? totalUcsEmpreendimento
                        : coletivo
                          ? ucBlocos.length
                          : ucsDet.length}
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
                      {multiTorres
                        ? `Múltiplas Torres/Blocos · ${blocos.length} ${atend.atendA.toLowerCase()}(s)`
                        : coletivo
                          ? "Coletivo — Agrupamento com Proteção Geral (APR Web)"
                          : "Individual / até 3 caixas sem proteção geral"}
                      {coletivo
                        ? ` · ${atend.solicitacao} · ${atend.escopo}`
                        : ""}
                      {!multiTorres && atend.disjuntorGeral
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
                {multiTorres ? (
                  <div className="preview-block">
                    <h4>Torres / Blocos</h4>
                    {blocos.map((b, bi) => (
                      <div
                        key={bi}
                        className="preview-item"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="v">
                          {atend.atendA} {b.nome || bi + 1} · {b.qtdUCs || 0}{" "}
                          UCs · Geral: {b.disjGeral || "—"} · Incêndio:{" "}
                          {b.disjIncendio || "—"}
                        </span>
                        <span
                          style={{ color: "var(--verde)", fontWeight: 700 }}
                        >
                          {fmt2(num(b.demandaBloco) + num(b.demandaIncendio))}{" "}
                          kVA
                        </span>
                      </div>
                    ))}
                  </div>
                ) : coletivo ? (
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
                    <h4>Unidades Consumidoras</h4>
                    {ucsDet.map((u, ui) => (
                      <div
                        key={ui}
                        className="preview-item"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span className="v">
                          UC {ui + 1} · {u.atividade} · {u.solicitacao}{" "}
                          {u.complemento ? `· ${u.complemento}` : ""}
                        </span>
                        <span
                          style={{ color: "var(--verde)", fontWeight: 700 }}
                        >
                          {fmt2(u.cargas?._demanda || 0)} kVA ·{" "}
                          {u.disjEscolhido ||
                            (u.cargas?._disjuntores || [])[0] ||
                            "—"}
                        </span>
                      </div>
                    ))}
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
            <Btn variant="ghost" onClick={irAnt} disabled={idx <= 0}>
              ← Voltar
            </Btn>
            <span className="nav-step-info">
              Etapa {Math.max(idx, 0) + 1} de {abas.length}
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
