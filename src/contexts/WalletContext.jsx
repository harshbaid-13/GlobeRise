import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { STORAGE_KEYS, SUPPORTED_NETWORKS } from '../utils/constants';

const WalletContext = createContext(null);

// Get configuration from environment variables
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const PLATFORM_ADDRESS = import.meta.env.VITE_PLATFORM_ADDRESS;
const EXPECTED_CHAIN_ID = Number(import.meta.env.VITE_EXPECTED_CHAIN_ID || '11155111');

// Error handling function from Integration Guide
const handleError = (error) => {
  // Monday-only withdrawal check
  if (error.message?.includes('NotWithdrawalDay')) {
    return 'Withdrawals only allowed on Mondays. Please try again on Monday.';
  }

  // Dormant sponsor check
  if (error.message?.includes('SponsorDormant')) {
    return 'Sponsor is dormant (90+ days inactive). Please choose a different sponsor.';
  }

  // Staking errors
  if (error.message?.includes('StakeNotMature')) {
    return 'Stake has not reached maturity yet. Please wait until the maturity date.';
  }
  if (error.message?.includes('StakeAlreadyClaimed')) {
    return 'This stake has already been claimed.';
  }

  // Custom contract errors
  if (error.message?.includes('NotRegistered')) {
    return 'Please register before using the platform';
  }
  if (error.message?.includes('InvalidAmount')) {
    return 'Invalid amount. Check minimum requirements';
  }
  if (error.message?.includes('InsufficientBalance')) {
    return 'Insufficient balance. Check your withdrawable amount';
  }
  if (error.message?.includes('EnforcedPause')) {
    return 'Platform is paused for maintenance. Please try again later';
  }

  // ERC20 errors
  if (error.message?.includes('ERC20InsufficientAllowance')) {
    return 'Please approve tokens first';
  }
  if (error.message?.includes('ERC20InsufficientBalance')) {
    return 'Insufficient RISE token balance';
  }

  // User rejected
  if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
    return 'Transaction cancelled by user';
  }

  // Network errors
  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection';
  }

  // Generic error
  return error.message || 'Transaction failed. Please try again';
};

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState({
    address: null,
    provider: null,
    signer: null,
    isConnected: false,
    chainId: null,
  });

  const [platform, setPlatform] = useState(null);
  const [token, setToken] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  // Check if Metamask is installed
  const isMetamaskInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isMetaMask;
  };

  // Check if Trust Wallet is installed
  const isTrustWalletInstalled = () => {
    return typeof window !== 'undefined' && window.ethereum && window.ethereum.isTrust;
  };

  // Check network (from Integration Guide)
  const checkNetwork = useCallback(async (provider) => {
    if (!provider) return false;
    try {
      const network = await provider.getNetwork();
      const currentChainId = Number(network.chainId);
      const isCorrect = currentChainId === EXPECTED_CHAIN_ID;
      setIsCorrectNetwork(isCorrect);
      return isCorrect;
    } catch (error) {
      console.error('Error checking network:', error);
      setIsCorrectNetwork(false);
      return false;
    }
  }, []);

  // Switch network
  const switchNetwork = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('Metamask is not installed');
    }

    const networkInfo = SUPPORTED_NETWORKS[EXPECTED_CHAIN_ID];
    if (!networkInfo) {
      throw new Error(`Unsupported chain ID: ${EXPECTED_CHAIN_ID}`);
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${EXPECTED_CHAIN_ID.toString(16)}` }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        // For BSC networks, we would need to add the chain
        // For now, just throw an error asking user to add manually
        throw new Error(
          `Please add ${networkInfo.name} (Chain ID: ${EXPECTED_CHAIN_ID}) to Metamask manually`
        );
      }
      throw switchError;
    }
  }, []);

  // Initialize contracts
  const initializeContracts = useCallback(async (signer) => {
    if (!TOKEN_ADDRESS || !PLATFORM_ADDRESS) {
      console.warn('Contract addresses not configured. Please set VITE_TOKEN_ADDRESS and VITE_PLATFORM_ADDRESS in .env');
      return { token: null, platform: null };
    }

    try {
      // TODO: Load ABIs from typechain-types or ABI files
      // For now, contracts will be null until ABIs are added
      // When ABIs are available, uncomment and use:
      // const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      // const platform = new ethers.Contract(PLATFORM_ADDRESS, PLATFORM_ABI, signer);

      // Placeholder for contract initialization
      const token = null;
      const platform = null;

      setToken(token);
      setPlatform(platform);

      return { token, platform };
    } catch (error) {
      console.error('Error initializing contracts:', error);
      return { token: null, platform: null };
    }
  }, []);

  // Connect wallet (MetaMask)
  const connectWallet = useCallback(async () => {
    try {
      if (!isMetamaskInstalled()) {
        throw new Error('Metamask is not installed. Please install Metamask extension.');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Check network
      const isCorrect = await checkNetwork(provider);

      // Initialize contracts
      const { token, platform } = await initializeContracts(signer);

      setWallet({
        address,
        provider,
        signer,
        isConnected: true,
        chainId,
      });

      // Store in localStorage using STORAGE_KEYS
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return { address, provider, signer, token, platform };
    } catch (error) {
      const errorMessage = handleError(error);
      console.error('Error connecting wallet:', errorMessage);
      throw new Error(errorMessage);
    }
  }, [checkNetwork, initializeContracts]);

  // Connect Trust Wallet
  const connectTrustWallet = useCallback(async () => {
    try {
      if (!isTrustWalletInstalled()) {
        throw new Error('Trust Wallet is not installed. Please install Trust Wallet extension.');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      // Check network
      const isCorrect = await checkNetwork(provider);

      // Initialize contracts
      const { token, platform } = await initializeContracts(signer);

      setWallet({
        address,
        provider,
        signer,
        isConnected: true,
        chainId,
      });

      // Store in localStorage using STORAGE_KEYS
      localStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
      localStorage.setItem(STORAGE_KEYS.WALLET_CONNECTED, 'true');

      // Listen for account changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return { address, provider, signer, token, platform };
    } catch (error) {
      const errorMessage = handleError(error);
      console.error('Error connecting Trust Wallet:', errorMessage);
      throw new Error(errorMessage);
    }
  }, [checkNetwork, initializeContracts]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }

      setWallet({
        address: null,
        provider: null,
        signer: null,
        isConnected: false,
        chainId: null,
      });
      setToken(null);
      setPlatform(null);
      setIsCorrectNetwork(false);

      localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
      localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, []);

  // Handle account changes
  const handleAccountsChanged = useCallback(
    async (accounts) => {
      if (accounts.length === 0) {
        await disconnect();
      } else {
        // Reconnect with new account
        try {
          await connectWallet();
        } catch (error) {
          console.error('Error reconnecting after account change:', error);
        }
      }
    },
    [disconnect, connectWallet]
  );

  // Handle chain changes
  const handleChainChanged = useCallback(
    async (chainId) => {
      // Reload to update network status
      window.location.reload();
    },
    []
  );

  // Check for existing connection on mount
  useEffect(() => {
    const checkExistingConnection = async () => {
      const savedAddress = localStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
      const isConnected = localStorage.getItem(STORAGE_KEYS.WALLET_CONNECTED) === 'true';

      if (isConnected && savedAddress && isMetamaskInstalled()) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          } else {
            // Clear invalid connection state
            localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
            localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
          }
        } catch (error) {
          console.error('Error reconnecting wallet:', error);
          // Clear invalid connection state
          localStorage.removeItem(STORAGE_KEYS.WALLET_ADDRESS);
          localStorage.removeItem(STORAGE_KEYS.WALLET_CONNECTED);
        }
      }
    };

    checkExistingConnection();
  }, [connectWallet]);

  const value = {
    // Wallet state
    address: wallet.address,
    provider: wallet.provider,
    signer: wallet.signer,
    isConnected: wallet.isConnected,
    chainId: wallet.chainId,
    isCorrectNetwork,

    // Contracts
    platform,
    token,

    // Network info
    expectedChainId: EXPECTED_CHAIN_ID,
    networkName: SUPPORTED_NETWORKS[EXPECTED_CHAIN_ID]?.name || 'Unknown',

    // Functions
    connectWallet,
    connectTrustWallet,
    disconnect,
    switchNetwork,
    isMetamaskInstalled,
    isTrustWalletInstalled,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;
