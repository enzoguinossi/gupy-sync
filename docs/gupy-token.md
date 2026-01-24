# Como obter o candidate_secure_token da Gupy

Este projeto utiliza a **API privada da Gupy**, que exige um cookie de autenticação.

## Passo a passo (qualquer navegador)

1. Acesse https://www.gupy.io e faça login normalmente
2. Abra as **Ferramentas de Desenvolvedor** do navegador:
    - Chrome / Edge: `F12` ou `Ctrl + Shift + I`
    - Firefox: `F12`
    - Safari: Ative o menu Desenvolvedor nas preferências

3. Vá até a aba **Network / Rede**
4. Recarregue a página
5. Clique em qualquer requisição **GET** para:
   private-api.gupy.io
6. Vá até a seção **Headers**
7. Procure por **Cookies**
8. Copie apenas o valor de:

 candidate_secure_token=SEU_TOKEN_AQUI

⚠️ Importante:
- Copie **somente o valor**
- Não inclua `candidate_secure_token=`
- Não use aspas
- Não adicione espaços

