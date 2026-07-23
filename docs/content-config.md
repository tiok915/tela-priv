# Configuração de Mídias e Publicações (Posts)

As mídias e publicações do checkout são configuradas em um único lugar para facilitar a manutenção.

**Arquivo principal:** `src/features/Checkout/data/content.ts`

## 1. Tipos de Mídia Disponíveis

Você pode adicionar mídias usando funções auxiliares no array `MEDIA`:

- `subPhoto("id", foto_num, quantidade)`: Foto(s) disponível apenas para assinantes.
- `paidPhoto("id", foto_num, preço_em_centavos, quantidade)`: Foto(s) que exige pagamento avulso (ex: `20000` = R$ 200,00).
- `subVideo("id", video_num, poster_num, quantidade)`: Vídeo disponível para assinantes.
- `paidVideo("id", video_num, poster_num, preço_em_centavos, quantidade)`: Vídeo com pagamento avulso.

**Exemplo básico (Apenas aba Mídias):**
```typescript
subPhoto("m1", 1, 5), // Mostra a foto 1 (com 5 na galeria) para assinantes
paidPhoto("m4", 4, 20000, 8), // Mostra a foto 4, custando R$ 200,00
```

## 2. Como transformar uma Mídia em uma Publicação (Post)

Para que uma mídia apareça também na aba **Publicações**, basta usar a sintaxe de *spread* (`...`) e adicionar as propriedades extras do post. 

As propriedades necessárias são:
- `showInPosts: true` (Obrigatório para aparecer na aba de posts)
- `caption` (Texto da publicação)
- `time` (Data/hora)
- `likes` (Número de curtidas)
- `mimo` (Valor em mimos)

**Exemplo de Mídia de Assinante como Post:**
```typescript
{ 
  ...subPhoto("m2", 2, 1), 
  showInPosts: true, 
  caption: "Boa noite suxu... quer saber oque to aprontando? Hehe", 
  time: "Set 25", 
  likes: "335", 
  mimo: "R$ 593,00" 
}
```

**Exemplo de Vídeo Pago como Post:**
```typescript
{ 
  ...paidVideo("m3", 1, 3, 29000), 
  showInPosts: true, 
  caption: "Oque achou desse roupinha?? rs 🔥🔥🔥", 
  time: "Dez 15, 2025", 
  likes: "438", 
  mimo: "R$ 580,00" 
}
```

## 3. Lógica de Bloqueio (Automática)

Você não precisa configurar o estado bloqueado/desbloqueado, o sistema cuida disso automaticamente:

1. **Usuário não assinante:**
   - Na aba publicações, ele verá apenas o PRIMEIRO post configurado (com layout de cadeado).
   - Na aba mídias, verá todas as mídias bloqueadas.
2. **Usuário assinante:**
   - Na aba publicações, verá TODOS os posts.
   - Posts do tipo `subPhoto`/`subVideo` estarão desbloqueados.
   - Posts do tipo `paidPhoto`/`paidVideo` estarão bloqueados (exigindo clique para comprar).
