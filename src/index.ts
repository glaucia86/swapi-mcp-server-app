#! /usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import {
  People, Planets, Films, SearchResponse,
} from "./types.js";

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
          search: z.string().describe("Nome do personagem a ser buscado"),
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

          const charactersInfo = response.data.results.map((char) => {
            return `Nome: ${char.name}
            Altura: ${char.height} cm
            Massa: ${char.mass} kg
            Cor do cabelo: ${char.hair_color}
            Cor da pele: ${char.skin_color}
            Cor dos olhos: ${char.eye_color}
            Ano de nascimento: ${char.birth_year}
            Gênero: ${char.gender}`;
          }).join("\n---\n\n");

          return {
            content: [
              {
                type: "text" as const,
                text: `Encontrados ${response.data.results.length} personagem(ns): \n\n${charactersInfo}`,
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
          search: z.string().describe("Nome do planeta a ser buscado"),
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

        const planetsInfo = response.data.results.map((planets) => {
          return `Nome: ${planets.name}
          Clima: ${planets.climate}
          Terreno: ${planets.terrain}
          População: ${planets.population}
          Diâmetro: ${planets.diameter} km
          Período de rotação: ${planets.rotation_period} h
          Período orbital: ${planets.orbital_period} dias`;
        }).join("\n---\n\n");

        return {
          content: [
            {
              type: "text" as const,
              text: `Encontrados ${response.data.results.length} planeta(s): \n\n${planetsInfo}`,
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
          search: z.string().describe("Título do filme a ser buscado"),
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

          const filmsInfo = response.data.results.map((film) => {
            return `Título: ${film.title}
            Episódio: ${film.episode_id}
            Data de Lançamento: ${film.release_date}
            Ano: ${film.release_date}
            Diretor: ${film.director}
            Produtores: ${film.producer}
            Sinopse: ${film.opening_crawl}
            Abertura: ${film.opening_crawl}`;
          }).join("\n---\n\n");

          return {
            content: [
              {
                type: "text" as const,
                text: `Encontrados ${response.data.results.length} filme(s): \n\n${filmsInfo}`,
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
        description: "Obtém detalhes de um personagem do Star Wars pelo ID",
        inputSchema: {
          id: z.number().describe("ID do personagem a ser obtido"),
        },
      },

      async ({ id }) => {
        try {
          const response = await this.axiosInstance.get<People>(`/people/${id}/`);
          const char = response.data;
          const characterInfo = `Nome: ${char.name}
          Altura: ${char.height} cm
          Massa: ${char.mass} kg
          Cor do cabelo: ${char.hair_color}
          Cor dos olhos: ${char.eye_color}
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
        description: "Lista todos os filmes do Star Wars",
        mimeType: "text/plain",
      },
      async () => {
        try {
          const response = await this.axiosInstance.get<SearchResponse<Films>>(
            "/films/"
          );

          const filmsInfo = response.data.results.sort((a, b) => a.episode_id - b.episode_id).map((film) => {
            return `Episódio ${film.episode_id}: ${film.title}
            Diretor: ${film.director}
            Lançamento: ${film.release_date}`
          }).join("\n\n");

          return {
            contents: [
              {
                uri: "swapi://films/all",
                mimeType: "text/plain",
                text: `Filmes da saga Star Wars:\n\n${filmsInfo}`,
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
            text: `Erro ao ${operation}: ${axiosError.response?.data || axiosError.message || 'Erro desconhecido'}`,
          }
        ],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Erro inesperado ao ${operation}: ${error}`,
        }
      ],
      isError: true,
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.log("Swapi MCP Server está rodando...");
  }
}

const server = new SwapiMcpServer();
server.run().catch((error) => {
  console.error("Erro ao iniciar o Swapi MCP Server:", error);
  process.exit(1);
});