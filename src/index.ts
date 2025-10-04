#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { People, Planets, Films, SearchResponse } from "./types.js";

const SWAPI_BASE_URL = "https://swapi.dev/api";

class SwapiMcpServer {
  private server: McpServer;
  private axiosInstance;

  constructor() {
    this.server = new McpServer({
      name: "swapi-mcp-server",
      version: "1.0.0",
    });

    this.axiosInstance = axios.create({
      baseURL: SWAPI_BASE_URL,
      timeout: 10000,
    });

    this.setupTools();
    this.setupResources();
  }

  private setupTools(): void {
    this.server.registerTool(
      "search_characters",
      {
        title: "Buscar Personagens",
        description: "Busca personagens do Star Wars por nome",
        inputSchema: {
          search: z.string().describe("Nome do personagem para buscar"),
        },
      },
      async ({ search }) => {
        try {
          const response = await this.axiosInstance.get<SearchResponse<People>>(
            "/people/",
            {
              params: { search },
            }
          );

          if (response.data.results.length === 0) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Nenhum personagem encontrado com o nome "${search}".`,
                },
              ],
            };
          }

          const charactersInfo = response.data.results
            .map((char) => {
              return `Nome: ${char.name}
                Altura: ${char.height}cm
                Massa: ${char.mass}kg
                Cor do Cabelo: ${char.hair_color}
                Cor dos Olhos: ${char.eye_color}
                Ano de Nascimento: ${char.birth_year}
                Gênero: ${char.gender}
                `;
            })
            .join("\n---\n\n");

          return {
            content: [
              {
                type: "text" as const,
                text: `Encontrados ${response.data.results.length} personagem(ns):\n\n${charactersInfo}`,
              },
            ],
          };
        } catch (error) {
          return this.handleError(error, "buscar personagens");
        }
      }
    );

    this.server.registerTool(
      "search_planets",
      {
        title: "Buscar Planetas",
        description: "Busca planetas do Star Wars por nome",
        inputSchema: {
          search: z.string().describe("Nome do planeta para buscar"),
        },
      },
      async ({ search }) => {
        try {
          const response = await this.axiosInstance.get<SearchResponse<Planets>>(
            "/planets/",
            {
              params: { search },
            }
          );

          if (response.data.results.length === 0) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Nenhum planeta encontrado com o nome "${search}".`,
                },
              ],
            };
          }

          const planetsInfo = response.data.results
            .map((planet) => {
              return `Nome: ${planet.name}
                Clima: ${planet.climate}
                Terreno: ${planet.terrain}
                População: ${planet.population}
                Diâmetro: ${planet.diameter}km
                Período de Rotação: ${planet.rotation_period}h
                Período Orbital: ${planet.orbital_period} dias
                `;
            })
            .join("\n---\n\n");

          return {
            content: [
              {
                type: "text" as const,
                text: `Encontrados ${response.data.results.length} planeta(s):\n\n${planetsInfo}`,
              },
            ],
          };
        } catch (error) {
          return this.handleError(error, "buscar planetas");
        }
      }
    );

    this.server.registerTool(
      "search_films",
      {
        title: "Buscar Filmes",
        description: "Busca filmes do Star Wars por título",
        inputSchema: {
          search: z.string().describe("Título do filme para buscar"),
        },
      },
      async ({ search }) => {
        try {
          const response = await this.axiosInstance.get<SearchResponse<Films>>(
            "/films/",
            {
              params: { search },
            }
          );

          if (response.data.results.length === 0) {
            return {
              content: [
                {
                  type: "text" as const,
                  text: `Nenhum filme encontrado com o título "${search}".`,
                },
              ],
            };
          }

          const filmsInfo = response.data.results
            .map((film) => {
              return `Título: ${film.title}
                Episódio: ${film.episode_id}
                Diretor: ${film.director}
                Produtor: ${film.producer}
                Data de Lançamento: ${film.release_date}
                Abertura: ${film.opening_crawl}`;
            })
            .join("\n---\n\n");

          return {
            content: [
              {
                type: "text" as const,
                text: `Encontrados ${response.data.results.length} filme(s):\n\n${filmsInfo}`,
              },
            ],
          };
        } catch (error) {
          return this.handleError(error, "buscar filmes");
        }
      }
    );

    this.server.registerTool(
      "get_character_by_id",
      {
        title: "Obter Personagem por ID",
        description: "Obtém informações detalhadas de um personagem pelo ID",
        inputSchema: {
          id: z.number().describe("ID do personagem"),
        },
      },
      async ({ id }) => {
        try {
          const response = await this.axiosInstance.get<People>(
            `/people/${id}/`
          );

          const char = response.data;
          const characterInfo = `Nome: ${char.name}
            Altura: ${char.height}cm
            Massa: ${char.mass}kg
            Cor do Cabelo: ${char.hair_color}
            Cor dos Olhos: ${char.eye_color}
            Ano de Nascimento: ${char.birth_year}
            Gênero: ${char.gender}
            URL do Mundo Natal: ${char.homeworld}
            Número de Filmes: ${char.films.length}`;

          return {
            content: [
              {
                type: "text" as const,
                text: characterInfo,
              },
            ],
          };
        } catch (error) {
          return this.handleError(error, `obter personagem com ID ${id}`);
        }
      }
    );
  }

  private setupResources(): void {
    this.server.registerResource(
      "all_films",
      "swapi://films/all",
      {
        name: "Todos os Filmes",
        description: "Lista todos os filmes da saga Star Wars",
        mimeType: "text/plain",
      },
      async () => {
        try {
          const response = await this.axiosInstance.get<SearchResponse<Films>>(
            "/films/"
          );

          const filmsInfo = response.data.results
            .sort((a, b) => a.episode_id - b.episode_id)
            .map((film) => {
              return `Episódio ${film.episode_id}: ${film.title}
                Diretor: ${film.director}
                Lançamento: ${film.release_date}`;
            })
            .join("\n\n");

          return {
            contents: [
              {
                uri: "swapi://films/all",
                mimeType: "text/plain",
                text: `Filmes da Saga Star Wars:\n\n${filmsInfo}`,
              },
            ],
          };
        } catch (error) {
          throw new Error(`Erro ao buscar filmes: ${error}`);
        }
      }
    );
  }

  private handleError(error: unknown, operation: string) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      return {
        content: [
          {
            type: "text" as const,
            text: `Erro ao ${operation}: ${
              axiosError.response?.data ||
              axiosError.message ||
              "Erro desconhecido"
            }`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Erro inesperado ao ${operation}: ${error}`,
        },
      ],
      isError: true,
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error("SWAPI MCP Server rodando em stdio");
  }
}

const server = new SwapiMcpServer();
server.run().catch((error) => {
  console.error("Erro fatal ao iniciar o servidor:", error);
  process.exit(1);
});