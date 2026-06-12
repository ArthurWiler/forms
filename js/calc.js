/* ============================================================
   CEMIG — Funções de cálculo de demanda (ND-5.1 / Anexo B)
   D = a + b + c + d + e + f
   ============================================================ */

// Formatadores
const fmt2 = (v) =>
  v == null || isNaN(v)
    ? "0,00"
    : Number(v).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
const fmtW = (v) => (Number(v) || 0).toLocaleString("pt-BR");

// Parcela a) iluminação/tomadas — residencial (Tabela 10)
function calcA_res(kw) {
  if (kw <= 0) return { d: 0, f: 0 };
  const x = TABELA_10.find((r) => kw > r.min && kw <= r.max) || TABELA_10[10];
  return { d: kw * x.fator, f: x.fator };
}

// Parcela a) iluminação/tomadas — não-residencial (Tabela 11)
function calcA_nr(kva, ci) {
  if (kva <= 0 || ci < 0) return { d: 0, f: "-" };
  const c = TABELA_11[ci];
  if (!c) return { d: 0, f: "-" };
  if (c.lim === Infinity) return { d: kva * c.fp, f: c.fp };
  return {
    d: Math.min(kva, c.lim) * c.fp + Math.max(0, kva - c.lim) * c.fe,
    f: `${c.fp}/${c.fe}`,
  };
}

// Parcela b) — subgrupos b1..b5
function calcBsg(items, sg) {
  const tot = items.reduce((s, i) => s + i.q, 0);
  const kw = items.reduce((s, i) => s + i.q * i.w, 0) / 1000;
  if (!tot || kw <= 0) return { kw: 0, f: 0, d: 0 };
  if (sg === "b3") {
    const n = Math.min(tot, 12);
    const pm = kw / tot;
    const e = TABELA_12.find((x) => x.n === n) || TABELA_12[11];
    const f = pm <= 3.5 ? e.a : e.b;
    return { kw, f, d: kw * f };
  }
  const f = getFt13(tot);
  return { kw, f, d: kw * f };
}

// Seleção de disjuntores conforme demanda e tipo de rede
function selecionarDisjuntores(demanda, redeMono) {
  if (demanda <= 0) return [];
  const tipos = ["mono", "bi", "tri"];
  const result = [];
  for (const tp of tipos) {
    if (!redeMono && tp === "bi" && demanda > 16) continue;
    const cand = DISJ.filter((dj) => dj.tipo === tp && dj.d >= demanda);
    if (cand.length > 0) {
      cand.sort((a, b) => a.d - b.d);
      result.push(cand[0]);
    }
  }
  return result;
}

// Extrai a corrente (A) do rótulo do disjuntor (ex.: "Tripolar 63 A" -> 63)
function correnteDisj(fx) {
  if (!fx) return 0;
  const m = String(fx).match(/(\d+)(?:\/\d+)*\s*A/);
  return m ? Number(m[1]) : 0;
}

// Lista de disjuntores GERAIS com faixa estritamente MAIOR que a maior UC.
// Considera apenas tripolares (proteção geral de agrupamento é trifásica).
function disjuntoresGeraisAcima(maiorCorrenteUC) {
  return DISJ_GER.filter(
    (d) => d.tipo === "tri" && correnteDisj(d.fx) > maiorCorrenteUC,
  ).map((d) => d.fx);
}
