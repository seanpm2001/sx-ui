import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useEnsAddress,
  useWalletClient
} from 'use-wagmi';
import { Web3Provider } from '@ethersproject/providers';
import { mainnet, goerli } from 'viem/chains';

const defaultChainId: any = import.meta.env.VITE_DEFAULT_NETWORK;

export function useWeb3() {
  const uiStore = useUiStore();

  const { connect } = useConnect({
    onError(e) {
      uiStore.addNotification('error', e.message);
    }
  });
  const { disconnect } = useDisconnect();
  const { address, isConnected, isConnecting, connector } = useAccount();
  const { chain } = useNetwork();
  const { data: ensAddress } = useEnsAddress();
  const { data: walletClient } = useWalletClient();

  const connectorId = computed(() => connector.value?.id ?? '');
  const defaultChain = computed(() => (defaultChainId === '1' ? mainnet : goerli));

  const web3WalletClient = computed(() => {
    if (chain?.value && walletClient?.value) {
      const network = {
        chainId: chain.value.id,
        name: chain.value.name,
        ensAddress: chain.value.contracts?.ensRegistry?.address
      };

      const web3Client = new Web3Provider(walletClient.value?.transport, network);
      if (web3Client) return web3Client;
    }
    return null;
  });

  return {
    connect,
    disconnect,
    chain: computed(() => chain?.value ?? defaultChain.value),
    web3Account: computed(() => address.value ?? ''),
    ensAddress: computed(() => ensAddress.value ?? ''),
    isConnected,
    isConnecting,
    web3WalletClient,
    connectorId
  };
}
