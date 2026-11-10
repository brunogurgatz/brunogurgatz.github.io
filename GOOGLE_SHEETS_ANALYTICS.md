# Registro de carregamentos de página com Google Sheets

O site pode registrar carregamentos de página em uma planilha gratuita do Google Sheets por meio de um Web App do Google Apps Script. O sistema não identifica visitantes únicos: cada execução do rastreador conta um carregamento de página. Uma mesma pessoa pode gerar vários carregamentos.

Os dados guardados na planilha são a hora local de São Paulo, o caminho da página (sem domínio, parâmetros de URL ou fragmento) e o total de carregamentos. Uma linha é criada somente quando uma página recebe o primeiro carregamento daquela hora; os seguintes incrementam o total da mesma linha. Horas sem visitas não geram linhas.

## 1. Criar e configurar a planilha

1. Crie uma planilha no [Google Sheets](https://sheets.google.com/) usando a conta Google que ficará responsável pelo sistema.
2. Na planilha, abra **Extensões → Apps Script**.
3. No editor do Apps Script, abra `Code.gs`, apague o conteúdo de exemplo e cole todo o conteúdo de [`google-apps-script/Code.gs`](./google-apps-script/Code.gs).
4. Salve o projeto.
5. No seletor de funções do editor, selecione `setup` e clique em **Executar**.
6. Revise e conceda as permissões solicitadas para o script acessar a planilha. A função cria a aba **Visitas por página e hora** e registra internamente o ID da planilha.

Não é necessário criar a aba manualmente. Não compartilhe a planilha publicamente: o Web App pode escrever nela usando as permissões da conta proprietária.

## 2. Implantar o Web App

1. No Apps Script, clique em **Implantar → Nova implantação**.
2. Clique na engrenagem e selecione **Aplicativo da Web**.
3. Em **Executar como**, selecione **Eu** (a conta proprietária da planilha).
4. Em **Quem pode acessar**, selecione **Qualquer pessoa**. Isso permite que visitantes do site enviem o registro sem fazer login.
5. Clique em **Implantar** e conclua a autorização, se solicitada.
6. Copie a URL do Web App que termina em `/exec`. Não use a URL de teste que termina em `/dev`.

O endereço `/exec` ficará público no código do site. Isso é necessário para o navegador enviar as contagens; não é uma senha. Como qualquer endpoint público, ele pode receber requisições falsas ou atingir limites de uso do Apps Script. O código não registra IP, agente do navegador, referenciador, cookies, identificadores ou parâmetros da URL. O Google ainda pode processar dados técnicos da requisição conforme seus próprios serviços e políticas.

Se editar o código do Apps Script posteriormente, abra **Implantar → Gerenciar implantações**, edite a implantação e selecione uma nova versão para que o `/exec` use o código atualizado.

## 3. Ativar no site

1. Abra `_config.yml` neste repositório.
2. Substitua o valor vazio de `pageview_tracker_endpoint` pela URL `/exec` copiada. Exemplo:

   ```yaml
   pageview_tracker_endpoint: "https://script.google.com/macros/s/SEU_ID_DE_IMPLANTACAO/exec"
   ```

3. Salve e publique a alteração no GitHub Pages. O rastreador permanece inativo enquanto esse valor estiver vazio.
4. Depois que o site for publicado, abra uma página do site e confira a aba **Visitas por página e hora** da planilha. O primeiro registro pode levar alguns segundos.

Para suspender o registro, deixe `pageview_tracker_endpoint` vazio e publique novamente.

## 4. Ler os dados

As colunas da aba deixam explícito que a métrica é de **carregamentos de página, não visitantes únicos**:

| Hora (America/Sao_Paulo) | Página | Carregamentos de página (não visitantes únicos) |
|---|---|---:|
| 2026-11-10 10:00 | `/` | 4 |
| 2026-11-10 10:00 | `/publications/` | 2 |

Cada linha representa uma página com pelo menos um carregamento naquela hora. O número não é deduplicado por pessoa ou navegador e pode incluir robôs ou pré-carregamentos que executem o script. Como somente caminhos são enviados, páginas diferentes com parâmetros de consulta diferentes são agrupadas no mesmo caminho. A hora usa o fuso `America/Sao_Paulo`, definido em `TIME_ZONE` no Apps Script.

## Limites e custos

Essa solução usa os serviços gratuitos do Google, mas está sujeita às cotas e aos limites de uso do Google Apps Script e do Sheets; não é capacidade ilimitada nem uma garantia de disponibilidade. A planilha também cresce com cada combinação de página e hora que receber visitas. O site não é bloqueado se o envio falhar, mas nesse caso o registro poderá não aparecer.
