# 🌟 Star Wars MCP Server

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue?style=for-the-badge)
![Star Wars API](https://img.shields.io/badge/SWAPI-Star%20Wars%20API-yellow?style=for-the-badge&logo=starwars)
![Claude Desktop](https://img.shields.io/badge/Claude-Desktop-orange?style=for-the-badge&logo=anthropic)

**Um servidor MCP (Model Context Protocol) que fornece acesso à Star Wars API (SWAPI) através do Claude Desktop**

</div>

## 📖 Sobre o Projeto

Este projeto é um servidor MCP desenvolvido em TypeScript que integra a [Star Wars API (SWAPI)](https://swapi.dev/) com o Claude Desktop. Ele permite que você faça perguntas sobre o universo Star Wars e obtenha informações detalhadas sobre personagens, planetas, filmes e muito mais, diretamente através do Claude.

## ✨ Funcionalidades

### 🔧 Tools Disponíveis

- **`search_characters`** - Busca personagens do Star Wars por nome
- **`search_planets`** - Busca planetas do Star Wars por nome  
- **`search_films`** - Busca filmes do Star Wars por título
- **`get_character_by_id`** - Obtém informações detalhadas de um personagem pelo ID

### 📚 Resources Disponíveis

- **`all_films`** - Lista todos os filmes da saga Star Wars ordenados por episódio

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Claude Desktop instalado
- npm ou yarn

### 1. Instalação

```bash
# Clone o repositório
git clone https://github.com/glaucia86/swapi-mcp-server-app.git

# Entre no diretório
cd swapi-mcp-server-app

# Instale as dependências
npm install
```

### 2. Compilação

```bash
# Compile o TypeScript
npm run build
```

### 3. Configuração do Claude Desktop

1. **Localize o arquivo de configuração:**
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. **Adicione a configuração do servidor MCP:**
   ```json
   {
     "mcpServers": {
       "swapi-mcp-server": {
         "command": "node",
         "args": ["CAMINHO_COMPLETO/swapi-mcp-server-app/build/index.js"]
       }
     }
   }
   ```
   
   > ⚠️ **Importante:** Substitua `CAMINHO_COMPLETO` pelo caminho absoluto para o seu projeto.

3. **Reinicie o Claude Desktop** completamente

### 4. Verificação

O servidor será iniciado automaticamente pelo Claude Desktop. Você saberá que está funcionando quando conseguir fazer perguntas sobre Star Wars no Claude.

## 🧪 Testando com o Inspector

Para testar e debugar o servidor MCP, você pode usar o MCP Inspector:

```bash
# Execute o inspector
npm run inspector
```

O inspector abrirá em seu navegador onde você poderá:
- Testar todos os tools individualmente
- Verificar os resources disponíveis
- Debugar problemas de conexão
- Visualizar logs em tempo real

## 💬 Exemplos de Perguntas

### Buscar Personagens
```
Busque informações sobre Luke Skywalker
```
```
Procure pelo personagem Darth Vader
```
```
Encontre dados sobre a Princesa Leia
```

### Buscar Planetas
```
Encontre informações sobre o planeta Tatooine
```
```
Busque dados sobre Alderaan
```
```
Procure pelo planeta Hoth
```

### Buscar Filmes
```
Procure pelo filme "A New Hope"
```
```
Busque informações sobre "The Empire Strikes Back"
```
```
Encontre dados do filme "Return of the Jedi"
```

### Obter Personagem por ID
```
Obtenha informações do personagem com ID 1
```
```
Busque dados do personagem com ID 4
```

### Listar Filmes
```
Liste todos os filmes de Star Wars
```
```
Mostre todos os filmes da saga Star Wars ordenados por episódio
```

## 📁 Estrutura do Projeto

```
swapi-mcp-server-app/
├── src/
│   ├── index.ts          # Servidor MCP principal
│   └── types.ts          # Definições de tipos TypeScript
├── build/                # Arquivos compilados
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configuração do TypeScript
└── README.md             # Documentação
```

## 🛠 Scripts Disponíveis

- `npm run build` - Compila o TypeScript
- `npm run watch` - Compila em modo watch
- `npm run inspect` - Executa o MCP Inspector para testes

## 🔍 Troubleshooting

### O servidor não aparece no Claude Desktop

1. Verifique se o caminho no arquivo de configuração está correto
2. Certifique-se de que o arquivo `build/index.js` existe
3. Reinicie o Claude Desktop completamente
4. Verifique os logs em `%APPDATA%\Claude\logs\mcp.log`

### Erros de compilação

1. Execute `npm install` novamente
2. Verifique se a versão do Node.js é compatível
3. Execute `npm run build` e verifique se há erros

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

<div align="center">

**Glaucia Lemos**

[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/glaucia_lemos86)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/glaucialemos/)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/@glaucialemos)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/glaucia86)

</div>

## 🌟 Agradecimentos

- [Star Wars API (SWAPI)](https://swapi.dev/) - pela API incrível
- [Model Context Protocol](https://modelcontextprotocol.io/) - pelo protocolo inovador
- [Anthropic](https://www.anthropic.com/) - pelo Claude Desktop

---

<div align="center">

**May the Force be with you! ⭐**

</div>