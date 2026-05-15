# TODO - Responsividade e transições (DC Canopy)

- [ ] Revisar e melhorar `css/style.css`:
  - [ ] Ajustar hero no mobile (remover/mitigar background-attachment: fixed, estabilidade de alturas)
  - [ ] Padronizar transições (trocar `transition: all` por propriedades específicas)
  - [ ] Melhorar consistência de animações `.fade-up` e performance (will-change)
  - [ ] Adicionar `@media (prefers-reduced-motion: reduce)` para reduzir/neutralizar animações e transições
  - [ ] Revisar grids/pontos de quebra para evitar quebras/spacing ruim em larguras menores

- [ ] (Se necessário) Ajustar `js/main.js` para respeitar reduced-motion.
- [ ] Testar manualmente `index.html` em 360/480/768/1024 e verificar modal, nav e scroll animations.

