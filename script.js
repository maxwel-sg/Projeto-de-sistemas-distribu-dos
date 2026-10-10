const formPedido = document.getElementById("formPedido");

formPedido.addEventListener("submit", function (event) {
  event.preventDefault();

  const pedido = {
    numero: document.getElementById("numero").value,
    restaurante: document.getElementById("restaurante").value,
    cliente: document.getElementById("cliente").value,
    telefone: document.getElementById("telefone").value,
    endereco: document.getElementById("endereco").value,
    itens: document.getElementById("itens").value,
    pagamento: document.getElementById("pagamento").value,
    status: "Recebido",
    inicioEntrega: null,
    fimEntrega: null,
  };

  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");

  pedidos.push(pedido);

  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  alert("Pedido cadastrado com sucesso!");

  formPedido.reset();

  mostrarPedidos();
});

function mostrarPedidos() {
  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");

  let lista = document.getElementById("listaPedidos");

  if (!lista) {
    lista = document.createElement("section");
    lista.id = "listaPedidos";
    formPedido.insertAdjacentElement("afterend", lista);
  }

  lista.innerHTML = "<h2>Pedidos cadastrados</h2>";

  pedidos.forEach((pedido, indice) => {
    const card = document.createElement("article");

    const titulo = document.createElement("h3");
    titulo.textContent = `Pedido #${pedido.numero}`;

    const detalhes = document.createElement("p");
    detalhes.textContent =
      `Estabelecimento: ${pedido.restaurante} | ` +
      `Cliente: ${pedido.cliente} | ` +
      `Endereço: ${pedido.endereco}`;

    const itens = document.createElement("p");
    itens.textContent = `Itens: ${pedido.itens}`;

    const status = document.createElement("p");
    status.textContent = `Status: ${pedido.status}`;

    const tempo = document.createElement("p");

    if (pedido.inicioEntrega) {
      const fim = pedido.fimEntrega || Date.now();
      const segundos = Math.floor((fim - pedido.inicioEntrega) / 1000);

      const minutos = Math.floor(segundos / 60);
      const restante = segundos % 60;

      tempo.textContent = pedido.fimEntrega
        ? `Tempo total: ${minutos} min ${restante} s`
        : `Tempo de entrega: ${minutos} min ${restante} s`;
    }

    const botao = document.createElement("button");
    botao.textContent = "Avançar status";

    botao.addEventListener("click", function () {
      const etapas = [
        "Recebido",
        "Em preparação",
        "Pronto para retirada",
        "Saiu para entrega",
        "Entregue",
      ];

      const atual = etapas.indexOf(pedido.status);

      if (atual < etapas.length - 1) {
        pedido.status = etapas[atual + 1];

        if (pedido.status === "Saiu para entrega") {
          pedido.inicioEntrega = Date.now();
        }

        if (pedido.status === "Entregue") {
          pedido.fimEntrega = Date.now();
        }

        pedidos[indice] = pedido;

        localStorage.setItem("pedidos", JSON.stringify(pedidos));

        mostrarPedidos();
      }
    });

    card.append(titulo, detalhes, itens, status, tempo, botao);
    card.style.border = "1px solid #ccc";
    card.style.padding = "12px";
    card.style.margin = "12px 0";
    card.style.borderRadius = "8px";

    lista.appendChild(card);
  });
}

mostrarPedidos();
