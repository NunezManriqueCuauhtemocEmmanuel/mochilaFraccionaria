function agregarObjeto() {
  const container = document.getElementById("contenedorI");
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `<input type="number" class="value" placeholder="Valor"> <input type="number" class="weight" placeholder="Peso">`;
  container.appendChild(div);
}

async function mochilaFraccionaria() {
  const values = document.querySelectorAll(".value");
  const weights = document.querySelectorAll(".weight");
  const pesoMaximo = parseFloat(document.getElementById("pesoMaximo").value);
  const mochila = document.getElementById("mochila");
  const log = document.getElementById("pasosR");
  const barFill = document.getElementById("barraL");
  const barEmpty = document.getElementById("barraV");

  mochila.innerHTML = "";
  log.innerHTML = "";
  barFill.style.width = "0%";
  barEmpty.style.width = "100%";
  barFill.textContent = "0%";
  barEmpty.textContent = "100%";

  let items = [];

  for (let i = 0; i < values.length; i++) {
    const value = parseFloat(values[i].value);
    const weight = parseFloat(weights[i].value);
    if (!isNaN(value) && !isNaN(weight) && weight > 0 && value >= 0) {
      const efficiency = value / weight;
      items.push({ value, weight, index: i, efficiency });
    }
  }

  if (items.length === 0 || isNaN(pesoMaximo) || pesoMaximo <= 0) {
    log.innerHTML = "Por favor, ingresa datos válidos.";
    return;
  }

  items.sort((a, b) => b.efficiency - a.efficiency);
  log.innerHTML += `<p>Objetos ordenados por eficiencia (valor/peso):</p>\n`;
  items.forEach(item => {
    log.innerHTML += `<p>Item ${item.index + 1} - Valor: ${item.value}, Peso: ${item.weight}, Eficiencia: ${item.efficiency.toFixed(2)}</p>`;
  });

  let totalValue = 0;
  let remainingWeight = pesoMaximo;
  let usedWeight = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const objDiv = document.createElement("div");
    objDiv.className = "objeto";

    let takenWeight = 0;
    let takenValue = 0;
    let fraction = 0;

    if (item.weight <= remainingWeight) {
      takenWeight = item.weight;
      takenValue = item.value;
      fraction = 1;
      remainingWeight -= item.weight;
    } else if (remainingWeight > 0) {
      takenWeight = remainingWeight;
      fraction = remainingWeight / item.weight;
      takenValue = item.value * fraction;
      remainingWeight = 0;
    }

    if (fraction > 0) {
      usedWeight += takenWeight;
      totalValue += takenValue;

      // Resaltar inputs del item tomado
      const valueInput = values[item.index];
      const weightInput = weights[item.index];
      valueInput.classList.add("resaltado");
      weightInput.classList.add("resaltado");

      objDiv.innerText = `Item ${item.index + 1} - ${(fraction * 100).toFixed(2)}%\nEf: ${item.efficiency.toFixed(2)}`;
      mochila.appendChild(objDiv);

      await new Promise(r => setTimeout(r, 300));
      objDiv.style.opacity = 1;
      objDiv.style.transform = "scale(1)";

      log.innerHTML += `<p>Tomar Item ${item.index + 1}: valor ${item.value}, peso ${item.weight}, tomado ${(fraction * 100).toFixed(2)}%</p>`;

      const usedPercentage = (usedWeight / pesoMaximo) * 100;
      const unusedPercentage = 100 - usedPercentage;
      barFill.style.width = `${usedPercentage}%`;
      barEmpty.style.width = `${unusedPercentage}%`;
      barFill.textContent = `${usedPercentage.toFixed(0)}%`;
      barEmpty.textContent = `${unusedPercentage.toFixed(0)}%`;

      await new Promise(r => setTimeout(r, 800));
    }

    if (remainingWeight === 0) {
      log.innerHTML += `<p>\nMochila llena.\n</p>`;
      break;
    }
  }

  document.getElementById("totalM").textContent = `Valor total en la mochila: ${totalValue.toFixed(2)}`;
  document.getElementById("cantidadCambio").value = totalValue.toFixed(2);
  calcularCambio();
}

async function calcularCambio() {
  const cantidad = parseFloat(document.getElementById("cantidadCambio").value);
  const billetes = [500, 200, 100, 50, 20, 10, 5, 2, 1];
  let cambioRestante = cantidad;
  let resultado = '';
  const animacionCajero = document.getElementById("animacionCajero");
  animacionCajero.innerHTML = '';

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor, ingresa una cantidad válida.");
    return;
  }

  for (let i = 0; i < billetes.length; i++) {
    let numBilletes = Math.floor(cambioRestante / billetes[i]);
    if (numBilletes > 0) {
      resultado += `${numBilletes} billetes de ${billetes[i]}\n`;
      cambioRestante -= numBilletes * billetes[i];

      for (let j = 0; j < numBilletes; j++) {
        const billeteDiv = document.createElement("div");
        billeteDiv.className = "billete";
        billeteDiv.textContent = `$${billetes[i]}`;
        animacionCajero.appendChild(billeteDiv);
        await new Promise(r => setTimeout(r, 300));
      }
    }
  }

  document.getElementById("resultadoCambio").innerText = resultado || "No se puede devolver esta cantidad.";
}
