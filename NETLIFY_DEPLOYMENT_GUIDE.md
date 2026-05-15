# DC Canopy Duct Fan Clean - Netlify Deployment Guide

## 📋 Pré-requisitos

- Conta GitHub com este repositório
- Conta Netlify (https://www.netlify.com)

## 🚀 Deploy no Netlify

### Método 1: Deploy Automático via GitHub (Recomendado)

1. **Push do código para GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - preparing for Netlify deployment"
   git push -u origin main
   ```

2. **Conectar no Netlify**
   - Acesse https://app.netlify.com
   - Clique em "Add new site"
   - Escolha "Import an existing project"
   - Selecione "GitHub" como provedor
   - Autorize o Netlify para acessar seus repositórios
   - Selecione o repositório `dccanopy-website`

3. **Configurar Build Settings**
   - **Build command**: (deixe em branco - site estático)
   - **Publish directory**: `.` (raiz do repositório)
   - **Node version**: (não necessário)
   - Clique em "Deploy site"

### Método 2: Deploy Manual via Drag & Drop

1. Acesse https://app.netlify.com
2. Arraste e solte a pasta do projeto na área de upload
3. O site será deployado automaticamente

### Método 3: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Deploy
netlify deploy --prod
```

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

- [ ] Homepage carrega corretamente
- [ ] Navegação funciona (todos os links internos)
- [ ] Responsividade em mobile
- [ ] Formulário de contato funciona
- [ ] Imagens carregam corretamente
- [ ] SEO meta tags estão presentes
- [ ] Sitemap.xml acessível em `/sitemap.xml`
- [ ] Robots.txt acessível em `/robots.txt`

## 🔧 Configurações Aplicadas

O arquivo `netlify.toml` inclui:

- **Build**: Configurado para site estático
- **Cache**: 
  - Assets (JS/CSS): 1 ano (com cache-buster)
  - Imagens: 30 dias
  - HTML: Sem cache (sempre atualizado)
- **Headers de Segurança**: X-Frame-Options, X-Content-Type-Options, etc.
- **Redirects**: Configurados para SPA funcionar corretamente

## 🌐 Domain Personalizado

1. No painel Netlify, vá para **Site settings** → **Domain management**
2. Adicione seu domínio personalizado
3. Configure os DNS records conforme instruções do Netlify
4. Ative HTTPS (certificado SSL gratuito)

## 📊 Monitoramento

- **Analytics**: Acesse https://app.netlify.com para ver estatísticas
- **Deploys**: Histórico de todas as versões deployadas
- **Logs**: Consulte logs de build se houver erro

## 🔄 Atualizações Futuras

Qualquer push para a branch `main` no GitHub acionará um redeploy automático no Netlify.

```bash
# Para atualizar após fazer changes:
git add .
git commit -m "Update: descrição das mudanças"
git push
```

O deploy será feito automaticamente em alguns segundos.

## 🐛 Solução de Problemas

### Site carrega com CSS/JS quebrado
- Verifique os paths das imagens e assets
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Verifique os headers HTTP no `netlify.toml`

### 404 em páginas
- Certifique-se que o `netlify.toml` está configurado corretamente
- Verifique que todos os arquivos foram deployados

### Performance lenta
- Otimize tamanho das imagens
- Minifique CSS/JS se necessário
- Verifique Netlify Analytics

## 📞 Suporte

- Documentação Netlify: https://docs.netlify.com
- Status do Netlify: https://www.netlify.com/status

---

**Última atualização**: 11 de Maio de 2026
