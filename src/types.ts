export type Filme = {
  id?: number
  titulo: string
  sinopse: string
  classificacao: number
  duracao: number
  genero: string
  datasExibicao: string[]
}

export type Sala = {
  id?: number
  numero: number
  capacidade: number
}

export type Sessao = {
  id?: number
  filmeId: number
  salaId: number
  dataHora: string
}

export type Ingresso = {
  id?: number
  sessaoId: number
  tipo: 'Inteira' | 'Meia'
  valor: number
}
