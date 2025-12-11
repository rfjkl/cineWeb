import { z } from 'zod'

export const FilmeSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  sinopse: z.string().min(10, 'Sinopse deve ter ao menos 10 caracteres'),
  classificacao: z.number().min(0),
  duracao: z.number().positive('Duração deve ser maior que 0'),
  genero: z.string().min(1),
  datasExibicao: z.array(z.string())
})

export const SalaSchema = z.object({
  numero: z.number().int().positive('Número inválido'),
  capacidade: z.number().int().positive('Capacidade inválida')
})

export const SessaoSchema = z.object({
  filmeId: z.number().int(),
  salaId: z.number().int(),
  dataHora: z.string().refine((d)=>!Number.isNaN(Date.parse(d)), { message: 'Data/Hora inválida' }).refine((d)=> new Date(d) >= new Date(new Date().toISOString().slice(0,16)), { message: 'Sessão não pode ser retroativa' })
})

export const LancheSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  preco: z.number().positive('Preço inválido')
})

export const PedidoSchema = z.object({
  data: z.string()
})
