import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [completouWizard, setCompletouWizard] = useState(() => {
    const status = localStorage.getItem('shapecheck_wizard_completo');
    return status === 'true'; 
  });

  const [usuario, setUsuario] = useState(() => {
    const dados = localStorage.getItem('shapecheck_user');
    return dados ? JSON.parse(dados) : null;
  });

  const finalizarCadastroWizard = (dadosDoFormulario, seriesGeradas) => {
    setUsuario(dadosDoFormulario);
    setCompletouWizard(true);
    
    localStorage.setItem('shapecheck_user', JSON.stringify(dadosDoFormulario));
    localStorage.setItem('shapecheck_wizard_completo', 'true');
    
    if (seriesGeradas && seriesGeradas.length > 0) {
      const seriesAntigas = JSON.parse(localStorage.getItem('minhasSeries') || '[]');
      const novasSeries = [...seriesAntigas, ...seriesGeradas];
      localStorage.setItem('minhasSeries', JSON.stringify(novasSeries));
    }
  };

  const sairDaConta = () => {
    setUsuario(null);
    setCompletouWizard(false);
    localStorage.removeItem('shapecheck_user');
    localStorage.removeItem('shapecheck_wizard_completo');
    localStorage.removeItem('minhasSeries'); 
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      completouWizard, 
      finalizarCadastroWizard, 
      sairDaConta 
    }}>
      {children}
    </AuthContext.Provider>
  );
};