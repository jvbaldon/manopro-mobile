import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <View className="flex-row items-center justify-center gap-2 py-4">
      {/* Botão Anterior */}
      <TouchableOpacity
        onPress={() => onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className={cn(
          'px-3 py-2 rounded-lg border',
          hasPrevPage ? 'border-[#2A9D76] bg-white' : 'border-gray-300 bg-gray-100'
        )}
      >
        <Text className={cn('font-semibold', hasPrevPage ? 'text-[#2A9D76]' : 'text-gray-400')}>
          ←
        </Text>
      </TouchableOpacity>

      {/* Indicador de Página */}
      <View className="px-4 py-2">
        <Text className="text-sm font-semibold text-gray-700">
          {currentPage} de {totalPages}
        </Text>
      </View>

      {/* Botão Próximo */}
      <TouchableOpacity
        onPress={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={cn(
          'px-3 py-2 rounded-lg border',
          hasNextPage ? 'border-[#2A9D76] bg-white' : 'border-gray-300 bg-gray-100'
        )}
      >
        <Text className={cn('font-semibold', hasNextPage ? 'text-[#2A9D76]' : 'text-gray-400')}>
          →
        </Text>
      </TouchableOpacity>
    </View>
  );
}
