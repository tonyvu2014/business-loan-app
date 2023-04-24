export enum DecisionOutcome {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export const generateRandomOutcome = (): string => {
  const possibleOutcomes = Object.keys(DecisionOutcome);
  const randomIndex = Math.floor(Math.random() * possibleOutcomes.length);
  return possibleOutcomes[randomIndex];
};
