# articles-to-csv
Converte o XML dos Anais do SBSI em 3 arquivos CSV com os artigos, autores e seções respectivamentes.


Para executar basta informar o nome do arquivo .xml com os artigos:

```
# Relativo ao diretório atual
node index.js ../sbsi2015.xml
```

Ou ainda:

```
# ou com caminho absoluto.
node index.js /home/brlebtag/Documentos/mestrado/orientador/SBSI2017/sbsi2015.xml
```


## Observação Importante

Os arquivos `autores.csv` e `secoes.csv` usam como separador `;` porém o arquivo `artigos.csv` usa como separador o `|` e você precisará informa-lo ao programa leitor (Excel ou LibreOffice Calc).