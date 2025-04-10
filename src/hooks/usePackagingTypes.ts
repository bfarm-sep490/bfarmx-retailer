import { useList } from '@refinedev/core';

export const usePackagingTypes = () => {
  const { data, isLoading } = useList({
    resource: 'packaging-types',
    meta: {
      headers: {
        accept: '*/*',
      },
    },
  });

  return {
    packagingTypes: data?.data || [],
    isLoading,
  };
};
