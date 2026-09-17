import React, { useState } from 'react';
import { 
  X, 
  Leaf, 
  HelpCircle, 
  Building2, 
  Users, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  TreePine, 
  Globe2, 
  ShieldCheck, 
  Flame, 
  Droplets,
  HeartHandshake,
  BookOpen,
  UserCheck,
  GraduationCap
} from 'lucide-react';
import authorImg from '../assets/author.jpg';

export default function InfoModal({ activeModal, onClose }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  if (!activeModal) return null;

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? -1 : index);
  };

  const faqs = [
    {
      q: 'O que é a plataforma Refaça o Verde?',
      a: 'É uma plataforma interativa de inteligência ambiental e conscientização ecológica focada no território brasileiro. Ela consolida dados geográficos de biomas, monitoramento de queimadas e desmatamento (INPE), condições meteorológicas em tempo real (Open-Meteo) e guias práticos de espécies nativas recomendadas para restauração florestal em cada estado.'
    },
    {
      q: 'De onde vêm os dados exibidos no mapa?',
      a: 'Os dados meteorológicos (temperatura, umidade, vento e precipitação) são obtidos via Open-Meteo em tempo real. As informações territoriais e demográficas são estruturadas a partir de bases públicas do IBGE. Os alertas e taxas de desmatamento e queimadas baseiam-se em estimativas consolidadas pelo INPE (PRODES/DETER/BDQueimadas).'
    },
    {
      q: 'Como posso saber quais árvores plantar na minha cidade/estado?',
      a: 'Ao selecionar seu estado no Mapa do Brasil, você terá acesso à aba "🌱 Espécies Recomendadas". Lá você encontra espécies nativas ideais para o bioma local (ex: Mogno, Pau-Brasil, Carnaúba, Araucária, Ipê), seus nomes científicos, tempo de crescimento e benefícios ecológicos.'
    },
    {
      q: 'O que são os Núcleos de Desertificação destacados no mapa?',
      a: 'São áreas com processo crítico e severo de degradação da terra e perda da vegetação nativa no Semiárido brasileiro (regiões como Gilbués/PI, Irauçuba/CE, Seridó/RN-PB e Cabrobó/PE). Essas áreas exigem atenção prioritária em manejo sustentável, retenção hídrica e espécies resistentes como Caatinga nativa.'
    },
    {
      q: 'Como denunciar desmatamento ou queimada ilegal?',
      a: 'Você pode registrar denúncias anônimas através do Linha Verde do IBAMA (telefone 0800 061 8080) ou pelo sistema Fala.BR do Governo Federal. Para focos de incêndio ativos, acione imediatamente o Corpo de Bombeiros (193).'
    }
  ];

  const organizations = [
    {
      name: 'IBAMA - Instituto Brasileiro do Meio Ambiente',
      category: 'Órgão Federal / Fiscalização',
      desc: 'Executa a política nacional de meio ambiente, licenciamento ambiental, controle de qualidade e fiscalização contra o desmatamento ilegal.',
      link: 'https://www.gov.br/ibama/pt-br',
      tag: 'Federal'
    },
    {
      name: 'ICMBio - Instituto Chico Mendes',
      category: 'Unidades de Conservação',
      desc: 'Responsável por propor, implantar, gerir, proteger e monitorar as Unidades de Conservação federais e a biodiversidade brasileira.',
      link: 'https://www.gov.br/icmbio/pt-br',
      tag: 'Federal'
    },
    {
      name: 'INPE - Instituto Nacional de Pesquisas Espaciais',
      category: 'Monitoramento & Satélites',
      desc: 'Desenvolve os sistemas PRODES, DETER e TerraBrasilis, que monitoram em tempo real o desmatamento e queimadas na Amazônia e Cerrado.',
      link: 'https://terrabrasilis.dpi.inpe.br/',
      tag: 'Pesquisa'
    },
    {
      name: 'Serviço Florestal Brasileiro (SFB)',
      category: 'Gestão Florestal & CAR',
      desc: 'Órgão responsável pela gestão das Florestas Públicas federais e pelo Cadastro Ambiental Rural (CAR).',
      link: 'https://www.gov.br/florestal/pt-br',
      tag: 'Federal'
    },
    {
      name: 'SOS Mata Atlântica',
      category: 'ONG & Restauração',
      desc: 'Atua na preservação e recuperação do bioma mais ameaçado do país, com projetos de restauração florestal e plantio de mudas.',
      link: 'https://www.sosma.org.br/',
      tag: 'ONG / Sociedade'
    },
    {
      name: 'Instituto Terra',
      category: 'ONG & Reflorestamento',
      desc: 'Iniciativa fundada por Sebastião Salgado no Vale do Rio Doce, referência global em regeneração de ecossistemas da Mata Atlântica.',
      link: 'https://institutoterra.org/',
      tag: 'ONG / Sociedade'
    },
    {
      name: 'Pacto pela Restauração da Mata Atlântica',
      category: 'Rede de Articulação',
      desc: 'Coalizão com mais de 300 instituições que busca recuperar 15 milhões de hectares até 2050.',
      link: 'https://www.pactomataatlantica.org.br/',
      tag: 'Aliança'
    },
    {
      name: 'Iniciativa 20x20',
      category: 'Cooperação Internacional',
      desc: 'Esforço liderado por países da América Latina e Caribe para proteger e restaurar mais de 50 milhões de hectares de terras degradadas.',
      link: 'https://initiative20x20.org/',
      tag: 'Internacional'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-box">
            {activeModal === 'about' && <Users className="modal-icon text-emerald" size={24} />}
            {activeModal === 'orgs' && <Building2 className="modal-icon text-emerald" size={24} />}
            {activeModal === 'faq' && <HelpCircle className="modal-icon text-emerald" size={24} />}
            <div>
              <h2 className="modal-title">
                {activeModal === 'about' && 'Sobre o Refaça o Verde'}
                {activeModal === 'orgs' && 'Órgãos e Entidades de Reflorestamento'}
                {activeModal === 'faq' && 'Perguntas e Dúvidas Frequentes'}
              </h2>
              <p className="modal-subtitle">
                {activeModal === 'about' && 'Conheça o propósito, missão e responsabilidade técnica da nossa iniciativa'}
                {activeModal === 'orgs' && 'Instituições oficiais, ONGs e projetos de proteção ambiental no Brasil'}
                {activeModal === 'faq' && 'Tudo o que você precisa saber sobre o mapa, biomas e preservação'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fechar modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body custom-scrollbar">
          {/* 1. QUEM SOMOS / SOBRE */}
          {activeModal === 'about' && (
            <div className="modal-about-content">
              {/* Responsável Técnico do Site */}
              <div className="about-author-card">
                <div className="author-photo-wrapper">
                  <img 
                    src={authorImg} 
                    alt="Responsável Técnico do Site" 
                    className="author-avatar-img"
                  />
                  <div className="author-verified-badge" title="Responsável Técnico">
                    <UserCheck size={14} />
                  </div>
                </div>
                <div className="author-details">
                  <div className="author-header-tag">
                    <GraduationCap size={15} className="text-emerald" />
                    <span>Responsável Técnico do Site</span>
                  </div>
                  <p className="author-bio-text">
                    Com o objetivo de juntar suas formações de <strong>Engenharia Ambiental</strong> e <strong>Análise e Desenvolvimento de Sistemas</strong> em um único projeto, o site <strong>"Refaça o Verde"</strong> desenvolvido por Antonio Brito traz um assunto de extrema importância no que diz respeito às pautas ambientais, e também organiza de maneira técnica os componentes e lógica para trazer ao usuário as informações relacionadas à conservação e regeneração de ecossistemas da melhor maneira possível.
                  </p>
                </div>
              </div>

              <div className="about-hero-card">
                <div className="hero-icon-circle">
                  <Leaf size={30} />
                </div>
                <div>
                  <h3 className="hero-title">Nossa Missão: Conectar Dados à Regeneração Ecológica</h3>
                  <p className="hero-text">
                    O <strong>Refaça o Verde</strong> transforma dados de satélites, meteorologia em tempo real e bases ecológicas em informação clara, acessível e acionável para qualquer cidadão, estudante, produtor rural ou pesquisador brasileiro.
                  </p>
                </div>
              </div>

              <div className="about-pillars-grid">
                <div className="about-pillar-card">
                  <div className="pillar-header">
                    <Globe2 className="text-emerald" size={20} />
                    <h4>Visão Territorial Integrada</h4>
                  </div>
                  <p>Apresentamos os 27 estados e seus 6 grandes biomas, demonstrando a riqueza e as particularidades de cada ecossistema nacional.</p>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-header">
                    <Flame className="text-orange" size={20} />
                    <h4>Combate à Degradação</h4>
                  </div>
                  <p>Mapeamos os núcleos críticos de desertificação e os índices de desmatamento para dar visibilidade às áreas que mais precisam de socorro.</p>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-header">
                    <TreePine className="text-emerald" size={20} />
                    <h4>Guia de Espécies Nativas</h4>
                  </div>
                  <p>Incentivamos o plantio inteligente recomendando árvores adaptadas a cada região, evitando monoculturas e espécies invasoras.</p>
                </div>

                <div className="about-pillar-card">
                  <div className="pillar-header">
                    <HeartHandshake className="text-blue" size={20} />
                    <h4>Acesso Aberto & Cidadania</h4>
                  </div>
                  <p>Uma plataforma 100% livre e aberta, desenhada para apoiar a educação ambiental e políticas públicas de conservação da natureza.</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. ÓRGÃOS E ENTIDADES */}
          {activeModal === 'orgs' && (
            <div className="modal-orgs-content">
              <div className="orgs-alert-box">
                <ShieldCheck size={22} className="text-emerald" />
                <p>
                  Conheça os principais órgãos governamentais e instituições do terceiro setor que lideram a fiscalização, restauração florestal e pesquisa ambiental no Brasil.
                </p>
              </div>

              <div className="orgs-grid">
                {organizations.map((org, idx) => (
                  <div key={idx} className="org-card">
                    <div className="org-card-top">
                      <span className={`org-badge ${org.tag === 'Federal' ? 'badge-federal' : org.tag === 'ONG / Sociedade' ? 'badge-ong' : 'badge-network'}`}>
                        {org.tag}
                      </span>
                      <a href={org.link} target="_blank" rel="noopener noreferrer" className="org-link-btn" title="Acessar site oficial">
                        <span>Acessar</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <h4 className="org-name">{org.name}</h4>
                    <span className="org-category">{org.category}</span>
                    <p className="org-desc">{org.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. DÚVIDAS FREQUENTES (FAQ) */}
          {activeModal === 'faq' && (
            <div className="modal-faq-content">
              <div className="faq-intro">
                <BookOpen size={20} className="text-emerald" />
                <span>Confira respostas para as principais dúvidas sobre o mapa e a preservação florestal:</span>
              </div>

              <div className="faq-accordion-list">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                      <button className="faq-question-btn" onClick={() => toggleFaq(index)}>
                        <span className="faq-question-text">{faq.q}</span>
                        {isOpen ? <ChevronUp size={18} className="text-emerald" /> : <ChevronDown size={18} />}
                      </button>
                      {isOpen && (
                        <div className="faq-answer-box">
                          <p>{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <span className="modal-footer-note">🌿 Refaça o Verde — Pela conservação e regeneração dos ecossistemas brasileiros</span>
          <button className="btn-close-modal" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
