---
permalink: /
title: "Bruno Martins Gurgatz"
author_profile: true
redirect_from: 
  - /about/
  - /about.html 
---

<img src="/images/headersatelite.jpg" alt="Imagem de satélite" style="width:100%; border-radius: 6px; margin-bottom: 20px;">

Pesquisador das ciências ambientais. Gosto de mar, de floresta, de ciência e de justiça social.

### Atualmente
- Laboratório Móvel de Educação Científica da UFPR Litoral
- Divulgação científica e cultura oceânica no projeto [@napi_agenda2030](https://www.instagram.com/napi_agenda2030/)

### Acho que manjo:
- Mudança do clima e conservação
- Poluição e qualidade ambiental em áreas portuárias
- Monitoramento ambiental e licenciamento
- Divulgação Científica e Ciência Cidadã

### Pesquisa
- Poluição atmosférica em Paranaguá
- Adaptação climática em áreas protegidas
- Geoquímica e poluição estuarina

---

> "Anarquistas são simplesmente pessoas que acreditam que seres humanos são capazes de se comportar de maneira razoável sem ter de ser forçados a isso. É realmente uma noção bem simples, mas é algo que os ricos e poderosos sempre consideraram extremamente perigoso."
>
> — [David Graeber](https://pt.anarchistlibraries.net/library/david-graeber-voce-e-anarquista) em *Você é Anarquista?*

☭ Comunista 🔻 Decrescimento

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
