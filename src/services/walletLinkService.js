import api from './api';

export const walletLinkService = {
  generateSignatureMessage: async (address) => {
    const response = await api.post('/wallets/link/signature-message', { address });
    return response.data.data;
  },

  linkWallet: async (data) => {
    const response = await api.post('/wallets/link/link', data);
    return response.data.data;
  },

  unlinkWallet: async (walletId) => {
    const response = await api.delete(`/wallets/link/unlink/${walletId}`);
    return response.data;
  },

  getLinkedWallets: async () => {
    const response = await api.get('/wallets/link/linked');
    return response.data.data;
  },

  getWalletBalances: async (address, chainId) => {
    const response = await api.get(`/wallets/link/balances/${address}?chainId=${chainId}`);
    return response.data.data;
  },
};

