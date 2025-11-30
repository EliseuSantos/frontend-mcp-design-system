import './Button.css';

export interface ButtonProps {
  /**
   * Texto exibido no botão
   */
  label: string;
  /**
   * Variante visual do botão
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'ghost';
  /**
   * Se o botão está desabilitado
   */
  disabled?: boolean;
  /**
   * Callback executado ao clicar no botão
   */
  onClick?: () => void;
}

/**
 * Componente de botão reutilizável com múltiplas variantes.
 * 
 * Use este componente para ações principais, secundárias ou ações discretas.
 */
export const Button = ({
  label,
  variant = 'primary',
  disabled = false,
  onClick,
}: ButtonProps) => {
  return (
    <button
      className={`button button--${variant}`}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

