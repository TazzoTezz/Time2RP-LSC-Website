const parts = {
  performance: {
    'Engine Stock': 1000, 'Engine L1': 1500, 'Engine L2': 2500, 'Engine L3': 3500, 'Engine L4': 5000,
    'Transmission Stock': 1000, 'Transmission Street': 1500, 'Transmission Sport': 2500, 'Transmission Race': 5000,
    'Brakes Stock': 1000, 'Brakes Street': 1500, 'Brakes Sport': 2500, 'Brakes Race': 5000,
    'Suspension Stock': 1000, 'Suspension Lowered': 2000, 'Suspension Street': 3000, 'Suspension Sport': 4000, 'Suspension Comp.': 5000,
    'Turbo': 5000
  },
  cosmetics: {
    'License Plate': 500, 'Window Tint': 500, 'Horn': 500, 'Skirt': 500, 'Xenon Headlights': 500,
    'Neon Lights': 2000, 'Spoiler': 1000, 'Hood': 1000, 'Exhaust': 1000, 'Spray (all)': 1000, 'Car Wash': 100,
    'Adv. Lockpick': 5000, 'Anti-Theft': 10000, 'Wax': 1000, 'Wheels': 1000,
    'Interior Part': 500, 'Exterior Part': 500, 'Drift Tyres': 3000, 'Civ Repair': 500, 
    }
};

const selected = {};
function createTable(partList, containerId) {
  let html = `<table><tr><th>Part</th><th>Price</th><th>Count</th><th>Total</th></tr>`;
  for (const [part, price] of Object.entries(partList)) {
    const countOptions = containerId === 'performanceTable'
      ? Array.from({length:2},(_,i)=>`<option value='${i}'>${i}</option>`).join('')
      : Array.from({length:11},(_,i)=>`<option value='${i}'>${i}</option>`).join('');
    html += `<tr>
               <td>${part}</td>
               <td>$${price}</td>
               <td><select onchange="updateCount('${part}', ${price}, this.value)" style="text-align:right;">${countOptions}</select></td>
               <td id="total-${part}">$0</td>
             </tr>`;
  }
  html += '</table>';
  document.getElementById(containerId).innerHTML = html;
}

window.updateCount = function(name, price, count) {
  selected[name] = { count: parseInt(count), total: price * count };
  document.getElementById(`total-${name}`).innerText = `$${selected[name].total}`;
  updateTotals();
}

function updateTotals() {
  const performanceTotal = Object.keys(parts.performance).reduce((sum, name) => sum + (selected[name]?.total || 0), 0);
  const cosmeticTotal = Object.keys(parts.cosmetics).reduce((sum, name) => sum + (selected[name]?.total || 0), 0);
  const total = performanceTotal + cosmeticTotal;
  const calcCommissionFromPdEms = document.getElementById('calcCommission').checked;
  const totalParts = Object.keys(parts.performance).reduce((count, name) => count + (selected[name]?.count || 0), 0) +
                     Object.keys(parts.cosmetics).reduce((count, name) => count + (selected[name]?.count || 0), 0);

  const pdEmsPerformanceTotal = performanceTotal / 2;
  const pdEmsAntiTheftTotal = (selected['Anti-Theft']?.total || 0) / 2;
  const pdEmsTotal = pdEmsPerformanceTotal + pdEmsAntiTheftTotal + (cosmeticTotal - (selected['Anti-Theft']?.total || 0));

  document.getElementById('performanceTotal').innerText = performanceTotal;
  document.getElementById('performanceCount').innerText = Object.keys(parts.performance).reduce((count, name) => count + (selected[name]?.count || 0), 0);
  document.getElementById('cosmeticTotal').innerText = cosmeticTotal;
  document.getElementById('cosmeticCount').innerText = Object.keys(parts.cosmetics).reduce((count, name) => count + (selected[name]?.count || 0), 0);
  document.getElementById('total').innerText = total;
  document.getElementById('pdEmsPrice').innerText = Math.floor(pdEmsTotal);
  document.getElementById('commission').innerText = Math.floor((calcCommissionFromPdEms ? pdEmsTotal : total) * 0.15);
  document.getElementById('totalParts').innerText = totalParts;
}

window.resetAll = function() {
  Object.keys(selected).forEach(key => selected[key] = { count: 0, total: 0 });
  document.querySelectorAll('select').forEach(select => select.value = '0');
  document.getElementById('calcCommission').checked = false;
  document.querySelectorAll('[id^="total-"]').forEach(td => td.innerText = '$0'); // Reset individual part totals
  updateTotals();
}

window.fullUpgrade = function() {
  const upgrades = {
    'Engine L4': 1, 'Transmission Race': 1, 'Brakes Race': 1, 'Suspension Comp.': 1, 'Turbo': 1
  };

  Object.entries(upgrades).forEach(([name, count]) => {
    selected[name] = { count: count, total: parts.performance[name] * count };
    document.querySelector(`select[onchange="updateCount('${name}', ${parts.performance[name]}, this.value)"]`).value = count;
    document.getElementById(`total-${name}`).innerText = `$${selected[name].total}`;
  });
  updateTotals();
}

createTable(parts.performance, 'performanceTable');
createTable(parts.cosmetics, 'cosmeticTable');
