import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Design System/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente de botão reutilizável com múltiplas variantes visuais.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Texto exibido no botão',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Variante visual do botão',
    },
    disabled: {
      control: 'boolean',
      description: 'Se o botão está desabilitado',
    },
    onClick: {
      action: 'clicked',
      description: 'Callback executado ao clicar no botão',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Botão primário - use para ações principais
 */
export const Primary: Story = {
  args: {
    label: 'Clique aqui',
    variant: 'primary',
    disabled: false,
  },
};

/**
 * Botão secundário - use para ações secundárias
 */
export const Secondary: Story = {
  args: {
    label: 'Ação secundária',
    variant: 'secondary',
    disabled: false,
  },
};

/**
 * Botão ghost - use para ações discretas ou terciárias
 */
export const Ghost: Story = {
  args: {
    label: 'Ação discreta',
    variant: 'ghost',
    disabled: false,
  },
};

/**
 * Botão desabilitado - estado quando a ação não está disponível
 */
export const Disabled: Story = {
  args: {
    label: 'Desabilitado',
    variant: 'primary',
    disabled: true,
  },
};

