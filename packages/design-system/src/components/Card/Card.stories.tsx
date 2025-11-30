import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'Design System/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de card para exibir informações estruturadas.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título do card',
    },
    description: {
      control: 'text',
      description: 'Descrição do card',
    },
    imageUrl: {
      control: 'text',
      description: 'URL da imagem opcional',
    },
    ctaLabel: {
      control: 'text',
      description: 'Label do botão de call-to-action',
    },
    onCtaClick: {
      action: 'cta-clicked',
      description: 'Callback executado ao clicar no CTA',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Card padrão sem imagem
 */
export const Default: Story = {
  args: {
    title: 'Título do Card',
    description: 'Esta é uma descrição do card que explica o conteúdo ou feature apresentada.',
    ctaLabel: 'Saiba mais',
    onCtaClick: () => console.log('CTA clicked'),
  },
};

/**
 * Card com imagem
 */
export const WithImage: Story = {
  args: {
    title: 'Card com Imagem',
    description: 'Este card inclui uma imagem para tornar o conteúdo mais visual e atraente.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
    ctaLabel: 'Explorar',
    onCtaClick: () => console.log('CTA clicked'),
  },
};

/**
 * Card com descrição longa
 */
export const WithLongDescription: Story = {
  args: {
    title: 'Card com Descrição Longa',
    description: 'Este é um exemplo de card com uma descrição mais extensa. O texto pode ocupar múltiplas linhas e o card se ajusta automaticamente para acomodar o conteúdo. Isso é útil quando você precisa explicar conceitos mais complexos ou fornecer mais contexto ao usuário.',
    ctaLabel: 'Ler mais',
    onCtaClick: () => console.log('CTA clicked'),
  },
};

