import './Card.css';

export interface CardProps {
  /**
   * Título do card
   */
  title: string;
  /**
   * Descrição do card
   */
  description: string;
  /**
   * URL da imagem opcional
   */
  imageUrl?: string;
  /**
   * Label do botão de call-to-action
   */
  ctaLabel?: string;
  /**
   * Callback executado ao clicar no CTA
   */
  onCtaClick?: () => void;
}

/**
 * Componente de card para exibir informações estruturadas.
 * 
 * Ideal para listagens, grids de conteúdo e apresentação de features.
 */
export const Card = ({
  title,
  description,
  imageUrl,
  ctaLabel,
  onCtaClick,
}: CardProps) => {
  return (
    <div className="card">
      {imageUrl && (
        <div className="card__image">
          <img src={imageUrl} alt={title} />
        </div>
      )}
      <div className="card__content">
        <h3 className="card__title">{title}</h3>
        <p className="card__description">{description}</p>
        {ctaLabel && (
          <button className="card__cta" onClick={onCtaClick}>
            {ctaLabel}
          </button>
        )}
      </div>
    </div>
  );
};

