import './Header.css';

export interface HeaderAction {
  label: string;
  onClick?: () => void;
}

export interface HeaderProps {
  /**
   * Título principal do header
   */
  title: string;
  /**
   * Subtítulo opcional
   */
  subtitle?: string;
  /**
   * Lista de ações (botões) a serem exibidas no header
   */
  actions?: HeaderAction[];
}

/**
 * Componente de header para páginas e seções.
 * 
 * Use para criar cabeçalhos consistentes com título, subtítulo e ações.
 */
export const Header = ({ title, subtitle, actions }: HeaderProps) => {
  return (
    <header className="header">
      <div className="header__content">
        <div className="header__text">
          <h1 className="header__title">{title}</h1>
          {subtitle && <p className="header__subtitle">{subtitle}</p>}
        </div>
        {actions && actions.length > 0 && (
          <div className="header__actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className="header__action"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

