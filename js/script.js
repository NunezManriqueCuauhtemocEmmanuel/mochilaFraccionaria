function agregarObjeto() {
  const container = document.getElementById("contenedorI");
  const div = document.createElement("div");
  div.className = "item";
  div.innerHTML = `<input type="number" class="value" placeholder="Valor"> <input type="number" class="weight" placeholder="Peso">`;
  container.appendChild(div);
}

async function mochilaFraccionaria() {
  const valores = document.querySelectorAll(".value");
  const pesos = document.querySelectorAll(".weight");
  const pesoMaximo = parseFloat(document.getElementById("pesoMaximo").value);
  const mochila = document.getElementById("mochila");
  const log = document.getElementById("pasosR");
  const barraLlena = document.getElementById("barraL");
  const barraVacia = document.getElementById("barraV");

  mochila.innerHTML = "";
  log.innerHTML = "";
  barraLlena.style.width = "0%";
  barraVacia.style.width = "100%";
  barraLlena.textContent = "0%";
  barraVacia.textContent = "100%";

  let items = [];

  for (let i = 0; i < valores.length; i++) {
    const value = parseFloat(valores[i].value);
    const weight = parseFloat(pesos[i].value);
    if (!isNaN(value) && !isNaN(weight) && weight > 0 && value >= 0) {
      const eficienciaA = value / weight;
      items.push({ value, weight, index: i, eficienciaA });
    }
  }

  if (items.length === 0 || isNaN(pesoMaximo) || pesoMaximo <= 0) {
    log.innerHTML = "Por favor, ingresa datos válidos.";
    return;
  }

  items.sort((a, b) => b.eficienciaA - a.eficienciaA);
  log.innerHTML += `<p>Objetos ordenados por eficiencia (valor/peso):</p>\n`;
  items.forEach(item => {
    log.innerHTML += `<p>Item ${item.index + 1} - Valor: ${item.value}, Peso: ${item.weight}, Eficiencia: ${item.eficienciaA.toFixed(2)}</p>`;
  });

  let ValorTotal = 0;
  let pesoRem = pesoMaximo;
  let pesoUsado = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const objDiv = document.createElement("div");
    objDiv.className = "objeto";

    let tomarPeso = 0;
    let tomarValor = 0;
    let fraccion = 0;

    if (item.weight <= pesoRem) {
      tomarPeso = item.weight;
      tomarValor = item.value;
      fraccion = 1;
      pesoRem -= item.weight;
    } else if (pesoRem > 0) {
      tomarPeso = pesoRem;
      fraccion = pesoRem / item.weight;
      tomarValor = item.value * fraccion;
      pesoRem = 0;
    }

    if (fraccion > 0) {
      pesoUsado += tomarPeso;
      ValorTotal += tomarValor;

      const valueInput = valores[item.index];
      const weightInput = pesos[item.index];
      valueInput.classList.add("resaltado");
      weightInput.classList.add("resaltado");

      objDiv.innerText = `Item ${item.index + 1} - ${(fraccion * 100).toFixed(2)}%\nEf: ${item.eficienciaA.toFixed(2)}`;
      mochila.appendChild(objDiv);

      await new Promise(r => setTimeout(r, 300));
      objDiv.style.opacity = 1;
      objDiv.style.transform = "scale(1)";

      log.innerHTML += `<p>Tomar Item ${item.index + 1}: valor ${item.value}, peso ${item.weight}, tomado ${(fraccion * 100).toFixed(2)}%</p>`;

      const porcentajeUsado = (pesoUsado / pesoMaximo) * 100;
      const porcentajeFalt = 100 - porcentajeUsado;
      barraLlena.style.width = `${porcentajeUsado}%`;
      barraVacia.style.width = `${porcentajeFalt}%`;
      barraLlena.textContent = `${porcentajeUsado.toFixed(0)}%`;
      barraVacia.textContent = `${porcentajeFalt.toFixed(0)}%`;

      await new Promise(r => setTimeout(r, 800));
    }

    if (pesoRem === 0) {
      log.innerHTML += `<p>\nMochila llena.\n</p>`;
      break;
    }
  }

  document.getElementById("totalM").textContent = `Valor total en la mochila: ${ValorTotal.toFixed(2)}`;
  document.getElementById("cantidadCambio").value = ValorTotal.toFixed(2);
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
