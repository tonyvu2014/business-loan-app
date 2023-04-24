import React from 'react';
import { Card, Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const BalanceSheetCard = ({ balanceSheet }) => {
  return (
    <Card className="my-4 fs-6">
      <Table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Month</th>
            <th>Profit/Loss ($)</th>
            <th>Assets Value ($)</th>
          </tr>
        </thead>
        {balanceSheet.map((row, i) => (
          <tr key={i}>
            <td>{row.year}</td>
            <td>{row.month}</td>
            <td>{row.profitOrLoss}</td>
            <td>{row.assetsValue}</td>
          </tr>
        ))}
      </Table>
    </Card>
  );
};

BalanceSheetCard.propTypes = {
  balanceSheet: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      month: PropTypes.number.isRequired,
      profitOrLoss: PropTypes.number.isRequired,
      assetsValue: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default BalanceSheetCard;
