---
permalink: /
title: "Bruno Martins Gurgatz"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

<img src="/images/headersatelite.jpg" alt="Imagem de satélite" style="width:100%; border-radius: 6px; margin-bottom: 20px;">

Pesquisador do [Laboratório de Geoprocessamento e Estudos Ambientais da UFPR](https://lageamb.ufpr.br/elementor-14562/), coordena o projeto **Adaptando Unidades de Conservação**.

Meus temas de pesquisa são **poluição atmosférica em áreas portuárias**, **licenciamento ambiental de grandes projetos** e **adaptação climática em áreas protegidas**.

<li>☭  Comunista🔻 Decrescimento</li>


___
<span class="badge">🧪 Pós-doutorando em Sistemas Costeiros e Oceânicos – UFPR (atual)</span>

<span class="badge">🎓 Doutorado em Sistemas Costeiros e Oceânicos – UFPR (2023)</span>

<span class="badge">📚 Mestrado em Desenvolvimento Territorial Sustentável – UFPR (2018)</span>

<span class="badge">🌱 Graduação em Gestão Ambiental – UFPR (2015)</span>

<span class="badge">📌 Ensino Técnico em Orientação Comunitária – UFPR (2011)</span>



#### 🧪 Pós-doutorado em Sistemas Costeiros e Oceânicos – UFPR (atual)
*Planos para adaptação climática para a Reserva Natural Salto Morato (PR) e Serra do Tombador (GO).*

---

#### 🎓 Doutorado em Sistemas Costeiros e Oceânicos – UFPR (2023)
*Avanços na compreensão sobre a origem, destino e distribuição de poluentes antropogênicos no Complexo Estuarino de Paranaguá, Brasil — uma fotografia do Antropoceno.*

---

#### 📚 Mestrado em Desenvolvimento Territorial Sustentável – UFPR (2018)
*Avaliação de material particulado fino, fuligem e poluentes gasosos na região portuária de Paranaguá.*

---

#### 🌱 Graduação em Gestão Ambiental – UFPR (2015)
*Poluição atmosférica e vulnerabilização social: proposta metodológica para análise de risco ambiental utilizando lógica fuzzy.*

---

#### 📌 Ensino Técnico em Orientação Comunitária – UFPR (2011)





---

### Publicações recentes

{% assign recent_pubs = site.publications | sort: 'date' | reverse | slice: 0, 5 %}
<ul>
  {% for pub in recent_pubs %}
    <li>
      <strong>{{ pub.title }}</strong><br>
      <em>{{ pub.authors }}</em><br>
      <a href="{{ pub.url | relative_url }}">[acessar]</a>
    </li>
  {% endfor %}
</ul>

<p><a href="{{ '/publications/' | relative_url }}">→ Ver todas as publicações</a></p>

---