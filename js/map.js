/* ============================================================
   CEMIG — Localização da obra (Leaflet + OpenStreetMap)
   Toda busca é feita pela COORDENADA (campos lat/long).
   - Endereço (urbano) -> Nominatim -> preenche lat/long automaticamente
   - "Mostrar no mapa" e auto-preenchimento disparam mapa + restrição juntos
   - Restrição ambiental via consultarRestricoes() (js/geo.js)
   Usa hooks globais (useState/useRef/useEffect), Btn e window.L / window.turf
   ============================================================ */
function LocalizacaoObra({ obra, setObra }) {
  const divRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const lastRef = useRef(""); // "lat,lng" da última execução (evita repetir)
  const [status, setStatus] = useState(""); // "", "geo", "restr" ou mensagem
  const [coords, setCoords] = useState(null);
  const [restr, setRestr] = useState(null);

  const rural = obra.localizacao === "Rural";
  const toNum = (s) => {
    const v = parseFloat(
      String(s == null ? "" : s)
        .replace(",", ".")
        .trim(),
    );
    return isNaN(v) ? null : v;
  };
  const nDig = (s) => (String(s || "").match(/\d/g) || []).length;

  // Inicializa o mapa uma única vez
  useEffect(() => {
    if (!window.L || !divRef.current || mapRef.current) return;
    const map = window.L.map(divRef.current).setView([-19.9167, -43.9345], 12);
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 200);
  }, []);

  // Coloca o marcador e consulta a restrição ambiental (os dois juntos)
  const executar = async (lat, lng, label) => {
    const map = mapRef.current;
    if (map) {
      map.setView([lat, lng], 17);
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
      else markerRef.current = window.L.marker([lat, lng]).addTo(map);
      if (label) markerRef.current.bindPopup(label);
      setTimeout(() => map.invalidateSize(), 100);
    }
    setCoords({ lat, lng, label });
    if (typeof consultarRestricoes !== "function") {
      setStatus("Módulo de restrição (geo.js) não carregado.");
      return;
    }
    setStatus("restr");
    try {
      const res = await consultarRestricoes(lat, lng);
      setRestr(res);
      setStatus("");
    } catch (e) {
      setStatus((e && e.message) || "Falha na consulta de restrições.");
    }
  };

  // Botão: mostrar a coordenada digitada no mapa (dispara mapa + restrição)
  const mostrar = () => {
    const lat = toNum(obra.lat);
    const lng = toNum(obra.lng);
    if (lat == null || lng == null) {
      setStatus("Informe latitude e longitude válidas.");
      return;
    }
    lastRef.current = lat + "," + lng;
    executar(lat, lng, "Coordenada informada");
  };

  // Botão (urbano): geocodifica o endereço e preenche os campos de coordenada
  const buscarPorEndereco = async () => {
    const endereco = [
      [obra.endereco, obra.num].filter(Boolean).join(", "),
      obra.bairro,
      obra.cidade,
      obra.estado,
      obra.cep,
      "Brasil",
    ]
      .filter(Boolean)
      .join(", ");
    if (!endereco.replace(/Brasil|,/g, "").trim()) {
      setStatus("Preencha o endereço para buscar a coordenada.");
      return;
    }
    setStatus("geo");
    try {
      const resp = await fetch(
        "https://nominatim.openstreetmap.org/search?format=json&limit=1&q=" +
          encodeURIComponent(endereco),
        { headers: { "Accept-Language": "pt-BR" } },
      );
      const data = await resp.json();
      if (!data || !data.length) {
        setStatus("Endereço não encontrado. Informe a coordenada manualmente.");
        return;
      }
      setStatus("");
      // Preenche os campos; o efeito de auto-disparo cuida do mapa + restrição
      setObra({
        ...obra,
        lat: String(parseFloat(data[0].lat)),
        lng: String(parseFloat(data[0].lon)),
      });
    } catch (e) {
      setStatus("Falha ao geocodificar o endereço.");
    }
  };

  // Auto-dispara quando lat e long estão completos (>=5 dígitos cada)
  useEffect(() => {
    const lat = toNum(obra.lat);
    const lng = toNum(obra.lng);
    if (lat == null || lng == null) return;
    if (nDig(obra.lat) < 5 || nDig(obra.lng) < 5) return;
    const key = lat + "," + lng;
    if (lastRef.current === key) return;
    const t = setTimeout(() => {
      lastRef.current = key;
      executar(lat, lng, "Coordenada informada");
    }, 600);
    return () => clearTimeout(t);
  }, [obra.lat, obra.lng]);

  // Extrai um nome legível das propriedades da feição (qual UC/área)
  const nomeFeicao = (props) => {
    if (!props) return null;
    const chave = Object.keys(props).find(
      (k) =>
        /nome|^nm_|name|denom|titulo|t_tulo|unidade|categoria/i.test(k) &&
        props[k] != null &&
        String(props[k]).trim() !== "",
    );
    return chave ? String(props[chave]) : null;
  };

  return (
    <div className="mapa-obra">
      <div className="mapa-actions">
        <Btn variant="ghost" onClick={mostrar}>
          📍 Mostrar coordenada no mapa
        </Btn>
        {!rural && (
          <Btn variant="ghost" onClick={buscarPorEndereco}>
            🔎 Buscar coordenada pelo endereço
          </Btn>
        )}
        {status === "geo" && (
          <span className="field-hint">Buscando coordenada…</span>
        )}
        {status === "restr" && (
          <span className="field-hint">Consultando restrições…</span>
        )}
        {status && status !== "geo" && status !== "restr" && (
          <span className="field-hint" style={{ color: "var(--vermelho)" }}>
            {status}
          </span>
        )}
        {coords && (
          <span className="field-hint">
            {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
          </span>
        )}
      </div>

      <div ref={divRef} className="mapa-canvas" />

      {restr && (
        <div className="restricao-result">
          <div
            className={
              "alert " +
              (restr.some((r) => r.dentro) ? "alert-warn" : "alert-ok")
            }
            style={{ margin: "10px 0" }}
          >
            {restr.some((r) => r.dentro)
              ? "⚠ O ponto intersecta ao menos uma restrição ambiental."
              : "Nenhuma restrição ambiental encontrada para o ponto."}
          </div>
          <div className="restricao-chips">
            {restr.map((r) => {
              const nome = r.dentro ? nomeFeicao(r.props) : null;
              return (
                <span
                  key={r.id}
                  className={
                    "chip " +
                    (r.erro ? "chip-err" : r.dentro ? "chip-on" : "chip-off")
                  }
                  title={r.typeName}
                >
                  {r.rotulo}:{" "}
                  {r.erro
                    ? r.erro
                    : r.dentro
                      ? "DENTRO" + (nome ? " — " + nome : "")
                      : "fora"}
                </span>
              );
            })}
          </div>
          {restr.some((r) => r.erro) && (
            <div className="field-hint" style={{ marginTop: 8 }}>
              Falhas geralmente são CORS ou nome de camada/endpoint incorreto.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
