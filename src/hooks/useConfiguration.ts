import { useOne } from '@refinedev/core';

export const useConfiguration = () => {
  const { data: configurationData } = useOne({
    resource: 'configuration-systems',
    id: '',
  });

  const depositPercent = configurationData?.data?.deposit_percent || 30;
  const address = configurationData?.data?.address || '';
  const phone = configurationData?.data?.phone || '';

  return {
    depositPercent,
    address,
    phone,
  };
};
