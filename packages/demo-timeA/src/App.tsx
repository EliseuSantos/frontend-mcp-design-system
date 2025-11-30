import { Header, Card, Button } from '@org/design-system';
import './App.css';

/**
 * Demo App - Time A
 * 
 * Este app demonstra como um time pode consumir o design system
 * através do pacote @org/design-system e usar o MCP server para
 * descobrir componentes disponíveis.
 */
function App() {
  return (
    <div className="app">
      <Header
        title="Time A - Demo App"
        subtitle="Consumindo @org/design-system via workspace"
        actions={[
          {
            label: 'Ver Storybook',
            onClick: () => window.open('http://localhost:6006', '_blank'),
          },
        ]}
      />

      <main className="app__main">
        <section className="app__hero">
          <h2>Bem-vindo ao Time A</h2>
          <p>
            Este app usa componentes do design system centralizado.
            Os componentes são importados de <code>@org/design-system</code>.
          </p>
          <Button
            label="Explorar componentes"
            variant="primary"
            onClick={() => console.log('Explorar clicked')}
          />
        </section>

        <section className="app__features">
          <h2>Features do Time A</h2>
          <div className="app__cards">
            <Card
              title="Feature 1"
              description="Esta feature usa o componente Card do design system."
              ctaLabel="Saiba mais"
              onCtaClick={() => console.log('Feature 1 clicked')}
            />
            <Card
              title="Feature 2"
              description="Todos os componentes são consistentes entre os times."
              ctaLabel="Explorar"
              onCtaClick={() => console.log('Feature 2 clicked')}
            />
            <Card
              title="Feature 3"
              description="O MCP server permite que a IA descubra componentes automaticamente."
              ctaLabel="Ver MCP"
              onCtaClick={() => console.log('Feature 3 clicked')}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

