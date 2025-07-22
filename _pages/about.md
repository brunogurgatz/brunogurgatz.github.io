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

<li>☭ Comunista</li>
  <li>🔻 Decrescimento</li>


___
<span class="badge">🧪 Pós-doutorando em Sistemas Costeiros e Oceânicos – UFPR (atual)</span>

<span class="badge">🎓 Doutorado em Sistemas Costeiros e Oceânicos – UFPR (2023)</span>

<span class="badge">📚 Mestrado em Desenvolvimento Territorial Sustentável – UFPR (2018)</span>

<span class="badge">🌱 Graduação em Gestão Ambiental – UFPR (2015)</span>

<span class="badge">📌 Ensino Técnico em Orientação Comunitária – UFPR (2011)</span>




Durante minha trajetória, estudei a qualidade do ar em Paranaguá (PR), rastreando a origem de poluentes atmosféricos na área portuária, e avaliei a presença de marcadores químicos em sedimentos do Complexo Estuarino de Paranaguá, associados à poluição por óleo, queimadas e efluentes. 

**Em minha [tese](https://acervodigital.ufpr.br/xmlui/handle/1884/86567) apresento esses estudos como uma "Fotografia do Antropoceno", mostrando através da geoquímica orgânica, que o litoral do Paraná ainda é um paraíso, mas já sente o peso de sustentar o avanço do capital internacional e do agronegócio predatório.**
{: .notice}


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