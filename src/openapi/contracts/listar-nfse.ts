import type { EngineSchema } from "@invokta/core";
import { z } from "zod";

function schemaContract(
  schema: Readonly<Record<string, unknown>>,
  validator: z.ZodType<Record<string, unknown>>,
): EngineSchema<Record<string, unknown>, Record<string, unknown>> {
  return {
    "~standard": {
      version: 1,
      vendor: "invokta-generated-openapi",
      validate(value) {
        return validator["~standard"].validate(value);
      },
      jsonSchema: {
        input: () => schema,
        output: () => schema,
      },
    },
  };
}

const inputJsonSchema: Readonly<Record<string, unknown>> = {
  "type": "object",
  "properties": {
    "query": {
      "type": "object",
      "properties": {
        "effectiveDateStart": {
          "type": "string",
          "format": "date-time"
        },
        "effectiveDateEnd": {
          "type": "string",
          "format": "date-time"
        },
        "transactionId": {
          "type": "string"
        },
        "integrationId": {
          "type": "string"
        },
        "receiverFederalTaxNumber": {
          "maxLength": 14,
          "minLength": 0,
          "type": "string"
        },
        "receiverName": {
          "type": "string"
        },
        "receiverEmail": {
          "type": "string"
        },
        "page": {
          "type": "integer",
          "format": "int32"
        },
        "pageSize": {
          "type": "integer",
          "format": "int32"
        }
      },
      "additionalProperties": false
    }
  },
  "additionalProperties": false
};
const outputJsonSchema: Readonly<Record<string, unknown>> = {
  "type": "object",
  "properties": {
    "status": {
      "const": 200
    },
    "body": {
      "type": "object",
      "properties": {
        "totalCount": {
          "anyOf": [
            {
              "type": "integer",
              "format": "int64"
            },
            {
              "type": "null"
            }
          ]
        },
        "pageCount": {
          "anyOf": [
            {
              "type": "integer",
              "format": "int32",
              "readOnly": true
            },
            {
              "type": "null"
            }
          ]
        },
        "pageSize": {
          "type": "integer",
          "format": "int32"
        },
        "hasNext": {
          "type": "boolean"
        },
        "items": {
          "anyOf": [
            {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "ID da NF",
                    "format": "uuid"
                  },
                  "integrationId": {
                    "anyOf": [
                      {
                        "type": "string",
                        "description": "ID de integração"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "status": {
                    "enum": [
                      "created",
                      "enqueued",
                      "received",
                      "authorized",
                      "inContingent",
                      "rejected",
                      "canceled",
                      "denied",
                      "removed",
                      "disabled"
                    ],
                    "type": "string",
                    "description": "<p>Valores possíveis:</p>\n<ul>\n<li><b>created</b>: Criada — aguarda emissão explícita via issue ou gatilho automático (ex: afterPayment)</li>\n<li><b>enqueued</b>: Enfileirada para processamento junto à SEFAZ ou Prefeitura</li>\n<li><b>received</b>: Recebido</li>\n<li><b>authorized</b>: Autorizado</li>\n<li><b>inContingent</b>: Em contingência</li>\n<li><b>rejected</b>: Rejeitado</li>\n<li><b>canceled</b>: Cancelado</li>\n<li><b>denied</b>: Denegado</li>\n<li><b>removed</b>: Removido</li>\n<li><b>disabled</b>: Inutilizado</li>\n</ul>\n"
                  },
                  "model": {
                    "enum": [
                      "productInvoice",
                      "consumerInvoice",
                      "serviceInvoice"
                    ],
                    "type": "string",
                    "description": "<p>Valores possíveis:</p>\n<ul>\n<li><b>productInvoice</b>: NF-e</li>\n<li><b>consumerInvoice</b>: NFC-e</li>\n<li><b>serviceInvoice</b>: NFS-e</li>\n</ul>\n"
                  },
                  "environmentType": {
                    "enum": [
                      "production",
                      "development",
                      "simulation"
                    ],
                    "type": "string",
                    "description": "<p>Valores possíveis:</p>\n<ul>\n<li><b>production</b>: Produção</li>\n<li><b>development</b>: Homologação</li>\n<li><b>simulation</b>: </li>\n</ul>\n"
                  },
                  "issuedOn": {
                    "anyOf": [
                      {
                        "type": "string",
                        "description": "Data de emissão",
                        "format": "date-time"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "effectiveDate": {
                    "anyOf": [
                      {
                        "type": "string",
                        "description": "Data de competência",
                        "format": "date-time"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "receiver": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Nome [xName]"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "federalTaxNumber": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "CPF / CNPJ / Doc Estrangeiro ( [CPF] / [CNPJ] )"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "stateTaxNumber": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Inscrição estadual [IE]"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "suframaTaxNumber": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Inscrição na SUFRAMA do destinatário [ISUF] — obrigatória em vendas com isenção para ZFM/Áreas de Livre Comércio"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "cityTaxNumber": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Inscrição municipal"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "email": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "E-mail [email]"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "phoneNumber": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Telefone"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "address": {
                        "type": "object",
                        "properties": {
                          "street": {
                            "anyOf": [
                              {
                                "maxLength": 100,
                                "minLength": 0,
                                "type": "string",
                                "description": "Logradouro"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "district": {
                            "anyOf": [
                              {
                                "maxLength": 100,
                                "minLength": 0,
                                "type": "string",
                                "description": "Bairro"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "postalCode": {
                            "anyOf": [
                              {
                                "maxLength": 15,
                                "minLength": 0,
                                "type": "string",
                                "description": "CEP"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "number": {
                            "anyOf": [
                              {
                                "maxLength": 10,
                                "minLength": 0,
                                "type": "string",
                                "description": "Número"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "additionalInformation": {
                            "anyOf": [
                              {
                                "maxLength": 150,
                                "minLength": 0,
                                "type": "string",
                                "description": "Complemento"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "city": {
                            "type": "object",
                            "properties": {
                              "name": {
                                "anyOf": [
                                  {
                                    "type": "string",
                                    "description": "Nome [xMun]"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              },
                              "state": {
                                "anyOf": [
                                  {
                                    "type": "string",
                                    "description": "Estado [UF]"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              },
                              "code": {
                                "anyOf": [
                                  {
                                    "type": "integer",
                                    "description": "Código IBGE",
                                    "format": "int32"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              }
                            },
                            "additionalProperties": false
                          },
                          "country": {
                            "anyOf": [
                              {
                                "type": "string",
                                "description": "Sigla do País (padrão ISO 3166-1 https://bit.ly/4cpb1Dh)\r\nExemplo: BRA, USA, ARG"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          }
                        },
                        "additionalProperties": false
                      }
                    },
                    "additionalProperties": false
                  },
                  "company": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Nome fantasia"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "legalName": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Razão Social"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "federalTaxNumber": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "CNPJ"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "stateTaxNumber": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Inscrição Estadual"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "cityTaxNumber": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Inscrição Municipal"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "additionalProperties": false
                  },
                  "order": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "date": {
                        "type": "string",
                        "format": "date-time"
                      },
                      "transactionId": {
                        "anyOf": [
                          {
                            "type": "string"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "additionalProperties": false
                  },
                  "authorization": {
                    "type": "object",
                    "properties": {
                      "date": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Data de autorização pela SEFAZ ou Prefeitura",
                            "format": "date-time"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "protocol": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Protocolo de autorização"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "digestValue": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Digest value do XML autorizado"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "additionalProperties": false,
                    "description": "Dados de autorização da nota fiscal"
                  },
                  "amount": {
                    "type": "number",
                    "description": "Valor total da NF",
                    "format": "double"
                  },
                  "number": {
                    "anyOf": [
                      {
                        "type": "integer",
                        "description": "Número",
                        "format": "int64"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "processingDetail": {
                    "type": "object",
                    "properties": {
                      "status": {
                        "enum": [
                          "processing",
                          "success",
                          "failed"
                        ],
                        "type": "string",
                        "description": "<p>Valores possíveis:</p>\n<ul>\n<li><b>processing</b>: Em processamento — evento na fila aguardando execução</li>\n<li><b>success</b>: Processado com sucesso — indica que o evento foi executado, não que a nota foi autorizada. Uma nota rejeitada também terá status Success.</li>\n<li><b>failed</b>: Falha interna no processamento do evento na fila (erro de infraestrutura)</li>\n</ul>\n"
                      },
                      "message": {
                        "anyOf": [
                          {
                            "type": "string"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "code": {
                        "anyOf": [
                          {
                            "type": "string"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "on": {
                        "anyOf": [
                          {
                            "type": "string",
                            "format": "date-time"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "additionalProperties": false
                  },
                  "description": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "totals": {
                    "required": [
                      "invoiceAmount"
                    ],
                    "type": "object",
                    "properties": {
                      "invoiceAmount": {
                        "type": "number",
                        "description": "Valor total da NF-e",
                        "format": "double"
                      },
                      "netAmount": {
                        "type": "number",
                        "description": "Valor líquido",
                        "format": "double"
                      },
                      "issBaseTax": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Base de cálculo do ISS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "irRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota do IR",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "csllRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota do CSLL",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "pisRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota do PIS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "cofinsRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota do COFINS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "inssRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota do INSS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "issRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota do ISS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "issAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do ISS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "discountUnconditionedAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor total do desconto incondicionado",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "discountConditionedAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor total do desconto condicionado",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "irAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do IR",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "pisCofinsBaseTax": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Base de cálculo do Pis/Cofins",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "pisAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do PIS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "cofinsAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do COFINS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "inssAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do INSS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "csllAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do CSLL",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "othersAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor de outros tributos",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "deductionsAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor das deduções",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "irWithheld": {
                        "anyOf": [
                          {
                            "type": "boolean",
                            "description": "IR retido"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "issWithheld": {
                        "anyOf": [
                          {
                            "type": "boolean",
                            "description": "ISS retido"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "cofinsWithheld": {
                        "anyOf": [
                          {
                            "type": "boolean",
                            "description": "COFINS retido"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "inssWithheld": {
                        "anyOf": [
                          {
                            "type": "boolean",
                            "description": "INSS retido"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "csllWithheld": {
                        "anyOf": [
                          {
                            "type": "boolean",
                            "description": "CSLL retido"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "pisWithheld": {
                        "anyOf": [
                          {
                            "type": "boolean",
                            "description": "PIS retido"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "ibsStateRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota do IBS de competência da UF",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "ibsCityRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota vigente do IBS do Município",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "cbsRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota vigente da CBS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "ibsCbsBaseTax": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Base de cálculo do IBS e CBS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "ibsStateAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do IBS de competência da UF",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "ibsCityAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do IBS de competência do Município",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "ibsAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor do IBS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "cbsAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor da CBS",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "receivedAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor total recebido pelo serviço prestado",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "additionalProperties": false
                  },
                  "rps": {
                    "type": "object",
                    "properties": {
                      "number": {
                        "type": "integer",
                        "format": "int64"
                      },
                      "series": {
                        "anyOf": [
                          {
                            "type": "string"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      }
                    },
                    "additionalProperties": false
                  },
                  "location": {
                    "type": "object",
                    "properties": {
                      "code": {
                        "anyOf": [
                          {
                            "type": "integer",
                            "description": "Código IBGE",
                            "format": "int32"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "name": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Nome"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "state": {
                        "enum": [
                          "ro",
                          "ac",
                          "am",
                          "rr",
                          "pa",
                          "ap",
                          "to",
                          "ma",
                          "pi",
                          "ce",
                          "rn",
                          "pb",
                          "pe",
                          "al",
                          "se",
                          "ba",
                          "mg",
                          "es",
                          "rj",
                          "sp",
                          "pr",
                          "sc",
                          "rs",
                          "ms",
                          "mt",
                          "go",
                          "df",
                          "an",
                          "ex"
                        ],
                        "type": "string",
                        "description": "<p>Valores possíveis:</p>\n<ul>\n<li><b>rO</b>: Rondônia</li>\n<li><b>aC</b>: Acre</li>\n<li><b>aM</b>: Amazonas</li>\n<li><b>rR</b>: Roraima</li>\n<li><b>pA</b>: Pará</li>\n<li><b>aP</b>: Amapá</li>\n<li><b>tO</b>: Tocantins</li>\n<li><b>mA</b>: Maranhão</li>\n<li><b>pI</b>: Piauí</li>\n<li><b>cE</b>: Ceará</li>\n<li><b>rN</b>: Rio Grande do Norte</li>\n<li><b>pB</b>: Paraíba</li>\n<li><b>pE</b>: Pernambuco</li>\n<li><b>aL</b>: Alagoas</li>\n<li><b>sE</b>: Sergipe</li>\n<li><b>bA</b>: Bahia</li>\n<li><b>mG</b>: Minas Gerais</li>\n<li><b>eS</b>: Espírito Santo</li>\n<li><b>rJ</b>: Rio de Janeiro</li>\n<li><b>sP</b>: São Paulo</li>\n<li><b>pR</b>: Paraná</li>\n<li><b>sC</b>: Santa Catarina</li>\n<li><b>rS</b>: Rio Grande do Sul</li>\n<li><b>mS</b>: Mato Grosso do Sul</li>\n<li><b>mT</b>: Mato Grosso</li>\n<li><b>gO</b>: Goiás</li>\n<li><b>dF</b>: Distrito Federal</li>\n<li><b>aN</b>: Ambiente Nacional</li>\n<li><b>eX</b>: Exterior</li>\n</ul>\n"
                      }
                    },
                    "additionalProperties": false
                  },
                  "ibsCbs": {
                    "type": "object",
                    "properties": {
                      "cst": {
                        "anyOf": [
                          {
                            "type": "integer",
                            "description": "Código de Situação Tributária do IBS e CBS",
                            "format": "int32"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "classification": {
                        "anyOf": [
                          {
                            "type": "integer",
                            "description": "Código de Classificação Tributária do IBS e CBS",
                            "format": "int32"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "operationIndicatorCode": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Código indicador da operação de fornecimento"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "isPersonalUse": {
                        "type": "boolean",
                        "description": "Indica operação de uso ou consumo pessoal"
                      },
                      "operationType": {
                        "enum": [
                          "supplyWithSubsequentPayment",
                          "paymentReceivedAfterSupply",
                          "supplyWithPriorPayment",
                          "paymentReceivedBeforeSupply",
                          "simultaneousSupplyAndPayment"
                        ],
                        "type": "string",
                        "description": "Tipo de operação com entes governamentais ou bens imóveis — NT 2025.002 Reforma Tributária<p>Valores possíveis:</p>\n<ul>\n<li><b>supplyWithSubsequentPayment</b>: Fornecimento com pagamento posterior</li>\n<li><b>paymentReceivedAfterSupply</b>: Recebimento do pagamento com fornecimento já realizado</li>\n<li><b>supplyWithPriorPayment</b>: Fornecimento com pagamento já realizado</li>\n<li><b>paymentReceivedBeforeSupply</b>: Recebimento do pagamento com fornecimento posterior</li>\n<li><b>simultaneousSupplyAndPayment</b>: Fornecimento e recebimento do pagamento concomitantes</li>\n</ul>\n"
                      },
                      "governmentEntityType": {
                        "enum": [
                          "union",
                          "state",
                          "federal",
                          "city"
                        ],
                        "type": "string",
                        "description": "Tipo de ente governamental — NT 2025.002 Reforma Tributária<p>Valores possíveis:</p>\n<ul>\n<li><b>union</b>: União</li>\n<li><b>state</b>: Estado</li>\n<li><b>federal</b>: Distrito Federal</li>\n<li><b>city</b>: Município</li>\n</ul>\n"
                      },
                      "property": {
                        "type": "object",
                        "properties": {
                          "fiscalPropertyTaxNumber": {
                            "anyOf": [
                              {
                                "type": "string",
                                "description": "Inscrição imobiliária fiscal"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "cibCode": {
                            "anyOf": [
                              {
                                "type": "string",
                                "description": "Código do Cadastro Imobiliário Brasileiro - CIB"
                              },
                              {
                                "type": "null"
                              }
                            ]
                          },
                          "address": {
                            "type": "object",
                            "properties": {
                              "street": {
                                "anyOf": [
                                  {
                                    "maxLength": 100,
                                    "minLength": 0,
                                    "type": "string",
                                    "description": "Logradouro"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              },
                              "district": {
                                "anyOf": [
                                  {
                                    "maxLength": 100,
                                    "minLength": 0,
                                    "type": "string",
                                    "description": "Bairro"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              },
                              "postalCode": {
                                "anyOf": [
                                  {
                                    "maxLength": 15,
                                    "minLength": 0,
                                    "type": "string",
                                    "description": "CEP"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              },
                              "number": {
                                "anyOf": [
                                  {
                                    "maxLength": 10,
                                    "minLength": 0,
                                    "type": "string",
                                    "description": "Número"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              },
                              "additionalInformation": {
                                "anyOf": [
                                  {
                                    "maxLength": 150,
                                    "minLength": 0,
                                    "type": "string",
                                    "description": "Complemento"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              },
                              "city": {
                                "type": "object",
                                "properties": {
                                  "name": {
                                    "anyOf": [
                                      {
                                        "type": "string",
                                        "description": "Nome [xMun]"
                                      },
                                      {
                                        "type": "null"
                                      }
                                    ]
                                  },
                                  "state": {
                                    "anyOf": [
                                      {
                                        "type": "string",
                                        "description": "Estado [UF]"
                                      },
                                      {
                                        "type": "null"
                                      }
                                    ]
                                  },
                                  "code": {
                                    "anyOf": [
                                      {
                                        "type": "integer",
                                        "description": "Código IBGE",
                                        "format": "int32"
                                      },
                                      {
                                        "type": "null"
                                      }
                                    ]
                                  }
                                },
                                "additionalProperties": false
                              },
                              "country": {
                                "anyOf": [
                                  {
                                    "type": "string",
                                    "description": "Sigla do País (padrão ISO 3166-1 https://bit.ly/4cpb1Dh)\r\nExemplo: BRA, USA, ARG"
                                  },
                                  {
                                    "type": "null"
                                  }
                                ]
                              }
                            },
                            "additionalProperties": false
                          }
                        },
                        "additionalProperties": false
                      }
                    },
                    "additionalProperties": false
                  },
                  "nbsCode": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "nationalTaxationCode": {
                    "anyOf": [
                      {
                        "type": "string"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "batchNumber": {
                    "anyOf": [
                      {
                        "type": "integer",
                        "format": "int32"
                      },
                      {
                        "type": "null"
                      }
                    ]
                  },
                  "approximateTaxes": {
                    "type": "object",
                    "properties": {
                      "federalAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor total Federal",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "federalRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota Federal",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "municipalRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota Municipal",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "municipalAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor total municipal",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "stateAmount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor total estadual",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "stateRate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota Estadual",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "amount": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Valor total da tributação",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "rate": {
                        "anyOf": [
                          {
                            "type": "number",
                            "description": "Alíquota total",
                            "format": "double"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "version": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Versão"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "source": {
                        "anyOf": [
                          {
                            "type": "string",
                            "description": "Fonte da tributação"
                          },
                          {
                            "type": "null"
                          }
                        ]
                      },
                      "mode": {
                        "enum": [
                          "disabled",
                          "detailed",
                          "simplified"
                        ],
                        "type": "string",
                        "description": "<p>Valores possíveis:</p>\n<ul>\n<li><b>disabled</b>: Desabilitado</li>\n<li><b>detailed</b>: Detalhado</li>\n<li><b>simplified</b>: Simplificado</li>\n</ul>\n"
                      }
                    },
                    "additionalProperties": false
                  }
                },
                "additionalProperties": false
              }
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "additionalProperties": false
    }
  },
  "required": [
    "status",
    "body"
  ],
  "additionalProperties": false
};

export type ListarNfseInput = {
  readonly "query"?: {
    readonly "effectiveDateStart"?: string;
    readonly "effectiveDateEnd"?: string;
    readonly "transactionId"?: string;
    readonly "integrationId"?: string;
    readonly "receiverFederalTaxNumber"?: string;
    readonly "receiverName"?: string;
    readonly "receiverEmail"?: string;
    readonly "page"?: number;
    readonly "pageSize"?: number;
  };
};
export type ListarNfseOutput = {
  readonly "status": 200;
  readonly "body": {
    readonly "totalCount"?: (
      number |
      null
    );
    readonly "pageCount"?: (
      number |
      null
    );
    readonly "pageSize"?: number;
    readonly "hasNext"?: boolean;
    readonly "items"?: (
      readonly {
          readonly "id"?: string;
          readonly "integrationId"?: (
            string |
            null
          );
          readonly "status"?: "created" | "enqueued" | "received" | "authorized" | "inContingent" | "rejected" | "canceled" | "denied" | "removed" | "disabled";
          readonly "model"?: "productInvoice" | "consumerInvoice" | "serviceInvoice";
          readonly "environmentType"?: "production" | "development" | "simulation";
          readonly "issuedOn"?: (
            string |
            null
          );
          readonly "effectiveDate"?: (
            string |
            null
          );
          readonly "receiver"?: {
            readonly "name"?: (
              string |
              null
            );
            readonly "federalTaxNumber"?: (
              string |
              null
            );
            readonly "stateTaxNumber"?: (
              string |
              null
            );
            readonly "suframaTaxNumber"?: (
              string |
              null
            );
            readonly "cityTaxNumber"?: (
              string |
              null
            );
            readonly "email"?: (
              string |
              null
            );
            readonly "phoneNumber"?: (
              string |
              null
            );
            readonly "address"?: {
              readonly "street"?: (
                string |
                null
              );
              readonly "district"?: (
                string |
                null
              );
              readonly "postalCode"?: (
                string |
                null
              );
              readonly "number"?: (
                string |
                null
              );
              readonly "additionalInformation"?: (
                string |
                null
              );
              readonly "city"?: {
                readonly "name"?: (
                  string |
                  null
                );
                readonly "state"?: (
                  string |
                  null
                );
                readonly "code"?: (
                  number |
                  null
                );
              };
              readonly "country"?: (
                string |
                null
              );
            };
          };
          readonly "company"?: {
            readonly "name"?: (
              string |
              null
            );
            readonly "legalName"?: (
              string |
              null
            );
            readonly "federalTaxNumber"?: (
              string |
              null
            );
            readonly "stateTaxNumber"?: (
              string |
              null
            );
            readonly "cityTaxNumber"?: (
              string |
              null
            );
          };
          readonly "order"?: {
            readonly "id"?: string;
            readonly "date"?: string;
            readonly "transactionId"?: (
              string |
              null
            );
          };
          readonly "authorization"?: {
            readonly "date"?: (
              string |
              null
            );
            readonly "protocol"?: (
              string |
              null
            );
            readonly "digestValue"?: (
              string |
              null
            );
          };
          readonly "amount"?: number;
          readonly "number"?: (
            number |
            null
          );
          readonly "processingDetail"?: {
            readonly "status"?: "processing" | "success" | "failed";
            readonly "message"?: (
              string |
              null
            );
            readonly "code"?: (
              string |
              null
            );
            readonly "on"?: (
              string |
              null
            );
          };
          readonly "description"?: (
            string |
            null
          );
          readonly "totals"?: {
            readonly "invoiceAmount": number;
            readonly "netAmount"?: number;
            readonly "issBaseTax"?: (
              number |
              null
            );
            readonly "irRate"?: (
              number |
              null
            );
            readonly "csllRate"?: (
              number |
              null
            );
            readonly "pisRate"?: (
              number |
              null
            );
            readonly "cofinsRate"?: (
              number |
              null
            );
            readonly "inssRate"?: (
              number |
              null
            );
            readonly "issRate"?: (
              number |
              null
            );
            readonly "issAmount"?: (
              number |
              null
            );
            readonly "discountUnconditionedAmount"?: (
              number |
              null
            );
            readonly "discountConditionedAmount"?: (
              number |
              null
            );
            readonly "irAmount"?: (
              number |
              null
            );
            readonly "pisCofinsBaseTax"?: (
              number |
              null
            );
            readonly "pisAmount"?: (
              number |
              null
            );
            readonly "cofinsAmount"?: (
              number |
              null
            );
            readonly "inssAmount"?: (
              number |
              null
            );
            readonly "csllAmount"?: (
              number |
              null
            );
            readonly "othersAmount"?: (
              number |
              null
            );
            readonly "deductionsAmount"?: (
              number |
              null
            );
            readonly "irWithheld"?: (
              boolean |
              null
            );
            readonly "issWithheld"?: (
              boolean |
              null
            );
            readonly "cofinsWithheld"?: (
              boolean |
              null
            );
            readonly "inssWithheld"?: (
              boolean |
              null
            );
            readonly "csllWithheld"?: (
              boolean |
              null
            );
            readonly "pisWithheld"?: (
              boolean |
              null
            );
            readonly "ibsStateRate"?: (
              number |
              null
            );
            readonly "ibsCityRate"?: (
              number |
              null
            );
            readonly "cbsRate"?: (
              number |
              null
            );
            readonly "ibsCbsBaseTax"?: (
              number |
              null
            );
            readonly "ibsStateAmount"?: (
              number |
              null
            );
            readonly "ibsCityAmount"?: (
              number |
              null
            );
            readonly "ibsAmount"?: (
              number |
              null
            );
            readonly "cbsAmount"?: (
              number |
              null
            );
            readonly "receivedAmount"?: (
              number |
              null
            );
          };
          readonly "rps"?: {
            readonly "number"?: number;
            readonly "series"?: (
              string |
              null
            );
          };
          readonly "location"?: {
            readonly "code"?: (
              number |
              null
            );
            readonly "name"?: (
              string |
              null
            );
            readonly "state"?: "ro" | "ac" | "am" | "rr" | "pa" | "ap" | "to" | "ma" | "pi" | "ce" | "rn" | "pb" | "pe" | "al" | "se" | "ba" | "mg" | "es" | "rj" | "sp" | "pr" | "sc" | "rs" | "ms" | "mt" | "go" | "df" | "an" | "ex";
          };
          readonly "ibsCbs"?: {
            readonly "cst"?: (
              number |
              null
            );
            readonly "classification"?: (
              number |
              null
            );
            readonly "operationIndicatorCode"?: (
              string |
              null
            );
            readonly "isPersonalUse"?: boolean;
            readonly "operationType"?: "supplyWithSubsequentPayment" | "paymentReceivedAfterSupply" | "supplyWithPriorPayment" | "paymentReceivedBeforeSupply" | "simultaneousSupplyAndPayment";
            readonly "governmentEntityType"?: "union" | "state" | "federal" | "city";
            readonly "property"?: {
              readonly "fiscalPropertyTaxNumber"?: (
                string |
                null
              );
              readonly "cibCode"?: (
                string |
                null
              );
              readonly "address"?: {
                readonly "street"?: (
                  string |
                  null
                );
                readonly "district"?: (
                  string |
                  null
                );
                readonly "postalCode"?: (
                  string |
                  null
                );
                readonly "number"?: (
                  string |
                  null
                );
                readonly "additionalInformation"?: (
                  string |
                  null
                );
                readonly "city"?: {
                  readonly "name"?: (
                    string |
                    null
                  );
                  readonly "state"?: (
                    string |
                    null
                  );
                  readonly "code"?: (
                    number |
                    null
                  );
                };
                readonly "country"?: (
                  string |
                  null
                );
              };
            };
          };
          readonly "nbsCode"?: (
            string |
            null
          );
          readonly "nationalTaxationCode"?: (
            string |
            null
          );
          readonly "batchNumber"?: (
            number |
            null
          );
          readonly "approximateTaxes"?: {
            readonly "federalAmount"?: (
              number |
              null
            );
            readonly "federalRate"?: (
              number |
              null
            );
            readonly "municipalRate"?: (
              number |
              null
            );
            readonly "municipalAmount"?: (
              number |
              null
            );
            readonly "stateAmount"?: (
              number |
              null
            );
            readonly "stateRate"?: (
              number |
              null
            );
            readonly "amount"?: (
              number |
              null
            );
            readonly "rate"?: (
              number |
              null
            );
            readonly "version"?: (
              string |
              null
            );
            readonly "source"?: (
              string |
              null
            );
            readonly "mode"?: "disabled" | "detailed" | "simplified";
          };
        }[] |
      null
    );
  };
};
export const inputValidator = z.fromJSONSchema(
  inputJsonSchema,
) as z.ZodType<Record<string, unknown>>;
export const outputValidator = z.fromJSONSchema(
  outputJsonSchema,
) as z.ZodType<Record<string, unknown>>;
export const inputSchema = schemaContract(
  inputJsonSchema,
  inputValidator,
) as EngineSchema<ListarNfseInput, ListarNfseInput>;
export const outputSchema = schemaContract(
  outputJsonSchema,
  outputValidator,
) as EngineSchema<ListarNfseOutput, ListarNfseOutput>;
