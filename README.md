# trabalho-liza

Testes de carga e de estresse com **Grafana k6** em um site de Lista de Tarefas (HTML, CSS e JavaScript), com os resultados enviados ao **Grafana Cloud**.

## Estrutura

```
trabalho-liza/
├── site/                  # site testado
│   ├── index.html
│   ├── style.css
│   └── script.js
├── tests/k6/
│   ├── load_test.js       # teste de carga
│   └── stress_test.js     # teste de estresse
├── resultados/            # prints do terminal e do Grafana
└── README.md
```

## Funcionalidades em JavaScript

1. Adicionar tarefa, com validação (mínimo de 3 caracteres).
2. Marcar tarefa como concluída e remover tarefa.
3. Filtrar (todas, pendentes, concluídas) com contador de pendentes.

## Como rodar

1. Ligar o site, na pasta do projeto (fica em `http://localhost:8080`):

```
py -m http.server 8080 --directory site
```

2. Em outra janela, rodar os testes:

```
k6 run tests\k6\load_test.js
k6 run tests\k6\stress_test.js
```

3. Para enviar os resultados ao Grafana Cloud (após `k6 cloud login`):

```
k6 cloud run --local-execution tests\k6\load_test.js
k6 cloud run --local-execution tests\k6\stress_test.js
```

## Testes

- **Carga:** 50 usuários virtuais, com subida de 10 s, 30 s mantendo e 5 s de descida. Metas: menos de 1% de erro e p95 abaixo de 500 ms.
- **Estresse:** degraus de 25, 50, 75 e 100 usuários (30 s cada) e descida, com pausa de 0,2 s entre requisições. Metas: menos de 5% de erro e p95 abaixo de 1 s. O teto de 100 usuários é o limite do projeto no Grafana Cloud.

## Resultados

| Teste | Execução no Grafana | Requisições | Erros | p95 |
|---|---|---|---|---|
| Carga (50 usuários) | 9045242 | 1.893 | 0,00% | 6,22 ms |
| Estresse (até 100 usuários) | 9045309 | 32.767 | 44,79% | 25 ms |

- **Carga:** todas as metas foram atingidas.
- **Estresse:** o tempo de resposta ficou dentro da meta, mas a taxa de erro passou de 5%. Os erros começaram em cerca de 80 a 90 usuários simultâneos (em torno de 300 requisições por segundo). Segundo o log do k6, as 14.678 falhas foram de conexão (927 recusadas e 13.751 por esgotamento de portas do Windows), não de lentidão. Esse limite vale para este ambiente (servidor simples do Python e k6 no mesmo computador).

A primeira rodada de carga, com os 50 usuários entrando de uma vez, deu 7,69% de erro por conexões recusadas no primeiro segundo. O script foi ajustado para subir os usuários aos poucos.

Os prints do terminal e dos gráficos do Grafana estão em `resultados/`.
