(function () {
  "use strict";

  const items = {
    alimentacao: [
      { id: "arroz", label: "Arroz", icon: "🍚" },
      { id: "feijao", label: "Feijão", icon: "🫘" },
      { id: "macarrao", label: "Macarrão", icon: "🍝" },
      { id: "frango", label: "Frango", icon: "🍗" },
      { id: "pao", label: "Pão", icon: "🍞" },
      { id: "queijo", label: "Queijo", icon: "🧀" },
      { id: "ovo-cozido", label: "Ovo cozido", icon: "🥚" },
      { id: "ovo-frito", label: "Ovo frito", icon: "🍳" },
      { id: "tomate", label: "Tomate", icon: "🍅" },
      { id: "alface", label: "Alface", icon: "🥬" },
      { id: "bolo", label: "Bolo", icon: "🍰" },
      { id: "biscoito", label: "Biscoito", icon: "🍪" },
      { id: "leite", label: "Leite", icon: "🥛" },
      { id: "cha", label: "Chá", icon: "☕" },
      { id: "suco", label: "Suco", icon: "🧃" }
    ],
    higiene: [
      { id: "tomar-banho", label: "Tomar banho", icon: "🚿" },
      { id: "escovar-dentes", label: "Escovar os dentes", icon: "🪥" },
      { id: "pentear-cabelos", label: "Pentear os cabelos", icon: "💇" },
      { id: "lavar-maos", label: "Lavar as mãos", icon: "🧼" },
      { id: "lavar-rosto", label: "Lavar o rosto", icon: "💦" },
      { id: "usar-banheiro", label: "Usar o banheiro", icon: "🚽" },
      { id: "limpar-boca", label: "Limpar a boca", icon: "👄" },
      { id: "limpar-nariz", label: "Limpar o nariz", icon: "🧻" },
      { id: "dar-descarga", label: "Dar descarga", icon: "🚽" },
      { id: "trocar-roupa", label: "Trocar de roupa", icon: "👕" },
      { id: "secar-maos", label: "Secar as mãos", icon: "🙌" },
      { id: "assoar-nariz", label: "Assoar o nariz", icon: "🤧" },
      { id: "fio-dental", label: "Passar fio dental", icon: "🦷" },
      { id: "cortar-unhas", label: "Cortar as unhas", icon: "✂️" },
      { id: "secar-corpo", label: "Secar o corpo", icon: "🧖" }
    ]
  };

  const STORAGE_KEY = "comunica-facil-v1";
  const TEXT_STORAGE_KEY = "comunica-facil-texto-v1";
  const selection = { alimentacao: null, higiene: null };
  let assignments = loadAssignments();
  let statusTimer;

  function blankAssignments() {
    return {
      alimentacao: { want: [], avoid: [] },
      higiene: { want: [], avoid: [] }
    };
  }

  function loadAssignments() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || typeof saved !== "object") return blankAssignments();
      const next = blankAssignments();
      Object.keys(next).forEach(function (category) {
        ["want", "avoid"].forEach(function (zone) {
          const validIds = new Set(items[category].map(function (item) { return item.id; }));
          const candidate = saved[category] && Array.isArray(saved[category][zone]) ? saved[category][zone] : [];
          next[category][zone] = candidate.filter(function (id) { return validIds.has(id); });
        });
      });
      return next;
    } catch (error) {
      return blankAssignments();
    }
  }

  function saveAssignments() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
    } catch (error) {
      showStatus("As escolhas funcionam, mas não puderam ser salvas neste aparelho.");
    }
  }

  function findItem(category, id) {
    return items[category].find(function (item) { return item.id === id; });
  }

  function currentZone(category, id) {
    if (assignments[category].want.includes(id)) return "want";
    if (assignments[category].avoid.includes(id)) return "avoid";
    return null;
  }

  function zoneLabel(zone) {
    return zone === "want" ? "Quero" : "Não quero";
  }

  function showStatus(message) {
    const status = document.getElementById("status-mensagem");
    if (!status) return;
    window.clearTimeout(statusTimer);
    status.textContent = message;
    status.classList.add("is-visible");
    statusTimer = window.setTimeout(function () {
      status.classList.remove("is-visible");
    }, 2600);
  }

  function updateSelectionHelp(category) {
    const help = document.getElementById("ajuda-" + category);
    const selectedItem = selection[category] && findItem(category, selection[category]);
    if (!help) return;
    if (selectedItem) {
      help.textContent = selectedItem.label + " está selecionado. Agora escolha Quero ou Não quero.";
      help.classList.add("has-selection");
    } else {
      help.textContent = "Toque em um cartão para selecioná-lo.";
      help.classList.remove("has-selection");
    }
  }

  function selectItem(category, id) {
    selection[category] = selection[category] === id ? null : id;
    renderCategory(category);
    const item = findItem(category, id);
    if (selection[category] && item) {
      showStatus(item.label + " selecionado.");
    }
  }

  function removeFromZones(category, id) {
    assignments[category].want = assignments[category].want.filter(function (itemId) { return itemId !== id; });
    assignments[category].avoid = assignments[category].avoid.filter(function (itemId) { return itemId !== id; });
  }

  function assignItem(category, id, zone) {
    const item = findItem(category, id);
    if (!item || !assignments[category] || !assignments[category][zone]) return;
    removeFromZones(category, id);
    assignments[category][zone].push(id);
    selection[category] = null;
    saveAssignments();
    renderCategory(category);
    showStatus(item.label + " foi colocado em “" + zoneLabel(zone) + "”.");
  }

  function unassignItem(category, id) {
    const item = findItem(category, id);
    removeFromZones(category, id);
    saveAssignments();
    renderCategory(category);
    if (item) showStatus(item.label + " voltou para a lista.");
  }

  function createChoiceCard(category, item) {
    const button = document.createElement("button");
    const assignedZone = currentZone(category, item.id);
    button.type = "button";
    button.className = "choice-card";
    button.dataset.itemId = item.id;
    button.dataset.category = category;
    button.draggable = true;
    button.setAttribute("aria-pressed", String(selection[category] === item.id));
    button.setAttribute("aria-label", item.label + (assignedZone ? ", em " + zoneLabel(assignedZone) : ""));
    if (selection[category] === item.id) button.classList.add("is-selected");
    if (assignedZone) button.classList.add("is-assigned");

    const icon = document.createElement("span");
    icon.className = "choice-card__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.icon;

    const label = document.createElement("span");
    label.className = "choice-card__label";
    label.textContent = item.label;

    button.appendChild(icon);
    button.appendChild(label);

    if (assignedZone) {
      const badge = document.createElement("span");
      badge.className = "choice-card__status";
      badge.textContent = assignedZone === "want" ? "QUERO" : "NÃO QUERO";
      button.appendChild(badge);
    }

    button.addEventListener("click", function () { selectItem(category, item.id); });
    button.addEventListener("dragstart", function (event) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", JSON.stringify({ category: category, id: item.id }));
    });
    return button;
  }

  function createZoneItem(category, item, zone) {
    const card = document.createElement("div");
    card.className = "zone-item";
    card.draggable = true;
    card.dataset.itemId = item.id;
    card.dataset.category = category;
    card.setAttribute("aria-label", item.label + ", em " + zoneLabel(zone));

    const icon = document.createElement("span");
    icon.className = "zone-item__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = item.icon;

    const label = document.createElement("span");
    label.className = "zone-item__label";
    label.textContent = item.label;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "zone-item__remove";
    remove.setAttribute("aria-label", "Remover " + item.label + " de " + zoneLabel(zone));
    remove.textContent = "×";
    remove.addEventListener("click", function () { unassignItem(category, item.id); });

    card.addEventListener("dragstart", function (event) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", JSON.stringify({ category: category, id: item.id }));
    });

    card.appendChild(icon);
    card.appendChild(label);
    card.appendChild(remove);
    return card;
  }

  function renderCategory(category) {
    const library = document.getElementById("lista-" + category);
    if (!library) return;
    library.replaceChildren();
    items[category].forEach(function (item) {
      library.appendChild(createChoiceCard(category, item));
    });

    ["want", "avoid"].forEach(function (zone) {
      const listId = category + (zone === "want" ? "-quero" : "-nao-quero");
      const list = document.getElementById(listId);
      const zoneElement = list && list.closest(".drop-zone");
      if (!list || !zoneElement) return;
      list.replaceChildren();
      assignments[category][zone].forEach(function (id) {
        const item = findItem(category, id);
        if (item) list.appendChild(createZoneItem(category, item, zone));
      });
      zoneElement.classList.toggle("has-items", assignments[category][zone].length > 0);
    });
    updateSelectionHelp(category);
  }

  function setupDropZones() {
    document.querySelectorAll(".drop-zone").forEach(function (zoneElement) {
      zoneElement.addEventListener("dragover", function (event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        zoneElement.classList.add("is-dragover");
      });
      zoneElement.addEventListener("dragleave", function (event) {
        if (!zoneElement.contains(event.relatedTarget)) zoneElement.classList.remove("is-dragover");
      });
      zoneElement.addEventListener("drop", function (event) {
        event.preventDefault();
        zoneElement.classList.remove("is-dragover");
        try {
          const payload = JSON.parse(event.dataTransfer.getData("text/plain"));
          if (payload.category === zoneElement.dataset.category) {
            assignItem(payload.category, payload.id, zoneElement.dataset.zone);
          }
        } catch (error) {
          showStatus("Não foi possível mover esse cartão.");
        }
      });
    });

    document.querySelectorAll(".assign-button").forEach(function (button) {
      button.addEventListener("click", function () {
        const category = button.dataset.category;
        const id = selection[category];
        if (!id) {
          showStatus("Primeiro toque em um cartão para selecioná-lo.");
          return;
        }
        assignItem(category, id, button.dataset.zone);
      });
    });

    document.querySelectorAll(".clear-category").forEach(function (button) {
      button.addEventListener("click", function () {
        const category = button.dataset.category;
        assignments[category] = { want: [], avoid: [] };
        selection[category] = null;
        saveAssignments();
        renderCategory(category);
        showStatus("As escolhas foram limpas.");
      });
    });
  }

  function activateTab(tabName, moveFocus) {
    const tabs = Array.from(document.querySelectorAll("[role='tab']"));
    tabs.forEach(function (tab) {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && moveFocus) tab.focus();
    });
    document.querySelectorAll("[role='tabpanel']").forEach(function (panel) {
      const active = panel.id === tabName;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
    if (window.location.hash !== "#" + tabName) {
      history.replaceState(null, "", "#" + tabName);
    }
  }

  function setupTabs() {
    const tabs = Array.from(document.querySelectorAll("[role='tab']"));
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { activateTab(tab.dataset.tab, false); });
      tab.addEventListener("keydown", function (event) {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        let targetIndex = index;
        if (event.key === "ArrowLeft") targetIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "ArrowRight") targetIndex = (index + 1) % tabs.length;
        if (event.key === "Home") targetIndex = 0;
        if (event.key === "End") targetIndex = tabs.length - 1;
        activateTab(tabs[targetIndex].dataset.tab, true);
      });
    });

    const requestedTab = window.location.hash.slice(1);
    if (["alimentacao", "higiene", "escrita"].includes(requestedTab)) {
      activateTab(requestedTab, false);
    }
  }

  function insertText(textarea, text) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const allowed = textarea.maxLength - (textarea.value.length - (end - start));
    const safeText = text.slice(0, Math.max(0, allowed));
    textarea.setRangeText(safeText, start, end, "end");
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  function backspace(textarea) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      textarea.setRangeText("", start, end, "end");
    } else if (start > 0) {
      const chars = Array.from(textarea.value.slice(0, start));
      const removed = chars.pop();
      const newStart = start - (removed ? removed.length : 0);
      textarea.setRangeText("", newStart, start, "end");
    }
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
    textarea.focus();
  }

  function makeKey(character) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "key-button";
    button.textContent = character;
    button.setAttribute("aria-label", "Digitar " + character);
    button.dataset.text = character;
    return button;
  }

  function setupKeyboard() {
    const textarea = document.getElementById("mensagem");
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÇ".split("");
    const numbers = "1234567890".split("");
    const accents = ["Á", "À", "Â", "Ã", "É", "Ê", "Í", "Ó", "Ô", "Õ", "Ú"];
    const symbols = [".", ",", "?", "!", ":", ";", "-", "'", "(", ")"];

    letters.forEach(function (character) { document.getElementById("teclas-letras").appendChild(makeKey(character)); });
    numbers.forEach(function (character) { document.getElementById("teclas-numeros").appendChild(makeKey(character)); });
    accents.forEach(function (character) { document.getElementById("teclas-acentos").appendChild(makeKey(character)); });
    symbols.forEach(function (character) { document.getElementById("teclas-sinais").appendChild(makeKey(character)); });

    document.querySelectorAll("[data-text]").forEach(function (button) {
      button.addEventListener("click", function () { insertText(textarea, button.dataset.text); });
    });

    document.querySelector("[data-action='newline']").addEventListener("click", function () { insertText(textarea, "\n"); });
    document.querySelector("[data-action='backspace']").addEventListener("click", function () { backspace(textarea); });

    function updateTextState() {
      const count = Array.from(textarea.value).length;
      document.getElementById("contador-caracteres").textContent = count + (count === 1 ? " caractere" : " caracteres");
      try {
        localStorage.setItem(TEXT_STORAGE_KEY, textarea.value);
      } catch (error) {
        /* O texto continua utilizável mesmo sem armazenamento local. */
      }
    }

    try {
      textarea.value = localStorage.getItem(TEXT_STORAGE_KEY) || "";
    } catch (error) {
      textarea.value = "";
    }
    updateTextState();
    textarea.addEventListener("input", updateTextState);

    document.getElementById("limpar-mensagem").addEventListener("click", function () {
      textarea.value = "";
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.focus();
      showStatus("A mensagem foi limpa.");
    });

    document.getElementById("copiar-mensagem").addEventListener("click", async function () {
      if (!textarea.value.trim()) {
        showStatus("Escreva uma mensagem antes de copiar.");
        return;
      }
      try {
        await navigator.clipboard.writeText(textarea.value);
        showStatus("Mensagem copiada.");
      } catch (error) {
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        showStatus(copied ? "Mensagem copiada." : "Não foi possível copiar automaticamente.");
      }
    });

    document.getElementById("falar-mensagem").addEventListener("click", function () {
      if (!textarea.value.trim()) {
        showStatus("Escreva uma mensagem antes de usar Falar.");
        return;
      }
      if (!("speechSynthesis" in window)) {
        showStatus("Este navegador não oferece leitura em voz alta.");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textarea.value);
      utterance.lang = "pt-BR";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      showStatus("Lendo a mensagem em voz alta.");
    });
  }

  renderCategory("alimentacao");
  renderCategory("higiene");
  setupDropZones();
  setupTabs();
  setupKeyboard();
}());
