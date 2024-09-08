import { parse } from 'date-fns';
import { ja } from 'date-fns/locale';

export const formatDateFromString = dateString => {
  // Assuming dateString is in the format "yyyy年MM月dd日"
  return parse(dateString, 'yyyy年MM月dd日', new Date(), { locale: ja });
};
