import { useState } from 'react';
import { Header, Card, Button } from '@org/design-system';
import './App.css';

/**
 * Demo App - Time B
 * 
 * Este app demonstra como um time diferente pode consumir
 * o mesmo design system, garantindo consistência visual
 * entre diferentes produtos.
 */

// Dados mockados do cliente logado
const mockCliente = {
  nome: 'João Silva',
  email: 'joao.silva@example.com',
  telefone: '(11) 98765-4321',
  empresa: 'Tech Solutions Ltda',
  cargo: 'Desenvolvedor Full Stack',
  dataCadastro: '15/03/2023',
  status: 'Ativo',
  avatar: 'https://ui-avatars.com/api/?name=João+Silva&background=4f46e5&color=fff&size=200',
};

function App() {
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  const handleVerDetalhes = () => {
    setMostrarDetalhes(true);
  };

  return (
    <div className="app">
      <Header
        title="Time B - Dashboard"
        subtitle={`Bem-vindo, ${mockCliente.nome}`}
        actions={[
          {
            label: 'Configurações',
            onClick: () => {},
          },
          {
            label: 'Perfil',
            onClick: () => {},
          },
        ]}
      />

      <main className="app__main">
        <section className="app__client-section">
          <div className="app__client-header">
            <h2>Informações do Cliente</h2>
          </div>

          <div className="app__client-grid">
            <Card
              title="Dados Pessoais"
              description={`${mockCliente.nome}\n${mockCliente.email}\n${mockCliente.telefone}`}
              imageUrl={mockCliente.avatar}
              ctaLabel="Ver detalhes completos"
              onCtaClick={handleVerDetalhes}
            />
            
            <Card
              title="Informações Profissionais"
              description={`${mockCliente.empresa}\n${mockCliente.cargo}\nStatus: ${mockCliente.status}`}
              ctaLabel="Editar perfil"
              onCtaClick={() => {}}
            />
            
            <Card
              title="Conta"
              description={`Membro desde ${mockCliente.dataCadastro}\nÚltimo acesso: Hoje às 14:30`}
              ctaLabel="Ver histórico"
              onCtaClick={() => {}}
            />
          </div>

          <div className="app__client-actions">
            <Button
              label="Ver Detalhes do Usuário"
              variant="primary"
              onClick={handleVerDetalhes}
            />
            <Button
              label="Editar Informações"
              variant="secondary"
              onClick={() => {}}
            />
          </div>

          {mostrarDetalhes && (
            <div className="app__client-details">
              <h3>Detalhes do Usuário</h3>
              <div className="app__client-details-content">
                <p><strong>Nome completo:</strong> {mockCliente.nome}</p>
                <p><strong>Email:</strong> {mockCliente.email}</p>
                <p><strong>Telefone:</strong> {mockCliente.telefone}</p>
                <p><strong>Empresa:</strong> {mockCliente.empresa}</p>
                <p><strong>Cargo:</strong> {mockCliente.cargo}</p>
                <p><strong>Data de cadastro:</strong> {mockCliente.dataCadastro}</p>
                <p><strong>Status:</strong> {mockCliente.status}</p>
              </div>
              <Button
                label="Fechar"
                variant="ghost"
                onClick={() => setMostrarDetalhes(false)}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;

