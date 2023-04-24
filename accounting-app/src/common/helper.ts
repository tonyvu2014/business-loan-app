import { BalanceSheetDTO } from 'src/dto/balance-sheet.dto';

// Generating random balance sheet data
export const generateRandomBalanceSheet = (): BalanceSheetDTO[] => {
  const numberOfMonths: number = Math.floor(Math.random() * 36);

  const sheet: BalanceSheetDTO[] = [];

  for (let i = 0; i <= numberOfMonths; i++) {
    const current: Date = new Date();
    current.setMonth(current.getMonth() - i);
    const year: number = current.getFullYear();
    const month: number = current.getMonth();
    const plusOrMinus: number = Math.random() < 0.5 ? -1 : 1;

    const profitOrLoss: number =
      Math.floor(Math.random() * 100000) * plusOrMinus;
    const assetsValue: number = Math.floor(Math.random() * 1000000);

    sheet.push({
      year,
      month: month + 1,
      profitOrLoss,
      assetsValue,
    });
  }

  return sheet;
};
