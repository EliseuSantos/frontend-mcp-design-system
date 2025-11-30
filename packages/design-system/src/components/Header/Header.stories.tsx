import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta = {
  title: 'Design System/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Componente de header para páginas e seções.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Título principal do header',
    },
    subtitle: {
      control: 'text',
      description: 'Subtítulo opcional',
    },
    actions: {
      control: 'object',
      description: 'Lista de ações (botões) a serem exibidas no header',
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Header padrão com apenas título
 */
export const Default: Story = {
  args: {
    title: 'Título da Página',
  },
};

/**
 * Header com subtítulo
 */
export const WithSubtitle: Story = {
  args: {
    title: 'Título da Página',
    subtitle: 'Este é um subtítulo que fornece mais contexto sobre a página ou seção.',
  },
};

/**
 * Header com ações (botões)
 */
export const WithActions: Story = {
  args: {
    title: 'Título da Página',
    subtitle: 'Header com ações interativas',
    actions: [
      {
        label: 'Login',
        onClick: () => console.log('Login clicked'),
      },
      {
        label: 'Cadastrar',
        onClick: () => console.log('Cadastrar clicked'),
      },
    ],
  },
};

