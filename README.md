# Página de Fichas — Axial OS

Este pacote está pronto para publicação no GitHub Pages e incorporação no Tumblr por iframe.

## Arquivos que devem ser enviados para a raiz do repositório

- `index.html`
- `axial-os.css`
- `axial-os.js`

Os arquivos `README.md` e `iframe-tumblr.html` são auxiliares e também podem ser enviados.

## 1. Envie os arquivos ao GitHub

Dentro do repositório:

1. Clique em **Add file**.
2. Clique em **Upload files**.
3. Arraste `index.html`, `axial-os.css` e `axial-os.js` para a página.
4. Em **Commit message**, escreva: `Adicionar página Fichas Axial OS`.
5. Clique em **Commit changes**.

Mantenha os três arquivos juntos na raiz do repositório. O `index.html` usa caminhos relativos para carregar o CSS e o JavaScript.

## 2. Ative o GitHub Pages

1. Abra **Settings** no repositório.
2. No menu lateral, abra **Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Em **Branch**, selecione `main`.
5. Em pasta, selecione `/root`.
6. Clique em **Save**.

Endereço esperado para este repositório:

`https://inhumansappilgo-prog.github.io/arqhammerinicio/`

## 3. Incorpore no Tumblr

Cole o conteúdo de `iframe-tumblr.html` na página personalizada do Tumblr em modo HTML.

```html
<iframe
  src="https://inhumansappilgo-prog.github.io/arqhammerinicio/"
  title="H.A.M.M.E.R. — Índice de Alvos Axiais"
  loading="lazy"
  allowfullscreen
  referrerpolicy="no-referrer-when-downgrade"
  style="position:fixed;top:0;left:0;width:100%;height:100%;border:0;margin:0;padding:0;overflow:auto;z-index:999999;background:#050000;"
></iframe>
```

## Observação

O endereço precisa conter `.github.io`. O formato sem esse domínio não aponta para o GitHub Pages.
