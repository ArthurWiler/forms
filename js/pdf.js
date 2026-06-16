/* ============================================================
   CEMIG — Geração do PDF (jsPDF). Sem JSX — script clássico.
   Recebe um objeto de estado (S) e produz/baixa o PDF.
   Usa helpers globais: fmt2, num, prevKwUC, CAT (data.js/model.js).
   ============================================================ */
function gerarPdfDoc(S) {
  const {
    multiTorres,
    coletivo,
    atend,
    prop,
    corr,
    obra,
    prevTotalKw,
    demandaPrevTotal,
    trocaDisjGeral,
    hibrido,
    ucsDet,
    ucBlocos,
    blocos,
    totalUcsEmpreendimento,
    gerador,
    obs,
    demandaTotalGeral,
    logoPDF,
    pessoaFisica,
  } = S;
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
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("Formulário CEMIG - Orçamento de Conexão BT", MG, 8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
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
    // Logo Cemig (canto superior direito da barra), preservando proporção
    if (logoPDF) {
      const logoH = 10; // altura em mm — ajuste aqui se necessário
      const logoW = logoH * (logoPDF.w / logoPDF.h);
      doc.addImage(
        logoPDF.url,
        "PNG",
        PW - MG - logoW,
        (18 - logoH) / 2,
        logoW,
        logoH,
      );
    }
    cy = 24;
  };
  const footer = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(150, 150, 150);
    doc.text("", MG, PH - 7);
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
    doc.setFontSize(10);
    doc.setTextColor(0, 70, 33);
    doc.text(t, MG + 5, cy + 4.8);
    cy += 9;
  };
  const _vazio = (v) =>
    v === undefined ||
    v === null ||
    String(v).trim() === "" ||
    String(v).trim() === "—";
  const kvPairs = (pairs) => {
    const colW = CW / 2;
    const kept = (pairs || []).filter((p) => p && !_vazio(p[1]));
    for (let i = 0; i < kept.length; i += 2) {
      checkSpace(6);
      [kept[i], kept[i + 1]].forEach((p, ci) => {
        if (!p) return;
        const x = MG + ci * colW;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(30, 32, 42);
        const lbl = p[0] + ": ";
        doc.text(lbl, x + 1, cy + 4.5);
        const lw = doc.getTextWidth(lbl);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(
          doc.splitTextToSize(String(p[1]), Math.max(10, colW - 4 - lw))[0],
          x + 1 + lw,
          cy + 4.5,
        );
      });
      cy += 7;
    }
  };
  const fullLine = (label, val) => {
    if (_vazio(val)) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(30, 32, 42);
    const lbl = label + ": ";
    const lw = doc.getTextWidth(lbl);
    const lines = doc.splitTextToSize(String(val), Math.max(20, CW - 4 - lw));
    checkSpace(4 + lines.length * 4.2);
    doc.text(lbl, MG + 1, cy + 4.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(lines, MG + 1 + lw, cy + 4.5);
    cy += 2 + lines.length * 4.2;
  };
  const totRow = (label, val) => {
    checkSpace(8);
    doc.setFillColor(1, 136, 55);
    doc.rect(MG, cy, CW, 7.5, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
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
    doc.setFontSize(8);
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
      doc.setFontSize(8);
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
    ["Coordenadas", [obra.lat, obra.lng].filter(Boolean).join(", ")],
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
    totRow("DEMANDA TOTAL DO EMPREENDIMENTO", `${fmt2(demandaTotalGeral)} kVA`);
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
      cy += 1;
      tabela(
        [
          "UC",
          "Ilum.",
          "Tomada",
          "Chuveiro",
          "Ar",
          "Outros",
          "Carga (kW)",
          "Dem. (kVA)",
        ],
        [26, 18, 20, 22, 16, 18, 24, 24],
        ucs.map((u) => [
          u.identificacao,
          (u.prev || {}).ilum || "—",
          (u.prev || {}).tomada || "—",
          (u.prev || {}).chuveiro || "—",
          (u.prev || {}).ar || "—",
          (u.prev || {}).outros || "—",
          fmt2(prevKwUC(u)),
          (u.prev || {}).demanda || "—",
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
        ["Nº Predial", hibrido && u.nd === "5.1" ? u.nPredial : obra.num],
        ["Complemento", u.complemento],
        ["Caixa", u.caixa],
        ["Solicitação", u.solicitacao],
        ["Mudança de local", u.mudancaLocal],
        ["Atividade principal", u.atividade],
        ["Ramo de atividade", u.ramo],
      ];
      if (hibrido) pares.unshift(["Norma", `ND ${u.nd}`]);
      if (u.solicitacao !== "Conexão Nova") {
        pares.push(["Instalação", u.instalacao]);
        pares.push(["Disjuntor De", u.disjDe]);
      }
      pares.push(["Disjuntor Para", u.disjPara]);
      kvPairs(pares);
      cy += 1;
    });
    sec("5.  PREVISÃO DE CARGA POR UNIDADE CONSUMIDORA");
    tabela(
      [
        "Unidade",
        "Ilum.",
        "Tomada",
        "Chuveiro",
        "Ar Cond.",
        "Outros",
        "Carga (kW)",
        "Dem. (kVA)",
      ],
      [30, 20, 22, 24, 22, 20, 22, 22],
      ucBlocos.map((u) => [
        u.identificacao || "UC",
        (u.prev || {}).ilum || "—",
        (u.prev || {}).tomada || "—",
        (u.prev || {}).chuveiro || "—",
        (u.prev || {}).ar || "—",
        (u.prev || {}).outros || "—",
        fmt2(prevKwUC(u)),
        (u.prev || {}).demanda || "—",
      ]),
    );
    totRow(
      `Total ${fmt2(prevTotalKw)} kW  |  Demanda`,
      `${fmt2(demandaTotalGeral)} kVA`,
    );
    cy += 2;
    if (atend.disjuntorGeral || trocaDisjGeral) {
      sec("6.  DISJUNTOR GERAL");
      if (trocaDisjGeral) {
        kvPairs([
          ["Disjuntor geral existente", atend.disjGeralAtual],
          ["Disjuntor geral novo", atend.disjuntorGeral],
          ["Demanda atual (kVA)", atend.demandaAtual],
          ["Demanda futura (kVA)", fmt2(demandaPrevTotal)],
        ]);
      } else {
        fullLine("Disjuntor geral do agrupamento", atend.disjuntorGeral);
      }
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
        ["Nº Predial", obra.num],
        ["Complemento", u.complemento],
        ["Caixa / Identificação", u.caixa],
      ];
      if (u.solicitacao !== "Conexão Nova")
        pares.push(
          ["Nº Instalação", u.instalacao],
          ["Mudança de local", u.mudancaLocal],
        );
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
      // Disjuntores — informação consolidada em um único bloco
      if (u.solicitacao !== "Conexão Nova" && u.disjDe)
        fullLine("Disjuntor anterior (De)", u.disjDe);
      fullLine(
        "Disjuntor sugerido (ND-5.1)",
        (u.cargas?._disjuntores || []).join("  ·  ") || "—",
      );
      fullLine(
        "Disjuntor escolhido",
        u.disjEscolhido || (u.cargas?._disjuntores || [])[0] || "—",
      );
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
}
