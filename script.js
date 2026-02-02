const sheetURL = "PASTE_LINK_CSV_REKAP_SKU_HARIAN";

fetch(sheetURL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.split("\n").slice(1);

    const data = {};
    const dates = new Set();
    let totalPCS = 0;

    rows.forEach(row => {
      const [tanggal, sku, pcs] = row.split(",");
      if (!tanggal || !sku) return;

      if (!data[sku]) data[sku] = {};
      data[sku][tanggal] = parseInt(pcs);
      dates.add(tanggal);
      totalPCS += parseInt(pcs);
    });

    const labels = Array.from(dates).sort();

    const datasets = Object.keys(data).map(sku => ({
      label: sku,
      data: labels.map(t => data[sku][t] || 0),
      borderWidth: 2,
      tension: 0.3
    }));

    // KPI
    document.getElementById("totalPcs").innerText = totalPCS;

    const skuTotal = Object.entries(data).map(([sku, vals]) => ({
      sku,
      total: Object.values(vals).reduce((a, b) => a + b, 0)
    }));

    skuTotal.sort((a, b) => b.total - a.total);
    document.getElementById("topSku").innerText = skuTotal[0]?.sku || "-";

    // Chart
    new Chart(document.getElementById("skuChart"), {
      type: "line",
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" }
        }
      }
    });
  });
